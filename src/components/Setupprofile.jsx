import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient';
import { FaCamera } from "react-icons/fa";
import Logo from '../Assets/user-round-svgrepo-com.svg'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Setupprofile = () => {
    const [name, setName] = useState('')
    const [preview, setPreview] = useState(null)
     const [profileImageUrl, setProfileImageUrl] = useState('');
    const [bio, setBio] = useState('')
    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null)
    const [email, setEmail] = useState('');
    const navigate = useNavigate()
  
     const SetUpProfile = async (e) => {
      e.preventDefault()
      setLoading(true)

    try {
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          Bio: bio,
          Profile: profile,
        },
      });
      if (error) {
        setLoading(false)
        toast.error('Check your network')
        console.error(error);
        setEmail(email)
      } else {
        setLoading(false)
        console.log(data)
        toast.success('Account Setup Completed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    const { data, error } = await supabase.auth.getUser();
          const user = data.user
    
          if(user && user.id) {
            const { data, error} = await supabase
           .from('profiles')
          .update({ id: user.id, avatar_url: profileImageUrl, Bio: bio, profile: profile })
          .eq('id', user.id)
          
          
          if (error) {
            console.error(error)
          }else{
            console.log('Successful', data)
          }
         } else {
          console.error('User is false', error)
         }

    const fileEXT = avatar.name.split('.').pop();
    const filePath = `Profile-Pic/${email}.${fileEXT}`;
   
     try {
      const { error } = await supabase.storage
        .from('bloggers')
        .upload(filePath, avatar, { upsert: true });
      if (error) {
      toast.error('Check your network or Try Again')
        console.error(error);
      } else {
        const profileImageUrl = supabase.storage
          .from('bloggers')
          .getPublicUrl(filePath).data.publicUrl;
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          data: {
            avatar_url: profileImageUrl,
          },
        });
        if (updateError) {
          setLoading(false)
          toast.error('Check your network')
          console.error(updateError);
        } else {
          setLoading(false)
          console.log(updateData)
          navigate("/")
          setProfileImageUrl(profileImageUrl);
          toast.success('Profile Completed')
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    
  };


    useEffect(() => {
       const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          
          console.error(error);
        } else {
          setName(data.data || data.user);
          console.log(data)
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    })

     const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  }

    const handleImageChange = (event) => {

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
      ;

    reader.readAsDataURL(event.target.files[0])
  }
  return (
    <div className='formMain1 h-[100vh]'>
    <div className='grid justify-center'><div className='text-white font- setName text-xl'><b className='text-2xl text-blue-600'>Welcome!</b> {name.user_metadata?.display_name}</div></div>
    <div className='grid justify-center'><div className='text-white font-bold text-[15px]'>Continue Setting up your profile</div></div>
 <form onSubmit={SetUpProfile}>
 <div style={{backgroundColor: 'white'}} className='mt-15 rounded-t-3xl h-[86vh]'>
  <div className='grid justify-center'><img src={Logo} className='w-20 h-20 rounded-full relative -top-7'/></div>
  <input required type='file' id='file1' onChange={(e) => {
            handleImageChange(e);
            handleAvatarChange(e);
          }} style={{ display: 'none' }} />
          <label htmlFor='file1' className='' >
            <div className='relative -top-6 justify-center flex'><FaCamera className='text-xl text-gray-500'/></div>
            {preview && (
              <div className='grid justify-center relative -top-32'><img className='w-20 h-20 rounded-full ' src={preview} alt='Selected Image' /></div>
            )}
          </label>
          <div className=' grid gap-5 justify-center'>
            <label className='font-bold text-gray-500'>Bio</label>
            <textarea 
            required
            maxLength={100}
            value={bio}
               onChange={(e) => 
            setBio(e.target.value)}
            className='outline-0 px-3 rounded-[30px] border-2 w-70' />
            <label className='font-bold text-gray-500'>Profile</label>
            <select 
            required
            className='outline-0 h-13 border-2 w-70 rounded-[30px]'
            value={profile}
            onChange={(e) => 
            setProfile(e.target.value)}
            >
            <option className='text-black'>Digital Creator</option>
          <option className='text-black'>Content Creator</option>
          <option className='text-black'>Education Analyst</option>
          <option className='text-black'>Movie Editor</option>
          <option className='text-black'>Gamer</option>
          <option className='text-black'>Tech-Analyst</option>
          <option className='text-black'>Web-Developer</option>
          <option className='text-black'>Designer</option>
          <option className='text-black'>Reader</option>
          <option className='text-black'>Business-Analyst</option>
            </select>
           <div style={{backgroundColor: 'black'}} className='mt-10 flex justify-center h-10 rounded-[30px]'>
            {loading ? (<button className='font-bold animate-pulse text-white text-xl'>Saving. . . . . . . . . . .</button>) : (<button className='font-bold text-white text-xl' type='submit'>Save</button>)}
            </div>
          </div>
        
 </div>
 </form>  
  </div>
)
}

export default Setupprofile