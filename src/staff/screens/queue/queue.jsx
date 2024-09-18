import React from "react";
import CurrentQueue from "./CurrentQueue";

import Present from "../../components/Queue/present"

const Queue = () => {
  return (
    <div>
      <Present/>
      
      <CurrentQueue/>
    </div>
  )
}

export default Queue