import React from "react"
import './Login.css'
import '../../App.css'
import { Link, NavLink } from "react-router-dom"

import video from '../../LoginAssets/login-vid.mp4'
import logo from '../../LoginAssets/long-registrar.png'
import { MdAlternateEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb"



const Login = () => {
  return (
    <div className="loginPage flex">
    <div className="container flex">

    
      <div className = 'videoDiv'> 
        <video src={video} autoPlay muted loop></video>

      <div className="textDiv">
        <h2 className= 'title'> Keeping your transactions on track </h2>
        {/* <p> with Trax </p> */}
      </div>


      <div className="footerDiv flex">
        <span className="text"> Don't have an account?</span>
        <Link to = {'/register'}>
        <button className="btn">Sign Up</button>
        </Link>
      </div>
      </div>


      <div className="formDiv flex">
        <div className="headerDiv">
          <img src= {logo} alt="Logo Image"></img>
          <h3>Welcome Back!</h3>
        </div>

        <form action="" className='form grid'>
          {/* <span>Please login to continue</span> */}
          <div className="inputDiv">
            <label htmlFor ="email" >Email</label>
            <div className="input flex">
              <MdAlternateEmail className='icon'/>
              <input type="text" id="email" placeholder="Enter Email"/>
            </div>
          </div>

          <div className="inputDiv">
            <label htmlFor ="password" >Password</label>
            <div className="input flex">
              <TbPassword className='icon'/>
              <input type="text" id="password" placeholder="Enter Password"/>
            </div>
          </div>


          <button type="submit" className="btn flex">
            <span>Login</span>
          </button>

          <span className="forgotPassword">
            Forgot your password? <a href="">Click Here</a>
          </span>

        </form>
      </div>




    </div>
    </div>

  )
}

export default Login