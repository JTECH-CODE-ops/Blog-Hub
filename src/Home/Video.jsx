import React, { useEffect, useState } from 'react'
import { ImSpinner6 } from "react-icons/im";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import supabase from '../supabaseClient';
import { toast } from 'react-toastify';
import VideoLike from './VideoLikes';
import { Link } from 'react-router-dom';
import { MdVerified } from "react-icons/md";




const Video = () => {


  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false)
  // const [comment, setComment] = useState([]);



  // const handleCommentClick = (postId) => {
  //   setComment((prevShow) => ({
  //     ...prevShow,
  //     [postId]: !prevShow[postId],
  //   }))
  // }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('blog_post_with_comment_counts')
          .select(`*, profiles (id, user_name, avatar_url, Badge)`)
          .not('video_url', 'is', null)
          .order('created_at', { ascending: false });

        if (error) {
          toast.error('Check your Network Connection')
          setLoading(false)
          console.error(error);
        } else {
          setLoading(false);
          // console.log(data)
          setBlogs(data);
        }
      } catch (error) {
        toast.error('Failed To Load Videos')
        setLoading(false)
        console.error(error);
      }
    };

    fetchBlogs();
  })


  return (
    <div className='videoDisplay overflow-y-scroll'>
      {/* Top Video */}
      <div className='text-2xl flex items-center justify-center font-extrabold'>
        <Link to='/'><FaArrowLeft className='text-white relative right-25 justify-start'/></Link>
        <div className='text-white'>Videos</div>
      </div>
      {/* Video dispaly */}
      {blogs.length === 0 ? (
        <div className='grid justify-center mt-15'>
          {loading && <ImSpinner6 className='animate-spin text-4xl text-blue-600' />}
        </div>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className='h-[100vh]'>
            <div>
              {/* captions */}
              <div className='grid justify-end relative top-45'>
                <div><img src={blog.profiles?.avatar_url} className='w-10 h-10 rounded-full mr-1' /></div>
                <Link to={`/post/${blog.id}/Videos`}><button className='text-2xl px-2 mt-4 mb-4 text-white'><FaRegCommentDots /></button></Link>
                <div className='text-white font-extrabold px-4'>{blog?.comment_count || 0}</div>
                <div className='relative text-red-600 top-3'><VideoLike postId={blog.id} /></div>
                <div></div>
              </div>
              {/* video */}
              <div className='flex justify-center'><video controls src={blog.video_url} className='h-[80vh] w-[70vw]' /></div>
              <div className='text-white relative px-2 font-extrabold text-xl top-5 mb-4 items-center flex gap-2'><div>{blog.profiles?.user_name}</div><div>{blog.profiles.Badge ? (<p><MdVerified className="text-blue-600 text-xl"/></p>) : (<span></span>)}</div></div>
              <div className='text-white relative top-5'><div>##{blog.video_title}</div></div>
            </div>
          </div>
        )))}

    </div>
  )
}

export default Video