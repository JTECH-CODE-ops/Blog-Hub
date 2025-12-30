import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import NoImage from '../Images/no-image-icon-23485.png'
import Imagefile from '../img/image-solid-full.svg'
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom';
import { PiVideoCameraBold  } from "react-icons/pi";
import { ImSpinner6 } from "react-icons/im";

const BlogPostForm = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [Loading, setLoading] = useState(false)
  const[preview, setPreview] = useState(null)
    const [userProfile, setUserProfile] = useState({});
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
    reader.onload = () => {
      setPreview(reader.result)
  }
;

reader.readAsDataURL(event.target.files[0])
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
        .upload(`blog_${Date.now()}.jpg`, image);


      if (error) {
        setLoading(true)
        toast.error('Something went wrong')
        console.log(error);
      } else {
        setLoading(false)
        const imageUrl = supabase.storage.from('bloggers').getPublicUrl(data.path).data.publicUrl;
        toast.success('Post Created')
        navigate("/")
        // Create a new blog post in Supabase database
        const { data: blogPostData, error: blogPostError } = await supabase
          .from('blog_post')
          .insert([
            {
              image_url: imageUrl,
              Link: link,
              Content: content,
              Title: title,
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
   const handleInputChange1 = (e) => {
    const value = e.target.value; // Remove existing spaces
    const spaceValue = value.replace(/(\S{30})(?=\S)/g, '$1 '); // Add space after every 5 characters
    setContent(spaceValue)
  }

  return (
//     <form onSubmit={handleSubmit}>
//       <div className='formBlogs'>
//          <Link to='/'><p className='text-2xl text-white mt-2'><FaRegArrowAltCircleLeft/></p></Link>
//         <div className='w-9 h-2 mt-4'>
//        <img src={userProfile.user_metadata?.avatar_url} className='w-12 h-10 rounded-full'/>
//       </div>
//       <h1>Create A Post</h1>
//       <div>
//         <label>
//           Title:
//           <input required placeholder=' Whats on your mind?' type="text" value={title} onChange={(e) => {setTitle(e.target.value); handleInputChange(e);}} className='' />
//         </label>
//         </div>
// <div>
//         <label className=''>
//           Content:
//           <textarea placeholder=' Feel free to express it 😀, ' value={content} onChange={(e) => {setContent(e.target.value); handleInputChange1(e);}} className='Content' />
//         </label>
// </div>

// <div>
//         <label className='httpLink'>
//           Link:
//           <textarea placeholder=' Share a Link ' value={link} onChange={(e) => setLink(e.target.value)} className='Content' />
//         </label>
// </div>
// <div>
//        <input type='file' id='file' onChange={(e) => {setImage(e.target.files[0]); handleImageChange(e);}}  style={{ display: 'none'}}/>
//        </div>
//         <label htmlFor='file'  className='label' >
//           <img src={Imagefile}  className='icon' />
//            {preview && (
//             <img className='relative left-[14rem] top-[-3rem] w-[10rem] h-[4rem] rounded-[5px] ' src={preview} alt='Selected Image'/>
//            )}
//         </label>
//         <div>
//         <span className='Add'>Add an image</span>
//         </div>
//         <div>
//          {Loading && <ImSpinner6 className='text-blue-600 text-5xl animate-spin relative -top-[10rem] left-[5.5rem] Loading max-md:mb-10'/>} 
//         <button type="submit" className=''>Create Blog Post</button>
//       </div>
//       </div>

//     </form>
<form onSubmit={handleSubmit}>
<div className='createPost grid justify-center h-[100vh]'>
  <Link to='/'><div className='mt-3 text-white'><FaArrowLeft className='cursor-pointer'/></div></Link>
  <div className='relative top-5'><img src={userProfile.user_metadata?.avatar_url || NoImage} alt='No image' className='w-25 h-25 rounded-full border-4 border-white'/></div>
  <div className='bgPost h-[70vh] rounded-[5px] md:w-[50vw] max-md:w-[90vw]'>
    {/* Top header */}
    <div className='grid place-content-center'> 
    <div className='flex gap-10 items-center'>
      <div className='font-bold'>Create Post</div>
    </div>
    </div>
    {/* Content */}
    <div className='grid justify-center mt-7'>
    <div className='inputBg md:w-[40vw] w-[85vw] h-[40vh] rounded-[4px]'>
     <div className='px-4 py-2'><input required type='text' className='outline-0 w-[60vw] px-2' placeholder='Your title here' value={title} onChange={(e) => {setTitle(e.target.value); handleInputChange(e);}}/></div>
     <div className='px-4 py-2'><textarea type='text' className='outline-0 w-[70vw] h-[20vh] px-2' placeholder='Post description' value={content} onChange={(e) => {setContent(e.target.value); handleInputChange1(e);}}/></div>
     <div className='px-4'><input type='text' className='outline-0 w-[60vw] px-2' placeholder='Post Link here' value={link} onChange={(e) => setLink(e.target.value)}/></div>
     <div>
        <input type='file' id='file' onChange={(e) => {setImage(e.target.files[0]); handleImageChange(e);}}  style={{ display: 'none'}}/>
        </div>
        <div className='flex gap-4 items-center'>
       <label htmlFor='file'  className='' >
          <img src={Imagefile}  className='w-8 ml-4' />
</label>
<div><Link to='/createVideo'><PiVideoCameraBold  className='text-3xl'/></Link></div>
</div>
<div className='py-2 max-md:py-6'>
  {preview && (
    <div className='flex'>
      <img className='w-25 rounded-[5px] h-[10vh]' src={preview} alt='Select Image'/>
      <div className='relative -top-2 right-2'><MdOutlineCancel onClick={() => setPreview(null)} className='text-xl text-amber-400'/></div>
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

export default BlogPostForm;

