import React, { useState } from 'react'
import supabase from '../supabaseClient'
import { useParams } from 'react-router-dom'
import eyeSolidslash from '../img/eye-slash-solid-full.svg'
import eyeSolid from '../img/eye-solid-full.svg'

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { access_token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try{
            const { error } = 
            await supabase.auth.updateUser({ password }, access_token);
            if (error) {
                setError(error.message);
            }else {
                setSuccess(true)
            }
        }catch (error) {
            setError(error.message)
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
          <span className="title">Reset Password</span>
        <form onSubmit={handleSubmit} className='Details'>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <input required type="password" value={confirmPassword} id='password' onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          <img src={eyeSolidslash} id="icon" onClick={Eyeicon} className='icon'></img>
          <button type="submit">Reset Password</button>
        </form>
        {error && <p className='text-red-600'>{error}</p>}
     {success && <p className='text-blue-600'>Password reset successfully</p>}
        </div>
        </div>
  )
}

export default ResetPassword