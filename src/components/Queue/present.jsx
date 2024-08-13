
import React from "react"
import './present.css'
import 
{ BsFillPersonFill}
 from 'react-icons/bs'

const Present = () => {
  return (


    <div className='main-container'>
        <div className='main-title'>
            <h3>Active Status</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
           <BsFillPersonFill className='card_icon' />
                <><div className='card-inner'>
                    <h3>Window 1</h3>
                </div>
                <div className='queue-inner'>
                <h1>W1001</h1></div>
                
                <h4>Now Serving</h4></>

         
            </div>
            <div className='card'>
           <BsFillPersonFill className='card_icon' />
           <><div className='card-inner'>
               <h3>Window 2</h3>

               
           </div>
           <div className='queue-inner'>
            <h1>W2001</h1>
            </div>
           <h4>Now Serving</h4></>
             </div>


             <div className='card'>
           
               <BsFillPersonFill className='card_icon' />
           <><div className='card-inner'>
               <h3>Window 3</h3>

           </div>
           <div className='queue-inner'>
           <h1>W3001</h1></div>
           
           <h4>Now Serving</h4></>
       </div>

            <div className='card'>
                <BsFillPersonFill className='card_icon'/>
                <div className='card-inner'>
                    
                    <h3> Window 4 </h3>
                </div>

                <div className='queue-inner'>
                <h1>W4001</h1></div>
                <h4>Now Serving</h4>
            </div>

            <div className='card'>
                          <BsFillPersonFill className='card_icon'/>  
                <div className='card-inner'>
           
                    <h3> Window 5 </h3>
                </div>

                <div className='queue-inner'>
                <h1>W5001</h1></div>
                <h4>Now Serving</h4>
            </div>


            <div className='card'>
                <BsFillPersonFill className='card_icon'/>
                <div className='card-inner'>
                    <h3>Window 6</h3>
                    
                </div>
                <div className='queue-inner'>
                <h1>W6001</h1></div>
                <h4>Now Serving</h4>
            </div>
        </div>
    </div>
    )


  
}

export default Present