import { useState, useEffect } from 'react';
import  supabase  from '../supabaseClient';
import { FaCamera } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import './Edit.scss'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [preview, setPreview] = useState(null)
  const [profile, setProfile] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUsername(data.user.user_metadata.display_name);
        setProfile(data.user.user_metadata.profile);
        setEmail(data.user.user_metadata.email);
        setProfileImageUrl(data.user.user_metadata.avatar_url);
        setBio(data.user.user_metadata.Bio)
        setNumber(data.user.user_metadata.phone)
      }
    };
    fetchUserData();
  }, []);

  const handleImageUpdate = async (e) => {
    e.preventDefault()
          const { data, error } = await supabase.auth.getUser();
      const user = data.user

      if(user && user.id) {
        const { data, error} = await supabase
       .from('profiles')
      .update({ id: user.id, avatar_url: profileImageUrl,})
      .eq('id', user.id)
      
      if (error) {
        console.error(error)
      }else{
        console.log('Successful', data)
      }
     } else {
      console.error('User is false', error)
     }
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      setLoading(true)
      // Upload image to Supabase Storage
const { data: { user }} = await supabase.auth.getUser();


      const { data, error } = await supabase
        .storage
        .from('bloggers')
        .upload(`blog_${Date.now()}.jpg`, profileImage);


      if (error) {
        setLoading(false)
        toast.error('Something went wrong')
        console.log(error);
      } else {
        setLoading(false)
        const imageUrl = supabase.storage.from('bloggers').getPublicUrl(data.path).data.publicUrl;
        // toast.success('Post Created')
        // Create a new blog post in Supabase database
        const { data: blogPostData, error: blogPostError } = await supabase
          .from('blog_post')
          .insert([
            {
              image_url: imageUrl,
              Title: `${username} Updated Their Profile Picture`,
              user_id: user.id,  
              created_at: new Date().toISOString(),        
             },
          ]);

        if (blogPostError) {
          setLoading(false)
          console.error(blogPostError);
        } else {
          console.log(blogPostData);
          console.log(data)
         console.log(user)
        }
      }
    } catch (error) {
      setLoading(false)
      console.error(error);
      console.log(error.response)
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: username,
          Bio: bio,
          Profile: profile,
          phone: number,
        },
      });
      if (error) {
        toast.error('Check your network')
        console.error(error);
      } else {
        console.log(data)
        toast.success('Profile updated successfully!');
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
      .update({ id: user.id, user_name: username, Bio: bio, profile: profile, Number: number, })
      .eq('id', user.id)
      
      if (error) {
        console.error(error)
      }else{
        console.log('Successful', data)
      }
     } else {
      console.error('User is false', error)
     }
  };

  const UpdateImage = async (e) => {
    setLoading(true)
    const fileEXT = profileImage.name.split('.').pop();
    const filePath = `${username}/${email}.${fileEXT}`;
    e.preventDefault()
     try {
      const { error } = await supabase.storage
        .from('bloggers')
        .upload(filePath, profileImage, { upsert: true });
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
          toast.error('Check your network')
          console.error(updateError);
        } else {
            console.log(updateData)
          setProfileImageUrl(profileImageUrl);
          toast.success('Profile image Update, Successful')
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    
  };

  const handleImageChange = (event) => {

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
      ;

    reader.readAsDataURL(event.target.files[0])
  };

const AvatarChange = (event) => {
  setProfileImage(event.target.files[0])
}

  const handleInputChange = (e) => {
    const value = e.target.value;
  
    

    if(value.length <= 12) {
     setUsername(value);
    }

    if(value.length === 12) {
      alert('You have reached the maximum character limit of 12 for the username.')
    }
  }

  return (
    // <div className='ProfileEdit'>
    //   <div className='Link'>
    //             <Link to='/profile'><p className='mb-7 relative left-7 text-2xl text-amber-400'><FaRegArrowAltCircleLeft /></p></Link>
    //           </div>
    // <form className='grid justify-center form'>
    //   <label className='Username'>
    //     Username:
    //     <input className='name w-50 outline-0 border-2'
    //       type="text"
    //       maxLength={12}
    //       value={username}
    //       onChange={(e) => {
    //         setUsername(e.target.value);
    //         handleInputChange(e);
    //       }}
    //     />
    //   </label>
    //   <label className='Username ml-14'>
    //     Bio:
    //     <textarea className='name w-50 outline-0 border-2'
    //       type="text"
    //       value={bio}
    //       maxLength={100}
    //       onChange={(e) => 
    //         setBio(e.target.value)}
    //     />
    //   </label>
    //   <label className='Username ml-14'>
    //     Pro:
    //     <select className='name relative bottom-3 overflow-y-scroll text-white w-50 outline-0 border-2'
    //       type="text"
    //       value={profile}
    //       maxLength={100}
    //       onChange={(e) => 
    //         setProfile(e.target.value)}
    //     >
    //       <option className='text-black'>Digital Creator</option>
    //       <option className='text-black'>Content Creator</option>
    //       <option className='text-black'>Education Analyst</option>
    //       <option className='text-black'>Movie Editor</option>
    //       <option className='text-black'>Gamer</option>
    //       <option className='text-black'>Tech-Analyst</option>
    //       <option className='text-black'>Web-Developer</option>
    //       <option className='text-black'>Designer</option>
    //       <option className='text-black'>Reader</option>
    //       <option className='text-black'>Business-Analyst</option>
    //     </select>
    //   </label>
  
    //   <label htmlFor='file'>
    //     <FaCamera className='text-2xl relative  left-17  text-amber-200'/>
    //     {profileImageUrl && (
    //     <img src={profileImageUrl} alt="Profile Image" className='img w-[5rem] h-[5rem] rounded-full' />
    //   )}
    //     {preview && (
    //           <img className='w-[5rem] h-[5rem] rounded-full mb-4' src={preview} alt='Selected Image' />
    //         )}
    //     <input
    //     style={{display: 'none'}}
    //     id='file'
    //       type="file"
    //      onChange={(e) => {
    //         AvatarChange(e)
    //         handleImageChange(e)
    //       }}
    //     />
    //   </label>
    //    <button onClick={(e) => {UpdateImage(e); handleSubmit(e)}} disabled={loading} className='updateImage'>
    //     {loading ? <p className='animate-pulse'>Updating....</p> : 'Update Profile Image'}
    //   </button>
    //   <br />
    //   <br />
    //   <button onClick={handleUpdateProfile} disabled={loading}>
    //     {loading ? <p className='animate-pulse'>Updating....</p> : 'Update Profile Information'}
    //   </button>
    // </form>
    // </div>
    <div className='editForm h-[100vh]'>
      <div className='grid justify-center'><button onClick={(e) => {UpdateImage(e); handleSubmit(e); handleImageUpdate(e)}} disabled={loading}  className='text-white font-bold p-1.5 rounded-[10px] relative right-27 top-10' style={{backgroundColor: 'black'}}>Save Photo</button></div>
<div className='flex items-center gap-2 justify-center'>
  <div className="text-white relative right-30 -top-9"> <Link to='/'><FaArrowLeft className="text-2xl"/></Link></div>
  <div className='font-bold text-white relative -top-9'>Edit Profile</div>
</div>
{/* Form container */}
<form onSubmit={handleUpdateProfile}>
   <div style={{backgroundColor: 'white'}} className='mt-15 rounded-t-3xl h-[86vh]'>
     <div className='grid justify-center'>
        {profileImageUrl && (
        <img src={profileImageUrl} alt="Profile Image" className='w-20 h-20 rounded-full relative -top-7'/>
      )}
      </div>
<input type='file' id='file1' onChange={(e) => {
            handleImageChange(e);
            AvatarChange(e);
          }} style={{ display: 'none' }} />
          <label htmlFor='file1' className='' >
            <div className='relative -top-6 justify-center flex'><FaCamera className='text-xl text-gray-500'/></div>
            {preview && (
              <div className='grid justify-center relative -top-32'><img className='w-20 h-20 rounded-full ' src={preview} alt='Selected Image' /></div>
            )}
          </label>
          <div className='grid gap-2 justify-center'>
             <label className='font-bold text-gray-500'>Profile</label>
            <select 
            className='outline-0 h-13 border-2 w-70 rounded-[10px]'
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
            <label className='font-bold text-gray-500'>Username</label>
            <input 
            type='text'
            maxLength={12}
            value={username}
              onChange={(e) => {
              setUsername(e.target.value);
              handleInputChange(e);
            }}
            className='outline-0 px-3 rounded-[10px] h-12 border-2 w-70' />
            <label className='font-bold text-gray-500'>Bio</label>
            <textarea 
            maxLength={100}
            value={bio}
            onChange={(e) => 
            setBio(e.target.value)}
            className='outline-0 px-3 rounded-[10px] border-2 w-70' />
            <label className='font-bold text-gray-500'>Phone No:</label>
            <input 
            maxLength={11}
            value={number}
               onChange={(e) => 
            setNumber(e.target.value)}
            className='outline-0 px-3 h-12 rounded-[10px] border-2 w-70' />
          <div style={{backgroundColor: 'black'}} className='mt-10 flex justify-center h-10 rounded-[30px]'>
            {loading ? (<button className='font-bold animate-pulse text-white text-xl'>Saving. . . . . . . . . . .</button>) : (<button className='font-bold text-white text-xl' type='submit'>Save</button>)}
            </div>
          </div>
   </div>
</form>
    </div>
  );
};

export default Profile;