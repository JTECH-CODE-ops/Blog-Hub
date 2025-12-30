import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import eyeSolidslash from '../img/lock-open-solid-full.svg'
import eyeSolid from '../img/lock-solid-full.svg'

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    // const [token, setToken] = useState('')

    useEffect(() => {
        const handleRecovery = async () => {
         const { data } = await supabase.auth.getSession()
         if(!data.session) {
            console.error(error)
            setError(error.message)
         }
         console.log('session', data)
        }
       handleRecovery()
        
    }, [error])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try{
            const { error } = await supabase.auth.updateUser({
             password: password
            });
            if (error) {
                console.error(error.message)
                setError(error.message);
            }else {
                  setSuccess(true) 
                  await supabase.auth.signOut()
            }
        }catch (error) {
            console.error(error.message)
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