import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Imagefile from '../img/image-solid-full.svg'
import { ImSpinner6 } from "react-icons/im";
import { PiVideoCameraBold  } from "react-icons/pi";
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const Updatepost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState('')
  const [Loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
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

    const fetchBlogPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_post')
          .select('*')
          .eq('id', postId)
          .single()

        if (error) {
          console.error(error)
        } else {
          setTitle(data.Title)
          setContent(data.Content)
          setImageUrl(data.image_url)
          setLink(data.Link)
          console.log('New', data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchBlogPost()
    fetchUser();
  }, [postId]);

  const handleImageChange = (event) => {

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
      ;

    reader.readAsDataURL(event.target.files[0])
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true)
  let finalImageUrl = image.image_url;
    //   let fileEXT;
    // let filePath;
    
    // const filePath = `${title}.${fileEXT}`;

    // if (imageUrl && imageUrl.name) { // Check if imageUrl and imageUrl.name are defined
    //     fileEXT = image.name.split('.').pop();
    //     filePath = `${title}.${fileEXT}`;
    // } else{
    //   console.warn("imageUrl or imageUrl.name is undefined. Skipping file extension extraction.");
    //   return;
    // }

    try {

      if(image) {
        const fileEXT = image.name?.split('.').pop();
        const fileName = `${Date.now()}.${fileEXT}`

        const { error: imageError } = await supabase.storage
        .from('bloggers')
        .upload(fileName, image, { upsert: true });
        if(imageError){
          console.error('Upload error:', imageError)
          return;
        }

        const {data: urlData} = supabase.storage
          .from('bloggers')
          .getPublicUrl(fileName);

         finalImageUrl = urlData.publicUrl
      }
      
      

        // const profileImageUrl = supabase.storage
        //   .from('bloggers')
        //   .getPublicUrl(filePath).data.publicUrl;

      const { data, error } = await supabase
        .from('blog_post')
        .update({
          Title: title,
          Content: content,
          Link: link,
          image_url: finalImageUrl
        })
        .eq('id', postId);

      if (error) {
        toast.error('Update Failed')
        setLoading(false)
        console.error(error);
      }
      toast.success('Update Successful')
      console.log(data)
      navigate('/profile')
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const AvatarChange = (event) => {
  setImage(event.target.files[0])
}

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
    // <form onSubmit={handleUpdate}>
    //   <div className='formBlogs'>
    //     <Link to='/'><p className='text-2xl text-white mt-2'><FaRegArrowAltCircleLeft /></p></Link>
    //     <div className='w-9 h-2 mt-4'>
    //       <img src={userProfile.user_metadata?.avatar_url} className='w-12 h-10 rounded-full' />
    //     </div>
    //     <h1>Update A Post</h1>
    //     <div>
    //       <label>
    //         Title:
    //         <input required placeholder=' Whats on your mind?' type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='' />
    //       </label>
    //     </div>
    //     <div>
    //       <label className=''>
    //         Content:
    //         <textarea placeholder=' Feel free to express it 😀, ' value={content} onChange={(e) => setContent(e.target.value)} className='Content' />
    //       </label>
    //     </div>

    //     <div>
    //       <label className='httpLink'>
    //         Link:
    //         <textarea placeholder=' Share a Link ' value={link} onChange={(e) => setLink(e.target.value)} className='Content' />
    //       </label>
    //     </div>
    //     <div>
    //       <input 
    //       style={{ display: 'none' }}
    //       type='file' 
    //       id='file'
    //        onChange={(e) => 
    //        { AvatarChange(e) 
    //        handleImageChange(e) 
    //        }}  />
    //     </div>
    //     <label htmlFor='file' className='label' >
    //       <img src={Imagefile} className='icon' />
    //       {imageUrl && (
    //         <img className='relative left-[14rem] top-[-3rem] w-[10rem] h-[4rem] rounded-[5px] ' src={imageUrl} alt='Selected Image' />
    //       )}
    //       {preview && (
    //         <img className='relative left-[14rem] top-[-7rem] w-[10rem] h-[4rem] rounded-[5px] ' src={preview} alt='Selected Image' />
    //       )}
    //     </label>
    //     <div>
    //       <span className='Add'>Add an image</span>
    //     </div>
    //     <div>
    //       {Loading && <AiOutlineLoading className='text-amber-300 text-5xl animate-spin relative -top-[10rem] left-[5.5rem] Loading' />}
    //       <button type="submit" className=''>Update Blog Post</button>
    //     </div>
    //   </div>

    // </form>
    <form onSubmit={handleUpdate}>
    <div className='createPost grid justify-center h-[100vh]'>
      <Link to='/'><div className='mt-3'><FaArrowLeft className='text-white cursor-pointer'/></div></Link>
      <div className='relative top-5'><img src={userProfile.user_metadata?.avatar_url} alt='No image' className='w-20 h-20 rounded-full border-4 border-white'/></div>
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
    <div><PiVideoCameraBold  className='text-3xl'/></div>
    </div>
    <div className='py-2 max-md:py-6'>
      {preview && (
        <div className='flex'>
            {imageUrl && (
            <img className='w-25 rounded-[5px] relative  h-[10vh]' src={imageUrl} alt='Selected Image' />
          )}
          <div className='relative -top-2 right-2'><MdOutlineCancel onClick={() => setPreview(null)} className='text-xl text-amber-400'/></div>
          <img className='w-25 rounded-[5px] relative right-30 h-[10vh]' src={preview} alt='Select Image'/>
          </div>
    )}
    </div>
    <div className='grid'>
      <div className='justify-end flex'>
    <button type="submit" className='font-extrabold bgSubmit text-white pl-6 pr-6 pt-2 pb-2 rounded-[6px]'>Update</button>
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

export default Updatepost;