import React, { useState, useEffect } from "react";
import { supabase } from "../../components/helper/supabaseClient";
import Timer from "../../components/Queue/timer";
import "./CurrentQueue.scss";

const CurrentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [expandedQueue, setExpandedQueue] = useState(null);
  const [windowsStatus, setWindowsStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [selectedWindowQueue, setSelectedWindowQueue] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userWindows, setUserWindows] = useState([]);

  useEffect(() => {
    // Get logged-in user's email
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchWindowsStatus = async () => {
      try {
        if (userEmail) {
          const { data, error } = await supabase
            .from("registrants")
            .select("window_no, email, status")
            .eq("email", userEmail);

          if (error) {
            console.error(error);
            throw error;
          }

          if (data.length > 0) {
            const userWindows = data[0].window_no; // Assume `window_no` is an array
            setUserWindows(userWindows);

            const statusMap = {};
            userWindows.forEach((window) => {
              statusMap[window] = data[0].status; // assuming status applies to all windows
            });
            setWindowsStatus(statusMap);
          }
        }
      } catch (error) {
        console.error("Error fetching windows status:", error.message);
      }
    };

    const fetchQueues = async () => {
      try {
        let query = supabase
          .from("queue")
          .select(
            "id, name, queue_no, status, window_no, purpose, created_at, type, transaction_date"
          )
          .eq("status", "Waiting")
          .order("id", { ascending: true });

        if (selectedWindow) {
          query = query.eq("window_no", selectedWindow);
        } else if (userWindows.length > 0) {
          query = query.in("window_no", userWindows); // Only fetch queues for the user's windows
        }

        const { data, error } = await query;

        if (error) {
          console.error(error);
          throw error;
        }
        setQueue(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWindowsStatus();
    fetchQueues();

    const intervalId = setInterval(() => {
      fetchQueues();
      fetchWindowsStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedWindow, userEmail, userWindows]);

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this queue?"
      );

      if (confirmed) {
        const { error } = await supabase.from("queue").delete().eq("id", id);

        if (error) {
          throw error;
        }

        setQueue(queue.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const handleViewQueue = (windowNo) => {
    setSelectedWindow(windowNo);

    const filteredQueueForWindow = queue.filter(
      (item) => item.window_no === windowNo
    );
    setSelectedWindowQueue(filteredQueueForWindow);
    setCurrentQueueIndex(0);
  };

  const handleNext = () => {
    setCurrentQueueIndex(
      (prevIndex) => (prevIndex + 1) % selectedWindowQueue.length
    );
  };

  const handleDone = async (time) => {
    const currentQueueItem = selectedWindowQueue[currentQueueIndex];
    console.log("Done with:", currentQueueItem);

    const { data: latestLog, error: fetchError } = await supabase
      .from("log_history")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (fetchError) {
      throw new Error(
        `Error fetching latest id from log_history: ${fetchError.message}`
      );
    }

    // Manually increment the id
    const newId = latestLog.length > 0 ? latestLog[0].id + 1 : 1;

    try {
      // Insert into log_history table
      const { error: logError } = await supabase.from("log_history").insert([
        {
          id: newId,
          type: currentQueueItem.type,
          transaction_date: currentQueueItem.transaction_date,
          queue_no: currentQueueItem.queue_no,
          name: currentQueueItem.name,
          window_no: currentQueueItem.window_no,
          purpose: currentQueueItem.purpose,
          status: "Processing",
          // time_taken: `${time.hr}:${time.min}:${time.sec}`,
          created_at: new Date(), // current timestamp
        },
      ]);

      if (logError) {
        throw new Error(`Error logging into log_history: ${logError.message}`);
      }

      // Delete the queue item from queue table after successful logging
      const { error: deleteError } = await supabase
        .from("queue")
        .delete()
        .eq("id", currentQueueItem.id);

      if (deleteError) {
        throw new Error(`Error deleting from queue: ${deleteError.message}`);
      }

      // Update the local state to remove the deleted item from queue
      setSelectedWindowQueue((prevQueue) =>
        prevQueue.filter((item) => item.id !== currentQueueItem.id)
      );

      // Move to the next item
      handleNext();
    } catch (error) {
      console.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    return status === "away"
      ? "red"
      : status === "available"
      ? "green"
      : "black";
  };

  const filteredQueue = queue.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.queue_no.toString().includes(searchTerm)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQueueItem = selectedWindowQueue[currentQueueIndex];

  return (
    <>
      <div className="window-status">
        <h2>Current Queue</h2>
        <div className="window-status-list">
          {userWindows.length > 0 ? (
            userWindows.map((window) => (
              <div className="window-status-cardd" key={window}>
                <h3>{`Window ${window}`}</h3>
                <button
                  onClick={() => handleViewQueue(window)}
                  className="btn btn-view-queue"
                >
                  Start Queue
                </button>
              </div>
            ))
          ) : (
            <p>No windows assigned to this user.</p>
          )}
        </div>

        {currentQueueItem ? (
          <div className="current-queue">
            <h1>Queue No: {currentQueueItem.queue_no}</h1>
            <p>Name: {currentQueueItem.name}</p>
            <Timer onDone={handleDone} />
          </div>
        ) : selectedWindowQueue.length > 0 ? (
          <p>
            <center>No more items in the queue.</center>
          </p>
        ) : (
          <p>
            <center>There's a queue are waiting for you!</center>
          </p>
        )}
      </div>

      <div className="current-queuee-container">
        <div className="current-queuee">
          <input
            type="text"
            placeholder="Search by name or queue number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="current-queue-list">
            {filteredQueue.length > 0 ? (
              filteredQueue.map((item) => (
                <div className="current-queue-card" key={item.id}>
                  <div className="item-info">
                    <div className="queue-no"> {item.queue_no}</div>
                    <p> {item.name} </p>
                    <p
                      className={
                        item.status === "Waiting" ? "status-waiting" : "#e79600"
                      }
                    >
                      <div className="status-no"> {item.status}</div>
                    </p>
                    <div className="item-actions">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setExpandedQueue(item)}
                        className="btn btn-details"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-queue">No queue at the moment</div>
            )}
          </div>
        </div>

        {expandedQueue && (
          <div className="queue-details">
            <h2>Queue Details</h2>
            <div className="details-card grid-layout">
              <div className="left-column">
                {expandedQueue.profile_image ? (
                  <img
                    src={expandedQueue.profile_image}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <span className="profile-icon">👤</span>
                )}
                <h3>{expandedQueue.name}</h3>
                <div className="appointment-schedule">
                  <p>{expandedQueue.queue_no}</p>
                </div>
              </div>
              <div className="right-column">
                <div className="DetailsQueue">
                  <h3>Appointment: </h3>
                  <p>{expandedQueue.created_at}</p>
                  <h3>Status: </h3>
                  <p>{expandedQueue.status}</p>
                  <h3>Details</h3>
                  <p>Purpose: {expandedQueue.purpose}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentQueue;
