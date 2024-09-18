import "./topBox.scss"
import {topDealUsers} from "../barChartBox/data"
import React from "react"

const TopBox = () => {
  return (
    <div className="topBox">
      <h1>Today's Log</h1>
      <div className="list">
        {topDealUsers.map(user=>(
          <div className="listItem" key={user.id}>
            <div className="user">
              <div className="userTexts">
                <span className="notification">{user.notification}</span>
                <span className="purpose">{user.purpose}</span>
                <span className="minutes">{user.minutes}</span>
                

              </div>
            </div>
            <span className="completed">{user.completed}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopBox
