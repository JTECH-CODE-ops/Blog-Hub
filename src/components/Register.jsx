import React, { useEffect, useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import { LuLockKeyholeOpen } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa6";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import supabase from '../supabaseClient';
import Logo from '../Assets/received_1506971420572100.jpg'
import eyeSolidslash from '../img/lock-solid-full.svg'
import { FaRegCircleUser } from "react-icons/fa6";
import eyeSolid from '../img/lock-open-solid-full.svg'
import { FaCamera } from "react-icons/fa";
import './RegLog.scss'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [number, setNumber] = useState('')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [preview, setPreview] = useState(null)
  const navigate = useNavigate()

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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const user = session.user;
        // insert profile data into profiles table
        supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              user_name: user.user_metadata.display_name,
              Number: user.user_metadata.phone,
            },
          ])
          .then((data) => console.log(data))
          .catch((error) => console.log(error))
      }
    })

    return console.log(authListener)


  })

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      // const { data, error: uploadError } = await supabase.storage
      //   .from('avatars')
      //   .upload(`${username}/${email}`, avatar);
      // const avatarUrl = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username,
            phone: number,
          },
        },
      });


      if (error) {
        // console.log(uploadError)
        console.error(error);
        console.log(email)
        toast.error(error.message)
        setLoading(false)
      } else {
        console.log(user)
        // if (avatar) {

        //   if (error) {
        //     console.log('Error uploading!!!!')
        //   } else {

        //     await supabase.auth.signUp({
        //       data: {
        //         avatar_url: avatarUrl,
        //       },
        //     })

        //   }
        // }

        setLoading(false)

        toast.success("Successful Operation")
        navigate("/Setup")
      }
    } catch (error) {
      console.error(error);
    }
  };

  let icon = document.getElementById('icon')
  let passInput = document.getElementById('password')
  const Eyeicon = () => {
    if (passInput.type == "password") {
      passInput.type = "text"
      icon.src = eyeSolid

    }

    else {
      passInput.type = "password"
      icon.src = eyeSolidslash
    }
  }

  return (
    <div className='formMain'>
      <div className='grid justify-center mt-10'><div className='text-2xl font-extrabold'>Sign Up</div></div>
    {/* Form Container */}
   
     <form onSubmit={handleSignUp}>
      <div className='grid gap-9 mt-8 justify-center'>
        <div><input required value={username} onChange={(e) => setUsername(e.target.value)} type='text' placeholder='Full name'  className='relative left-3 outline-0 px-2 text-[18px] border-gray-400 h-10 rounded-[5px] w-80  border-2'/></div>
        <div><input required value={email} onChange={(e) => setEmail(e.target.value)} type='text' placeholder='Email' className='relative left-3 outline-0 px-2 text-[18px] border-gray-400 h-10 rounded-[5px] w-80  border-2'/></div>
        <div className='flex items-center'><input required id='password' value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' className='relative left-3 outline-0 px-2 text-[18px] border-gray-400 h-10 rounded-[5px] w-80  border-2'/><img src={eyeSolidslash} id="icon" onClick={Eyeicon} className='w-6 relative right-7'></img></div>
        <div><input required value={number} onChange={(e) => setNumber(e.target.value)} type='number' placeholder='Phone number' className='relative left-3 outline-0 px-2 text-[18px] border-gray-400 h-10 rounded-[5px] w-80  border-2'/></div>
        <div className='font-extrabold'><input type='checkbox' className='font-extrabold'/> Accept Terms & Conditions</div>
        <div style={{backgroundColor: 'black'}} className='h-10 grid justify-center rounded-[8px]'>{loading ? (<button className='font-black animate-pulse text-white'>Signing in. . . . . . . . . . . . . . .</button>) : <button className='font-black text-white flex items-center gap-3'>Join us<FaArrowRight /></button>}</div>
       <div className='flex justify-center'><TfiLayoutLineSolid className='text-2xl w-10'/>Or<TfiLayoutLineSolid className='text-2xl w-10'/></div>
       <div>Already have an account? <Link to='/Login' className='text-blue-600 font-bold'>Login</Link></div>
       <div style={{boxShadow: '1px 1px 1px 1px gray'}} className='h-10 relative -top-2 grid justify-center rounded-[8px]'><button onClick={handleGoogleLogin} className='font-black text-black flex items-center gap-3'><FaGoogle className='text-blue-600'/>Sign up with Google</button></div>
      </div>
     </form>
    
    </div>
  );
}

export default Register