
import { useEffect, useRef, useState } from "react";
import "./timer.scss";


function Timer() {
    const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });

    useEffect(() => {
      // handelTime();
      return () => clearInterval(id.current);
    }, []);
  
    let id = useRef();
  
    function handelTime() {
      id.current = setInterval(() => {
        setTime((prev) => {
          if (prev.sec == 60) {
            return { ...prev, min: prev.min + 1, sec: 0 };
          }
          if (prev.min == 60) {
            return { ...prev, hr: prev.hr + 1, min: 0, sec: 0 };
          }
          else{
            
          }
  
          return { ...prev, sec: prev.sec + 1 };
        });
      }, 1000);
    }

    const resetTimer =() => {
      time (0);
      setTime(false)
    }
  
    return (
      <div className="App-header">
        <h1>
          {time.hr.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
          :
          {time.min.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
          :
          {time.sec.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}

       
        </h1>
         <div classname= 'buttons'>
        
        <button onClick={() => handelTime()}>Start</button>
        <button onClick={() => clearInterval(id.current)}>Pause</button>
        <button
          onClick={() => {
            clearInterval(id.current);
            setTime(0);
          }}
        >
        <button onClick={() => resetTimer()}>Reset</button>  
        </button>
        </div>

        
      </div>
      
     
    );


    

    
  }

export default Timer;
