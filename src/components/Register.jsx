import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { ImSpinner6 } from "react-icons/im";
import supabase from '../supabaseClient';
import eyeSolidslash from '../img/eye-slash-solid-full.svg'
import Imagefile from '../img/image-solid-full.svg'
import eyeSolid from '../img/eye-solid-full.svg'
import './RegLog.scss'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preview, setPreview] = useState(null)
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
              avatar_url: user.user_metadata.avatar_url,
            },
          ])
          .then((data) => console.log(data))
          .catch((error) => console.log(error))
      }
    })

    return console.log(authListener)


  })

  const handleImageChange = (event) => {

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
      ;

    reader.readAsDataURL(event.target.files[0])
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${username}/${email}`, avatar);
      const avatarUrl = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username,
            avatar_url: avatarUrl
          },
        },
      });


      if (error) {
        console.log(uploadError)
        console.error(error);
        console.log(email)
        toast.error("Something Went Wrong")
        setLoading(false)
      } else {
        console.log(user)
        if (avatar) {

          if (error) {
            console.log('Error uploading!!!!')
          } else {

            await supabase.auth.signUp({
              data: {
                avatar_url: avatarUrl,
              },
            })

          }
        }

        setLoading(false)

        toast.success("Successful Operation")
        navigate("/")
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const uploadAvatar = async (user, avatar) => {
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from('bloggers')
  //       .upload(`${user.id}/${avatar.name}`, avatar);
  //     if (error) {
  //       console.error('Error uploading Avatar:', error)
  //     } else {
  //       console.log('Avatar uploaded successfully😀😀')
  //       const avatarUrl = supabase.storage.from('bloggers').getPublicUrl(data.path).data.publicUrl;
  //       const { data: updateUser, error: updateError } = await supabase.auth.updateUser({
  //         options: {
  //           data: {
  //             avatar_url: avatarUrl,
  //           },
  //         },

  //       });
  //       if (updateError) {
  //         console.error(updateError)
  //       } else {

  //          console.log(updateUser)
  //       }

  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  }

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
    <div className='form-container'>
      <div className="formWrapper">
        <span className="logo">BLOGHUB</span>
        <span className="title">Register</span>
        <form onSubmit={handleSignUp} className='Details'>
          <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input required type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <img src={eyeSolidslash} id="icon" onClick={Eyeicon} className='icon'></img>
          <input type='file' id='file1' onChange={(e) => {
            handleImageChange(e);
            handleAvatarChange(e);
          }} style={{ display: 'none' }} />
          <label htmlFor='file1' className='' >
            <img src={Imagefile} className='icon' />
            {preview && (
              <img className='relative left-[14rem] top-[-6rem] w-[2.1rem] h-[2rem] rounded-full ' src={preview} alt='Selected Image' />
            )}

          </label>
          <button type="submit">Sign Up</button>
        </form>
        {loading && <span className='relative bottom-25'><ImSpinner6 className='text-blue-700 animate-spin mr-2 relative top-10 text-3xl' /></span>}
        <p className=' relative top-[-4rem]'>Do you have an account? <Link to='/login'>Login</Link> </p>
        <p className=' relative top-[-4rem]'>OR</p>
        <p onClick={handleGoogleLogin} className='Google relative top-[-4rem]'>Continue With <FcGoogle/></p>
      </div>

    </div>
  );
}

export default Register