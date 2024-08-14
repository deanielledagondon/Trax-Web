import React from "react";
import CurrentQueue from "../../staff/screens/queue/CurrentQueue"
import Timer from "../../components/Queue/timer"
import Present from "../../components/Queue/present"

const Queue = () => {
  return (
    <div>
      <Present/>
      <Timer/>
    <CurrentQueue />
    </div>
  )
}

export default Queue