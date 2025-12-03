import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Imagefile from '../img/image-solid-full.svg'
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineLoading } from "react-icons/ai"

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
  //   const handleSubmit = async (e) => {

  //     e.preventDefault();
  //     try {
  //       setLoading(true)
  //       // Upload image to Supabase Storage
  // const { data: { user }} = await supabase.auth.getUser();


  //       const { data, error } = await supabase
  //         .storage
  //         .from('bloggers')
  //         .upload(`blog_${Date.now()}.jpg`, image);


  //       if (error) {
  //         setLoading(false)
  //         toast.error('Something went wrong')
  //         console.log(error);
  //       } else {
  //         setLoading(false)
  //         const imageUrl = supabase.storage.from('bloggers').getPublicUrl(data.path).data.publicUrl;
  //         toast.success('Post Created')
  //         navigate("/")
  //         // Create a new blog post in Supabase database
  //         const { data: blogPostData, error: blogPostError } = await supabase
  //           .from('blog_post')
  //           .insert([
  //             {
  //               image_url: imageUrl,
  //               Link: link,
  //               Content: content,
  //               Title: title,
  //               user_id: user.id,  
  //               created_at: new Date().toISOString(),        
  //              },
  //           ]);

  //         if (blogPostError) {
  //           setLoading(false)
  //           console.error(blogPostError);
  //         } else {
  //           console.log(blogPostData);
  //           console.log(data)
  //          console.log(user)
  //         }
  //       }
  //     } catch (error) {
  //       setLoading(false)
  //       console.error(error);
  //       console.log(error.response)
  //     }
  //   };

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
        setLoading(false)
        console.error(error);
      }
      toast.success('Good')
      console.log(data)
      navigate('/')
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const AvatarChange = (event) => {
  setImage(event.target.files[0])
}

  return (
    <form onSubmit={handleUpdate}>
      <div className='formBlogs'>
        <Link to='/'><p className='text-2xl text-white mt-2'><FaRegArrowAltCircleLeft /></p></Link>
        <div className='w-9 h-2 mt-4'>
          <img src={userProfile.user_metadata?.avatar_url} className='w-12 h-10 rounded-full' />
        </div>
        <h1>Update A Post</h1>
        <div>
          <label>
            Title:
            <input required placeholder=' Whats on your mind?' type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='' />
          </label>
        </div>
        <div>
          <label className=''>
            Content:
            <textarea placeholder=' Feel free to express it 😀, ' value={content} onChange={(e) => setContent(e.target.value)} className='Content' />
          </label>
        </div>

        <div>
          <label className='httpLink'>
            Link:
            <textarea placeholder=' Share a Link ' value={link} onChange={(e) => setLink(e.target.value)} className='Content' />
          </label>
        </div>
        <div>
          <input 
          style={{ display: 'none' }}
          type='file' 
          id='file'
           onChange={(e) => 
           { AvatarChange(e) 
           handleImageChange(e) 
           }}  />
        </div>
        <label htmlFor='file' className='label' >
          <img src={Imagefile} className='icon' />
          {imageUrl && (
            <img className='relative left-[14rem] top-[-3rem] w-[10rem] h-[4rem] rounded-[5px] ' src={imageUrl} alt='Selected Image' />
          )}
          {preview && (
            <img className='relative left-[14rem] top-[-7rem] w-[10rem] h-[4rem] rounded-[5px] ' src={preview} alt='Selected Image' />
          )}
        </label>
        <div>
          <span className='Add'>Add an image</span>
        </div>
        <div>
          {Loading && <AiOutlineLoading className='text-amber-300 text-5xl animate-spin relative -top-[10rem] left-[5.5rem] Loading' />}
          <button type="submit" className=''>Update Blog Post</button>
        </div>
      </div>

    </form>
  );
};

export default Updatepost;