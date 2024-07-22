import "./topBox.scss"
import {topDealUsers} from "../data"
import React from "react"


const TopBox = () => {
  return (
    <div className="topBox">
      <h1>Windows Queue</h1>
      <div className="list">
        {topDealUsers.map(user=>(
          <div className="listItem" key={user.id}>
            <div className="user">
              <div className="userTexts">
                <span className="registrants">{user.window}</span>
            
              </div>
            </div>
            <span className="queue">{user.queue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopBox
