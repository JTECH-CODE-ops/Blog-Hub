import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { FaEdit } from "react-icons/fa";
import './Profile.scss'
import '../Home/Home.scss'
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import { Link } from 'react-router-dom';
import UserImage from '../img/NoPro-Img.jpg'
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai"
import ProfileModal from '../Router/ProfileModal';
import UserProfilePage from '../Display/DispalyProfile';
import Like from '../Router/Like';
import UserAvatar from '../Router/UserAvatar';
import { toast } from 'react-toastify';
import { AiFillDelete } from "react-icons/ai";

const Profile = () => {

  const [users, setUsers] = useState({});
  const [Loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        setLoading(false)
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setLoading(false)
          console.error(error);
        } else {
          setLoading(false)
          setUsers(data.data || data.user);
          // console.log(data)
        }
      } catch (error) {
        setLoading(false)
        console.error(error);
      }
    };

    const fetchUserPsts = async () => {
      const { data, error } = await supabase
        .from('blog_post_with_comment_count')
        .select(`*, profiles (id, user_name, avatar_url)`)
        .eq('user_id', users.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)

      } else {
        setPosts(data)
        // console.log(data);

      }



    }

    // const fetchBio = async () => {
    //   try{
    //     setLoading(true) 
    //     const { data, error} = await supabase


    //     if (error) {
    //       setLoading(false)
    //       console.error(error)
    //     } else {
    //       setLoading(false)
    //       setUsers(data.data || data.user)
    //       console.log(data)
    //     }
    //   } catch (error) {
    //     setLoading(false)
    //     console.error(error);
    //   }
    // }
    // fetchBio()

    const fetchGoogleUser = async () => {
      const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        setUsers(session?.user ?? authListener.user);
        // console.log(authListener)
      })

      supabase.auth.getSession().then(({ data: { session } }) => setUsers(session?.user));

      return () => authListener?.unsubscribe();

    }
    fetchUserPsts()
    fetchGoogleUser()
    fetchUser();
  }, [users]);

  const deletePost = async (postId) => {
    const confirmLogout = confirm('Are you sure you want to Delete Post?');
      if(confirmLogout) {
        toast.success("Post Deleted")
      try{
        const { error} = await supabase
      .from("blog_post")
      .delete()
      .eq("id", postId);
      if(error) {
        toast.error('TRY AGAIN')
        console.error('The:', error)
      }else{
        setPosts((prevBlog) => prevBlog.filter((post) => post.id !== postId))
      }
      }catch (error) {
        console.error('ANOTHER ERROR', error)
        toast.error('TRY AGAIN')
      }
    }
    }

  return (
    <div className='ALLPROFILES'>
      {Loading && (<p1 className='text-amber-300 text-2xl Load'>LOADING <AiOutlineLoading className='relative -top-7 left-26 animate-spin' /></p1>)}
      <div className='Profile'>
        <div className='Link'>
          <Link to='/'><p className='text-2xl text-amber-400'><FaRegArrowAltCircleLeft /></p></Link>
        </div>
        <h1>Profile</h1>
      </div>



      <div className='UserData'>
        {
          users ? (
            <div>
              <div className='bgProfile'>
                <div className='Profileimage'>
                  {/* <p><img src={users.user_metadata?.avatar_url || UserImage} className='rounded-full border-4 border-white' /></p> */}
                  <p className='rounded-full border-4 border-white'><ProfileModal user={users.user_metadata || UserImage} /></p>
                </div>
                <div className='EditButton'>
                  <Link to='/Edit'><button>Edit Profile</button></Link>
                </div>
              </div>
              <div className='bgIdentities'>
                <div className='Profilename'>
                  <p className='Name'>{users.user_metadata?.display_name || <p1 className='Loading animate-pulse'>User123</p1>}</p>
                </div>
                <div className='Profileemail'>
                  <p className='Email'>{users.user_metadata?.email || <p1 className='Loading animate-pulse'>Loading.....</p1>}</p>
                </div>
                <div className='Profileemail'>
                  <p className='Email'><b>You Joined {new Date(users.created_at).toDateString() || <p1 className='Loading animate-pulse'>Loading.....</p1>}</b> {new Date(users.created_at).toLocaleDateString || <p1 className='Loading animate-pulse'>Loading.....</p1>}</p>
                </div>
                <div className='BIOPROFILE'>
                  <p className='text-green-500'><p1 className='font-bold text-white'>Bio: </p1>{users.user_metadata?.Bio || 'You Have not Created A Bio'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className='text-2xl text-violet-900'>Loading.....</p>
          )
        }
      </div>
      <h2 className='ml-9 h2'>Posts</h2>

      {posts.map((blog) => (



        // <div key={post.id} className='grid justify-center UserProfilePost mb-14 mt-5'>
        //   <div className=' flex gap-3 relative right-32 User_id'>
        //     <p1 className=' w-[2.5rem] h-[2rem] rounded-full'><UserAvatar key={post.id} user={post.profiles} size={40} /></p1> {/* <img src={blog.profiles?.avatar_url || UserImage} className='profileImage w-[2rem] h-[2rem] rounded-full' /></p1> */}
        //     <div className='w-[2rem]'>
        //       <span className=''><Link to={`/profile/${post.profiles.user_name}`}>{post.profiles?.user_name}</Link></span>
        //     </div>
        //   </div>
        //   <div></div>
        //   {/* post content */}
        //   <div className=''>
        //     <div className=''>
        //       <a
        //         href={post.Link}
        //         className='text-blue-700 underline'>{post.Link} </a>
        //     </div>
        //     <div><p className=''>Posted {new Date(post.created_at).toDateString()}</p></div>
        //     <h2 className='text-2xl'>{post.Title}</h2>
        //     <p className='text-[12px]'>{post.Content}</p>
        //     <div>
        //       <img src={post.image_url} className='' alt='NO IMAGE' />
        //     </div>
        //     {/* <Like postId={blog.id} /> */}
        //   </div>
        //   <Link to={`/post/${post.id}/comments`}>
        //     <div className=''>
        //       <FaRegCommentAlt className='' />
        //       <p className='commentCount ml-2 mt-[-5px]'>{post?.comment_count || 0}</p>
        //     </div>
        //     <Link to='/'>
        //       <div className=''>
        //         <Like postId={post.id} />
        //       </div>
        //     </Link>
        //   </Link>

        // </div>
        <div className='header2 grid grid-cols-1 ml-7'>
          <div key={blog.id} onClick={UserProfilePage} className='UserPost mb-14 flex justify-center mt-5'>
            {/* user profile */}
            <div className='flex gap-3 relative left-10 User_id'>
              <p1 className='profileImage w-[2rem] h-[2rem] rounded-full'><UserAvatar key={blog.id} user={blog.profiles} size={40} /></p1> {/* <img src={blog.profiles?.avatar_url || UserImage} className='profileImage w-[2rem] h-[2rem] rounded-full' /></p1> */}
              <div className='w-[2rem]'>
                <span className='flex'><Link to={`/profile/${blog.user_id}`}>{blog.profiles?.user_name}</Link></span>
              <button className='relative max-md:left-40 max-md:-top-4.5 -top-8 left-32 text-green-500' onClick={() => deletePost(blog.id)}><AiFillDelete className='text-xl'/></button>
               <Link to={`/post/${blog.id}/UpdatePost`}><button className='relative max-md:-top-10.5 bottom-14.5 left-23 max-md:left-32 text-green-500'><FaEdit className='text-xl'/></button></Link>
              </div>
            </div>
            <div></div>
            {/* post content */}
            <div className='UserContent relative -left-15 top-12'>
              <div className=''>
                <a
                  href={blog.Link}
                  className='text-blue-700 underline'>{blog.Link} </a>
              </div>
              <div><p className=''>Posted {new Date(blog.created_at).toDateString()}</p></div>
              <h2 className='text-2xl'>{blog.Title}</h2>
              <p className='text-[12px]'>{blog.Content}</p>
              <div>
                <img src={blog.image_url} className='mt-4 w-[40rem] rounded-2xl' alt='NO IMAGE' />
              </div>
              {/* <Like postId={blog.id} /> */}
            </div>
            <Link to={`/post/${blog.id}/comments`}>
              <div className='Comment  relative right-[25rem] top-[24rem]'>
                <FaRegCommentAlt className='relative  -top-10rem text-[24px]]' />
                <p className='commentCount ml-2 mt-[-5px]'>{blog?.comment_count || 0}</p>
              </div>
              <Link to=''>
                <div className='Like'>
                  <Like postId={blog.id} />
                </div>
              </Link>
            </Link>
          </div>

        </div>
      ))}


    </div>
  );
}
export default Profile