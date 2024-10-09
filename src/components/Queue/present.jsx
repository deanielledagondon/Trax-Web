import React, { useState, useEffect } from 'react'; 
import { supabase } from '../../components/helper/supabaseClient';
import Timer from './timer';

const Present = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        let { data, error } = await supabase
          .from('queue')
          .select('id, name, queue_no, status, created_at')
          .eq('status', 'Waiting')
          .order('id', { ascending: true });
        if (error) {
          console.log(error);
          throw error;
        }
        setQueue(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQueues();

    const intervalId = setInterval(() => {
      fetchQueues();
    }, 3000);

   
    return () => clearInterval(intervalId);
  }, []);

  const handleNext = () => {
    setCurrentQueueIndex((prevIndex) => (prevIndex + 1) % queue.length);
  };

  const handleDone = async (time) => {
    const currentQueueItem = queue[currentQueueIndex];
    console.log('Done with:', currentQueueItem);

  
    await supabase
      .from('queue')
      .update({ status: 'Done', time_taken: `${time.hr}:${time.min}:${time.sec}` })
      .eq('id', currentQueueItem.id);

    handleNext();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQueueItem = queue[currentQueueIndex];

  return (
    <div className="current-queue">
      
      {currentQueueItem ? (
        <div>
          
          <h1>Queue No: {currentQueueItem.queue_no}</h1>
          <p>Name: {currentQueueItem.name}</p>
          <Timer onDone={handleDone} />
        </div>
      ) : (
        <p>No more items in the queue.</p>
      )}
    </div>
  );
};

export default Present;
