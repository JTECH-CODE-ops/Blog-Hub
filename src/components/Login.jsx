// import React from 'react'
// import { toast } from 'react-toastify'

// const login = () => {
//   const handleLogin = (e) =>{
//     e.preventDefault()
//     toast.success("hello")
//   }
//   return (
//    <div className='form-container'>
//     <div className="formWrapper">
//       <span className="logo">Lama Chat</span>
//       <span className="title">Register</span>
//       <form onSubmit={handleLogin}>
//         <input type='email' placeholder='email' />
//         <input type='password' placeholder='password' />
//         <button>Sign in</button>
//       </form>
//       <p>You don't have an account? Register</p>
//     </div>

//   </div>
// )
// }

// export default login

import React, { useState } from 'react';
import { ImSpinner6 } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import eyeSolidslash from '../img/eye-slash-solid-full.svg'
import eyeSolid from '../img/eye-solid-full.svg'
import { toast } from 'react-toastify'
import supabase from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import './RegLog.scss'


const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
  const { error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://bihwyxeeeolbjhrngsco.supabase.co/auth/v1/callback'
    }
  })

  if (error) {
    console.error('Google Login Error', error.message)
  }
}


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setLoading(false)
        console.error(error);
        toast.error("Check your internet connection")
        console.log('😭😭😭😭😭 not Logged In!!')
      } else {
        setLoading(false)
        console.log(user);
        toast.success("Login Successful")
        console.log('😃😃😃😃Logged In!!')
        navigate("/")
       
      }
    } catch (error) {
      console.error(error);
    }
  };

  let icon = document.getElementById('icon')
    let passInput = document.getElementById('password')
    const Eyeicon = () => {
        if(passInput.type == "password"){
            passInput.type = "text"
            icon.src = eyeSolid
            
        }

        else{
            passInput.type = "password"
            icon.src = eyeSolidslash
        }
    }

  return (
    <div className='form-container'>
    <div className="formWrapper">
      <span className="logo">BLOGHUB</span>
      <span className="title">Login</span>
    <form onSubmit={handleSignUp} className='Details'>
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input required type="password" value={password} id='password' onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <img src={eyeSolidslash} id="icon" onClick={Eyeicon} className='icon'></img>
      <button type="submit">Login</button>
    </form>
     {loading && <p1><ImSpinner6 className='text-blue-700 text-2xl  animate-spin mr-2'/></p1>}
     <p1 className='Register'>Don't have an account?<Link to='/register'> Register</Link></p1>
     <p1 className='Forgot'>Forgot Password?<Link to='/reset-password/:access_token'> Click here</Link></p1>

      <p1 onClick={handleGoogleLogin} className='Google'>Continue With <FcGoogle/></p1>
    </div>

  </div>
  );
}

export default Login