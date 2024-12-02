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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [selectedWindowQueue, setSelectedWindowQueue] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userWindows, setUserWindows] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const [isMovePopupVisible, setIsMovePopupVisible] = useState(false);
  const [queueToMove, setQueueToMove] = useState(null);
  const [targetWindow, setTargetWindow] = useState("");

   // Claiming popup state
   const [isClaimingPopupVisible, setIsClaimingPopupVisible] = useState(false);
   const [claimingNote, setClaimingNote] = useState("");
   const [claimingDate, setClaimingDate] = useState("");
   const [selectedQueueItem, setSelectedQueueItem] = useState(null);

  
  useEffect(() => {
    
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
            const userWindows = data[0].window_no; 
            setUserWindows(userWindows);

            const statusMap = {};
            userWindows.forEach((window) => {
              statusMap[window] = data[0].status; 
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
          .order("id", { ascending: true });

        if (selectedWindow) {
          query = query.eq("window_no", selectedWindow);
        } else if (userWindows.length > 0) {
          query = query.in("window_no", userWindows); 
        }

        if (filterStatus !== "All") {
          query = query.eq("status", filterStatus);
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
  }, [selectedWindow, userEmail, userWindows, filterStatus]);

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
      (item) => item.window_no === windowNo && item.status === "Waiting"
    );
    
    setSelectedWindowQueue(filteredQueueForWindow);
    setCurrentQueueIndex(0);
  };

  const handleNext = () => {
    setCurrentQueueIndex(
      (prevIndex) => (prevIndex + 1) % selectedWindowQueue.length
    );
  };

  const handlePending = async () => {
    const currentQueueItem = selectedWindowQueue[currentQueueIndex];
    console.log("Marking as pending:", currentQueueItem);

    try {
      const { error } = await supabase
        .from("queue")
        .update({ status: "Pending" })
        .eq("id", currentQueueItem.id);

      if (error) {
        throw new Error(`Error updating status to pending: ${error.message}`);
      }

      setSelectedWindowQueue((prevQueue) =>
        prevQueue.map((item) =>
          item.id === currentQueueItem.id ? { ...item, status: "Pending" } : item
        )
      );

    
      handleNext();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDoneFromList = async (item) => {
    console.log("Marking as done from list:", item);
  
    try {
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
  
      const newId = latestLog.length > 0 ? latestLog[0].id + 1 : 1;
  
      const { error: logError } = await supabase.from("log_history").insert([
        {
          id: newId,
          type: item.type,
          transaction_date: item.transaction_date,
          queue_no: item.queue_no,
          name: item.name,
          window_no: item.window_no,
          purpose: item.purpose,
          status: "Completed",
          created_at: new Date(),
        },
      ]);
  
      if (logError) {
        throw new Error(`Error logging into log_history: ${logError.message}`);
      }
  
      // Delete from queue
      const { error: deleteError } = await supabase
        .from("queue")
        .delete()
        .eq("id", item.id);
  
      if (deleteError) {
        throw new Error(`Error deleting from queue: ${deleteError.message}`);
      }
  
      setQueue((prevQueue) => prevQueue.filter((queueItem) => queueItem.id !== item.id));
    } catch (error) {
      console.error(error.message);
    }
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

   
    const newId = latestLog.length > 0 ? latestLog[0].id + 1 : 1;

    try {
    
      const { error: logError } = await supabase.from("log_history").insert([
        {
          id: newId,
          type: currentQueueItem.type,
          transaction_date: currentQueueItem.transaction_date,
          queue_no: currentQueueItem.queue_no,
          name: currentQueueItem.name,
          window_no: currentQueueItem.window_no,
          purpose: currentQueueItem.purpose,
          status: "Completed",
          
          created_at: new Date(), 
        },
      ]);

      if (logError) {
        throw new Error(`Error logging into log_history: ${logError.message}`);
      }

      
      const { error: deleteError } = await supabase
        .from("queue")
        .delete()
        .eq("id", currentQueueItem.id);

      if (deleteError) {
        throw new Error(`Error deleting from queue: ${deleteError.message}`);
      }

   
      setSelectedWindowQueue((prevQueue) =>
        prevQueue.filter((item) => item.id !== currentQueueItem.id)
      );

     
      handleNext();
    } catch (error) {
      console.error(error.message);
    }
  };

 
  const handleFilterClick = (status) => {
    setFilterStatus(status);
  };

  const filteredQueue = queue.filter(
    (item) =>
      (filterStatus === "All" || item.status === filterStatus) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.queue_no.toString().includes(searchTerm))
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQueueItem = selectedWindowQueue[currentQueueIndex];
  const handleCancel = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this queue?"
      );

      if (confirmed) {
        const { error } = await supabase
          .from("queue")
          .update({ status: "Cancelled" })
          .eq("id", id);

        if (error) {
          throw error;
        }

        setQueue(queue.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error canceling item:", error.message);
    }
  };


  const handleViewDetails = (details) => {
    setExpandedQueue(details);
    setIsPopupVisible(true); 
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); 
  };

  const handleMoveClick = (item) => {
    setQueueToMove(item); 
    setIsMovePopupVisible(true); 
  };

  
  const handleMoveQueue = async () => {
    if (!targetWindow || !queueToMove) {
      alert("Please select a target window.");
      return;
    }

    try {
     
      const { error } = await supabase
        .from("queue")
        .update({ window_no: targetWindow })
        .eq("id", queueToMove.id);

      if (error) {
        throw new Error(`Error moving queue: ${error.message}`);
      }

      setQueue((prevQueue) =>
        prevQueue.map((item) =>
          item.id === queueToMove.id
            ? { ...item, window_no: targetWindow }
            : item
        )
      );

 
      setIsMovePopupVisible(false);
      setQueueToMove(null);
      setTargetWindow("");
    } catch (error) {
      console.error("Error moving queue:", error.message);
    }
  };

  const handleClaim = (item) => {
    setSelectedQueueItem(item);
    setIsClaimingPopupVisible(true); // Show claiming popup
  };

  const handleClaimSubmit = async () => {
    try {
      if (!claimingNote || !claimingDate) {
        alert("Please fill in both the note and the claiming date.");
        return;
      }

      const { error } = await supabase
        .from("queue")
        .update({
          status: "Claimed", // Change status to "Claimed"
          claiming_note: claimingNote, // Store the note
          claiming_date: claimingDate, // Store the date
        })
        .eq("id", selectedQueueItem.id);

      if (error) {
        throw error;
      }

      setQueue(queue.map((item) =>
        item.id === selectedQueueItem.id
          ? { ...item, status: "Claimed", claiming_note: claimingNote, claiming_date: claimingDate }
          : item
      ));

      setIsClaimingPopupVisible(false); // Close the popup
      setClaimingNote(""); // Reset the fields
      setClaimingDate("");
    } catch (error) {
      console.error("Error claiming queue:", error.message);
    }
  };


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
            <Timer onDone={handleDone} onPending={handlePending} />
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
      <div className="filter-navbar">
      {["All", "Waiting", "Pending" , "Claiming", "Cancelled"].map((status) => (
        <button
          key={status}
          onClick={() => handleFilterClick(status)} // Click to update the filter
          className={`filter-button ${filterStatus === status ? "active" : ""}`}
        >
          {status}
        </button>
      ))}
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
                <div className="queue-no">{item.queue_no}</div>
                <p>{item.name}</p>
                <p
                  className={
                    item.status === "Waiting"
                    ? "status-waiting"
                    : item.status === "Pending"
                    ? "status-pending"
                    : item.status === "Claiming"
                    ? "status-claiming"
                    : item.status === "Cancelled"
                    ? "status-cancelled"
                    : ""
                  }
                >
                  <div
                    className="status-no"
                    style={
                      item.status === "Pending"
                      ? { color: "blue" }
                      : item.status === "Waiting"
                      ? { color: "orange" }
                      : item.status === "Claiming"
                      ? { color: "yellow" }
                      : item.status === "Cancelled"
                      ? { color: "red" }
                      : {}
                    }
                  >
                    {item.status}
                  </div>
                </p>

                <div className="item-actions">
                <button
                    onClick={() => handleClaim(item)}
                    className="btn btn-claim"
                  >
                    Claim
                  </button>


                  <button
                    onClick={() => handleCancel(item.id)} 
                    className="btn btn-cancel"
                        >
                    Cancel
                    </button>

        
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="btn btn-details"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleMoveClick(item)}
                    className="btn btn-move"
                  >
                    Move
                  </button>
                 
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-queue">No list at the moment.</div>
        )}
      </div>

      {isClaimingPopupVisible && (
    <div className="claiming-popup">
      <div className="popup-content">
        <h3>Claiming Details</h3>
        <textarea
          placeholder="Enter a note for claiming..."
          value={claimingNote}
          onChange={(e) => setClaimingNote(e.target.value)}
        />
        <input
          type="date"
          value={claimingDate}
          onChange={(e) => setClaimingDate(e.target.value)}
        />
        <div className="popup-buttons">
          <button onClick={handleClaimSubmit} className="submit-button">
            Submit
          </button>
          <button
            onClick={() => setIsClaimingPopupVisible(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

      {/* Move Popup */}
      {isMovePopupVisible && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h3>Move Queue</h3>
            <p>
              Moving <strong>{queueToMove?.name}</strong> (Queue No:{" "}
              {queueToMove?.queue_no}) to another window.
            </p>
            <label htmlFor="target-window"><p><strong>Select Target Window:</strong></p></label>
            <select
              id="target-window"
              value={targetWindow}
              onChange={(e) => setTargetWindow(e.target.value)}
            >
              <option value="">-- Select Window --</option>
              {["W1", "W2", "W3", "W4", "W5", "W6"]
                .filter((window) => window !== queueToMove?.window_no) // Exclude current window
                .map((window) => (
                  <option key={window} value={window}>
                    Window {window}
                  </option>
                ))}
            </select>
            <div className="popup-actions">
              <button onClick={handleMoveQueue} className="btn btn-confirm">
                Confirm
              </button>
              <button
                onClick={() => setIsMovePopupVisible(false)}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      

        {/* Pop-up for queue details */}
        {isPopupVisible && (
          <div className="queue-details-popup show">
            <div className="queue-details-content">
              <button className="close-btn" onClick={handleClosePopup}>
                &times;
              </button>
              <p><strong>Queue Details</strong></p>
              <p><strong>Name:</strong> {expandedQueue?.name}</p>
              <p><strong>Queue No:</strong> {expandedQueue?.queue_no}</p>
              <p><strong>Status:</strong> {expandedQueue?.status}</p>
              <p><strong>Window No:</strong> {expandedQueue?.window_no}</p>
              <p><strong>Purpose:</strong> {expandedQueue?.purpose}</p>
              {/* Add more details as needed */}

              <div className="popup-buttons">
             
              <button
                    onClick={() => handleDoneFromList(item)}
                    className="btn btn-done"
                  >
                    Done
                  </button>

              <button
                onClick={() => handleDelete(expandedQueue.id)}
                className="btn btn-delete"
              >
                Delete
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default CurrentQueue;
