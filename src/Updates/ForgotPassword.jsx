import React, { useState } from 'react'
import supabase from '../supabaseClient'
import '../Updates/Design.scss'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setError(error.message);
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
      <h1>Forgot Password</h1>
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
      {error && <p className='text-red-500'>{error}</p>}
      {success && <p className='text-blue-700'>Password rest email sent!</p>}
   </div>
    </div>
  )
}

export default ForgotPassword