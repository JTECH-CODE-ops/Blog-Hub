import React, { useState } from 'react'
import supabase from '../supabaseClient'
import '../Updates/Design.scss'
import { MdSignalWifiStatusbarConnectedNoInternet } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password'
      });
      if (error) {
        setError('Check Internet Connection');
      }else {
        setSuccess(true)
      }
    }catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className='ForgotPassword'>
      <div className='SubForgot'>
      <h1 style={{fontFamily: 'Bulb'}} className='text-blue-900'>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div className='input'>
        <label>Email:</label>
        <input 
        placeholder=' Type in your email'
        required
        type='email' 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <button type='submit'>Send Reset Password</button>
      </form>
      {error && <p className='text-red-600 flex gap-3 items-center font-bold mt-4'>{error}<MdSignalWifiStatusbarConnectedNoInternet className='text-black text-3xl animate-bounce'/></p>}
      {success && <p className='text-green-500 font-bold  flex items-center gap-3'>Password rest email sent!<GrStatusGood className='text-2xl'/></p>}
   </div>
    </div>
  )
}

export default ForgotPassword