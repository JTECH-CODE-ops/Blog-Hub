import { useState, useEffect } from 'react';
import  supabase  from '../supabaseClient';
import { FaCamera } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import './Edit.scss'
import { Link } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [preview, setPreview] = useState(null)
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
        setEmail(data.user.user_metadata.email);
        setProfileImageUrl(data.user.user_metadata.avatar_url);
        setBio(data.user.user_metadata.Bio)
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: username,
          Bio: bio,
        },
      });
      if (error) {
        console.error(error);
      } else {
        console.log(data)
        console.log('Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    // try {
    //   const { data, error } = await supabase.storage
    //     .from('bloggers')
    //     .upload(`${username}/${email}`, profileImage);
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     const profileImageUrl = supabase.storage
    //       .from('bloggers')
    //       .getPublicUrl(data.path).data.publicUrl;
    //     const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    //       data: {
    //         avatar_url: profileImageUrl,
    //       },
    //     });
    //     if (updateError) {
    //       console.error(updateError);
    //     } else {
    //         console.log(updateData)
    //       setProfileImageUrl(profileImageUrl);
    //       console.log('Profile image updated successfully!');
    //     }
    //   }
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }

    const { data, error } = await supabase.auth.getUser();
      const user = data.user

      if(user && user.id) {
        const { data, error} = await supabase
       .from('profiles')
      .update({ id: user.id, user_name: username, avatar_url: profileImageUrl, Bio: bio})
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
          console.error(updateError);
        } else {
            console.log(updateData)
          setProfileImageUrl(profileImageUrl);
          console.log('Profile image updated successfully!');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    
  }

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

  return (
    <div className='ProfileEdit'>
      <div className='Link'>
                <Link to='/profile'><p className='mb-7 relative left-7 text-2xl text-amber-400'><FaRegArrowAltCircleLeft /></p></Link>
              </div>
    <form className='grid justify-center form'>
      <label className='Username'>
        Username:
        <input className='name outline-0 border-2'
          type="text"
          value={username}
          onChange={(e) => 
            setUsername(e.target.value)}
        />
      </label>
      <label className='Username ml-14'>
        Bio:
        <textarea className='name outline-0 border-2'
          type="text"
          value={bio}
          onChange={(e) => 
            setBio(e.target.value)}
        />
      </label>
      +
      <br />
      {/* <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label> */}
  
      <label htmlFor='file'>
        <FaCamera className='text-2xl relative  left-17  text-amber-200'/>
        {profileImageUrl && (
        <img src={profileImageUrl} alt="Profile Image" className='img w-[5rem] h-[5rem] rounded-full' />
      )}
        {preview && (
              <img className='w-[5rem] h-[5rem] rounded-full mb-4' src={preview} alt='Selected Image' />
            )}
        <input
        style={{display: 'none'}}
        id='file'
          type="file"
         onChange={(e) => {
            AvatarChange(e)
            handleImageChange(e)
          }}
        />
      </label>
       <button onClick={UpdateImage} disabled={loading} className='updateImage'>
        {loading ? <p className='animate-pulse'>Updating....</p> : 'Update Profile Image'}
      </button>
      <br />
      <br />
      <button onClick={handleUpdateProfile} disabled={loading}>
        {loading ? <p className='animate-pulse'>Updating....</p> : 'Update Profile Information'}
      </button>
    </form>
    </div>
  );
};

export default Profile;