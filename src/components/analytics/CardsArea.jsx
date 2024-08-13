import React from 'react'
import './CardsArea.css'
import BigChartBox from './bigChartBox/BigChartBox'
import BarChartBox from './barChartBox/BarChartBox'
import PieChartBox from './pieCartBox/PieChartBox'

import {
  barChartBoxRevenue,
  barChartBoxVisit,
  topDealUsers,
} from "../analytics/barChartBox/data";
import TopBox from './topBox/TopBox'
import Barrchart from './Barrchart'

const Cards = () => {

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3> Overall Analytics</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Total Registrants</h3>
                </div>

                <h1>340</h1>

                
                <h4>this month</h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Average Visit Time</h3>
                    
                </div>
                <h1>4m 5s</h1>
                <h4>higher than yesterday </h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Window Analysis</h3>
                   
                </div>
                <h1>Window 6</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Service Comments</h3>
                   
                </div>
                <h1>25</h1>
                <h4>higher than yesterday  </h4>
            </div>
        </div>
      
      
      
      <div className= 'main-charts'>
        
        
      <div className="box box1">
      <TopBox {...topDealUsers}/>
      </div>
      <div className="box box2">
      <PieChartBox/>
      </div>
      <div className="box box3">
      <Barrchart/>
      </div>
      </div>

      <div className='main-titlee'>
            <h3>Feedback Analytics</h3>
        </div>

      <div className= 'main-charts'>
      <div className="box box4">
      <BarChartBox {...barChartBoxRevenue} />
      </div>
      <div className="box box5">
      <BigChartBox/>
      </div>
          
       </div>


          

  
    </main>
  )


  
}

export default Cards