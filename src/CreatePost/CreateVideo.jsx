import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import NoImage from '../Images/no-image-icon-23485.png'
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom';
import { FcVideoCall } from "react-icons/fc";
import { ImSpinner6 } from "react-icons/im";

const BlogVideoForm = () => {
  const [title, setTitle] = useState('');
//   const [link, setLink] = useState('');
//   const [content, setContent] = useState('');
  const [video, setVideo] = useState(null);
  const [Loading, setLoading] = useState(false)
  const[preview, setPreview] = useState(null)
    const [userProfile, setUserProfile] = useState({});
    const [fileSize, setFileSize] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            setLoading(false)
            console.error(error);
          } else {
            setLoading(false)
            setUserProfile(data.data || data.user);
            console.log(data)
          }
        } catch (error) {
          setLoading(false)
          console.error(error);
        }
      };
      fetchUser();
    }, []);

  const handleImageChange = (event) => {
    
    const reader = new FileReader()
    const file = event.target.files[0]
    reader.onload = () => {
      setPreview(reader.result)
      setFileSize(file.size)
  }
;

reader.readAsDataURL(event.target.files[0])
  }
  const handleSubmit = async (e) => {
    if(!video) return;

  const fileType = video.type;
  if(fileType !== 'video/mp4')  {
    toast.error('Only MP4 video filesare allowed')
    return
  }
    
    const fileSizeInMB = fileSize / (1024 * 1024);
    if (fileSizeInMB > 50) {
      toast.error('File size exceeds 50MB')
      return
    }
    
    e.preventDefault();
    try {
      setLoading(true)
      // Upload image to Supabase Storage
const { data: { user }} = await supabase.auth.getUser();


      const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(`blog_${Date.now()}.mp4`, video, {
          onProgress: (event) => {
            console.log(`Upload progress :${event.progress}%`)
          }
        });

      if (error) {
        setLoading(false)
        toast.error('Something went wrong')
        console.log(error);
      } else {
        setLoading(false)
        const imageUrl = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
        toast.success('Post Created')
        navigate("/Videos")
        // Create a new blog post in Supabase database
        const { data: blogPostData, error: blogPostError } = await supabase
          .from('blog_post')
          .insert([
            {
             video_url: imageUrl,
            //   Link: link,
            //   Content: content,
              video_title: title,
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

   const handleInputChange = (e) => {
    const value = e.target.value; // Remove existing spaces
    const spaceValue = value.replace(/(\S{20})(?=\S)/g, '$1 '); // Add space after every 5 characters
    setTitle(spaceValue)
  }
//    const handleInputChange1 = (e) => {
//     const value = e.target.value; // Remove existing spaces
//     const spaceValue = value.replace(/(\S{30})(?=\S)/g, '$1 '); // Add space after every 5 characters
//     setContent(spaceValue)
//   }

const formatFileSize = (size) => {
  if (size < 1024) return `${size} bytes`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

  return (
<form onSubmit={handleSubmit}>
<div className='createPost grid justify-center h-[100vh]'>
  <Link to='/createBlog'><div className='mt-3 text-white'><FaArrowLeft className='cursor-pointer'/></div></Link>
  <div className='relative  top-5'><img src={userProfile.user_metadata?.avatar_url || NoImage} alt='No image' className='w-25 h-25 rounded-full border-4 border-white'/></div>
  <div className='bgPost h-[55vh] rounded-[5px] md:w-[50vw] max-md:w-[90vw]'>
    {/* Top header */}
    <div className='grid place-content-center'> 
    <div className='flex gap-10 items-center'>
      <div className='font-bold'>Create Video</div>
    </div>
    </div>
    {/* Content */}
    <div className='grid justify-center mt-7'>
    <div className='inputBg md:w-[40vw] w-[85vw] h-[35vh] rounded-[4px]'>
     <div className='px-4 py-2'><input required type='text' className='outline-0 w-[60vw] px-2' placeholder='Video title here' value={title} onChange={(e) => {setTitle(e.target.value); handleInputChange(e);}}/></div>
     {/* <div className='px-4 py-2'><textarea type='text' className='outline-0 w-[70vw] h-[20vh] px-2' placeholder='Post description' value={content} onChange={(e) => {setContent(e.target.value); handleInputChange1(e);}}/></div> */}
     {/* <div className='px-4'><input type='text' className='outline-0 w-[60vw] px-2' placeholder='Post Link here' value={link} onChange={(e) => setLink(e.target.value)}/></div> */}
     <div>
        <input type='file' required id='file' onChange={(e) => {setVideo(e.target.files[0]); handleImageChange(e);}}  style={{ display: 'none'}}/>
        </div>
        <div className='flex gap-4 items-center'>
       <label htmlFor='file'  className='' >
        <div><FcVideoCall  className='text-3xl'/></div>  
</label>

</div>
<div className='py-2 max-md:py-6'>
  {preview && (
    <div className='flex'>
      <video className='w-25 rounded-[5px] h-[10vh]' src={preview}/>
      <div className='relative -top-2 right-2'><MdOutlineCancel onClick={() => setPreview(null)} className='text-xl text-amber-400'/></div>
      <div className='font-bold'>{formatFileSize(fileSize)}</div>
      </div>
)}
</div>
<div className='grid'>
  <div className='justify-end flex'>
<button type="submit" className='font-extrabold bgSubmit text-white pl-6 pr-6 pt-2 pb-2 rounded-[6px]'>Publish</button>
    </div>
    <div className='flex justify-center relative bottom-14'>
      {Loading && <ImSpinner6 className='text-blue-600 text-5xl animate-spin'/>} 
    </div>
    </div>
    </div>
    </div>
    {/* Preview */}
  </div>
</div>
</form>
  );
};

export default BlogVideoForm;