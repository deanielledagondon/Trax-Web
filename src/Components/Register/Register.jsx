import React from "react";
import './Register.css';
import '../../App.css'
import { Link, NavLink } from "react-router-dom"


import video from '../../LoginAssets/registrar vid placeholder.mp4'
import logo from '../../LoginAssets/long-registrar.png'
import { FaRegUserCircle } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb"

const Register = () => {
  return (
    <div className="registerPage flex">
    <div className="container flex">

    
      <div className = 'videoDiv'> 
        <video src={video} autoPlay muted loop></video>

      <div className="textDiv">
        <h2 className= 'title'> Where every transaction matters </h2>
        {/* <p> with Trax </p> */}
      </div>


      <div className="footerDiv flex">
        <span className="text"> Already a user?</span>
        <Link to = {'/'}>
        <button className="btn">Login</button>
        </Link>
      </div>
      </div>


      <div className="formDiv flex">
        <div className="headerDiv">
          <img src= {logo} alt="Logo Image"></img>
          <h3>Sign Up</h3>
        </div>

        <form action="" className='form grid'>
        <div className="inputDiv">
            <label htmlFor ="name" >Name</label>
            <div className="input flex">
              <FaRegUserCircle className='icon'/>
              <input type="text" id="name" placeholder="Enter Full Name"/>
            </div>
          </div>

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
            <span>Register</span>
          </button>

          {/* <span className="forgotPassword">
            Forgot your password? <a href="">Click Here</a>
          </span> */}

        </form>
      </div>




    </div>
    </div>
  )

}

export default Register