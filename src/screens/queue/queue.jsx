import React from "react";
import CurrentQueue from "./CurrentQueue";
import WindowSign from "../../components/Queue/windowsign"
import Present from "../../components/Queue/present"

const Queue = () => {
  return (
    <div>
      <WindowSign/>
      <Present/>
      
      <CurrentQueue/>
    </div>
  )
}

export default Queue