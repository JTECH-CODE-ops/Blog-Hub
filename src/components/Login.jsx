import React, { useState } from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import eyeSolidslash from '../img/lock-solid-full.svg'
import eyeSolid from '../img/lock-open-solid-full.svg'
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
        toast.error(error.message)
        // console.log('😭😭😭😭😭 not Logged In!!')
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
  <div className='formMain'>
   <div className='grid justify-center mt-10'><div style={{fontFamily: 'Bulb'}} className='text-2xl text-blue-900 font-extrabold'>Login</div></div>
   {/* Form Container */}
   <form onSubmit={handleSignUp}>
    <div className='grid gap-8  mt-8 justify-center'>
              <div><input value={email} onChange={(e) => setEmail(e.target.value)} type='text' placeholder='Email' className='outline-0 relative left-3 px-2 text-[18px] border-gray-400 h-10 rounded-[5px] w-80  border-2'/></div>
              <div className='flex items-center'><input id='password' value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' className='outline-0 relative left-3 px-2 text-[18px] border-gray-400 h-10 rounded-[5px] w-80  border-2'/><img src={eyeSolidslash} id="icon" onClick={Eyeicon} className='w-6 relative right-7'></img></div>
   <div style={{backgroundColor: 'black'}} className='h-10 grid justify-center rounded-[8px]'>{loading ? (<button className='font-black animate-pulse text-white'>Logging in. . . . . . . . . .</button>) : <button className='font-black text-white flex items-center gap-3'>Login<FaArrowRight /></button>}</div>
          <div className='flex justify-center'><TfiLayoutLineSolid className='text-2xl w-10'/>Or<TfiLayoutLineSolid className='text-2xl w-10'/></div>
          <div>Don't have an Account? <Link to='/register' className='font-bold text-blue-600'>Register</Link></div>
          <div>Forgot Password? <Link to='/Forgot' className='font-bold text-blue-600'>Click here</Link></div>
          <div style={{boxShadow: '1px 1px 1px 1px gray'}} className='h-10 relative -top-2 grid justify-center rounded-[8px]'><button onClick={handleGoogleLogin} className='font-black text-black flex items-center gap-3'><FaGoogle className='text-blue-600'/>Login with Google</button></div>
    </div>
   </form>
  </div>
  );
}

export default Login