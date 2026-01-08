// import React, { useState, useEffect } from 'react';
// import supabase from '../supabaseClient';
// import { FaEdit } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";
// import { FaPhoneSquareAlt } from "react-icons/fa";
// import './Profile.scss'
// import { TbDots } from "react-icons/tb";
// import '../Home/Home.scss'
// import { MdOutlineCancel } from "react-icons/md";
// import { FaArrowLeft } from "react-icons/fa6";
// import { Link } from 'react-router-dom';
// import UserImage from '../img/NoPro-Img.jpg'
// import { FaRegCommentAlt } from "react-icons/fa";
// import { AiOutlineLoading } from "react-icons/ai"
// import ProfileModal from '../Router/ProfileModal';
// import UserProfilePage from '../Display/DispalyProfile';
// import Like from '../Router/Like';
// import UserAvatar from '../Router/UserAvatar';
// import { toast } from 'react-toastify';
// import { AiFillDelete } from "react-icons/ai";
// import { IoMdCard } from "react-icons/io";

// const Profile = () => {

//   const [users, setUsers] = useState({});
//   const [Loading, setLoading] = useState(true)
//   const [posts, setPosts] = useState([])
// const [activePostId, setActivePostId] = useState({});

// const handleToggleMenu = (postId) => {
//   setActivePostId((prevStates) => ({
//     ...prevStates, [postId]: !prevStates[postId],
//   }))
// }

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true)
//       try {
//         setLoading(false)
//         const { data, error } = await supabase.auth.getUser();
//         if (error) {
//           // toast.error('Failed to Load User DATA')
//           setLoading(false)
//           console.error(error);
//         } else {
//           setLoading(false)
//           setUsers(data.data || data.user);
//           // console.log(data)
//         }
//       } catch (error) {
//         toast.error('Check Internet Connection')
//         setLoading(false)
//         console.error(error);
//       }
//     };

//     const fetchUserPsts = async () => {
//       const { data, error } = await supabase
//         .from('blog_post_with_comment_counts')
//         .select(`*, profiles (id, user_name, avatar_url, Badge)`)
//         .eq('user_id', users.id)
//         .not('Title', 'is', null)
//         .order('is_pinned', { ascending: false })
//         .order('pinned_at', { ascending: false })
//         .order('created_at', { ascending: false })

//       if (error) {
//         console.error(error)

//       } else {
//         setPosts(data)
//         console.log(data);

//       }
//     }

//     const fetchGoogleUser = async () => {
//       const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
//         setUsers(session?.user ?? authListener.user);
//         // console.log(authListener)
//       })

//       supabase.auth.getSession().then(({ data: { session } }) => setUsers(session?.user));

//       return () => authListener?.unsubscribe();

//     }
//     fetchUserPsts()
//     fetchGoogleUser()
//     fetchUser();
//   }, [users]);

//   const deletePost = async (postId) => {
//     const confirmDelete = confirm('Are you sure you want to Delete Post?');
//       if(confirmDelete) {
//         toast.success("Post Deleted")
//       try{
//         const { error} = await supabase
//       .from("blog_post")
//       .delete()
//       .eq("id", postId);
//       if(error) {
//         toast.error('TRY AGAIN')
//         console.error('The:', error)
//       }else{
//         setPosts((prevBlog) => prevBlog.filter((post) => post.id !== postId))
//       }
//       }catch (error) {
//         console.error('ANOTHER ERROR', error)
//         toast.error('TRY AGAIN')
//       }
//     }
//     }

//     const pinPost = async (postId) => {
//       await supabase 
//       .from('blog_post')
//       .update({
//         is_pinned: false,
//         pinned_at: null
//       })
//       .eq('user_id', users.id);

//       await supabase
//         .from('blog_post')
//       .update({
//         is_pinned: true,
//         pinned_at: new Date()
//       })
//       .eq('id', postId);
//     };

//     const unpinPost = async (postId) => {
//       await supabase.from('blog_post')
//       .update({
//         is_pinned: false,
//         pinned_at: null
//       })
//       .eq('id', postId)
//     }

//   return (
//     <div className='ALLPROFILES'>
//       {Loading && (<p1 className='text-amber-300 text-2xl Load'>LOADING <AiOutlineLoading className='relative -top-7 left-26 animate-spin' /></p1>)}
//       <div className='Profile'>
//         <div className='Link'>
//           <Link to='/'><p className='text-2xl text-black'><FaArrowLeft /></p></Link>
//         </div>
//         <h1 style={{fontFamily: 'Rosehot', fontWeight: 900}}>Profile</h1>
//       </div>



//       <div className='UserData'>
//         {
//           users ? (
//             <div>
//               <div className='bgProfile'>
//                 <div className='Profileimage'>
//                   {/* <p><img src={users.user_metadata?.avatar_url || UserImage} className='rounded-full border-4 border-white' /></p> */}
//                   <p className='rounded-full border-4 border-white'><ProfileModal user={users.user_metadata || UserImage} /></p>
//                 </div>
//                 <div className='EditButton'>
//                   <Link to='/Edit'><button>Edit Profile</button></Link>
//                 </div>
//               </div>
//               <div className='bgIdentities'>
//                 <div className='Profilename'>
//                   <p className='Name'>{users.user_metadata?.display_name || <p1 className='Loading animate-pulse'>User123</p1>}</p>
//                 </div>
//                 <div className='Profileemail'>
//                   <p className='Email'>{users.user_metadata?.email || <p1 className='Loading animate-pulse'>Loading.....</p1>}</p>
//                 </div>
//                 <div className='Profileemail'>
//                   <p className='Email'><b>You Joined {new Date(users.created_at).toDateString() || <p1 className='Loading animate-pulse'>Loading.....</p1>}</b> {new Date(users.created_at).toLocaleDateString || <p1 className='Loading animate-pulse'>Loading.....</p1>}</p>
//                 </div>
//                 <div className='BIOPROFILE'>
//                   <p className='text-white font-bold'><p1 className='font-bold text-white'>Bio: </p1>{users.user_metadata?.Bio || 'You Have not Created A Bio'}</p>
//                 </div>
//                 <div className='BIOPROFILE items-center gap-2 flex'>
//                   <p><IoMdCard /></p><p className='text-amber-300 font-extrabold'><p1 className='font-bold text-white'>PROFILE: </p1>{users.user_metadata?.Profile || 'You Have not Created A Profile'}</p>
//                 </div>
//                 <div className='BIOPROFILE items-center gap-2 flex'>
//                   <p><FaPhoneSquareAlt /></p><p className='text-amber-300 font-extrabold'><p1 className='font-bold text-white'>Phone No: </p1>{users.user_metadata?.phone || 'Add a Phone Number'}</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className='text-2xl text-violet-900'>Loading.....</p>
//           )
//         }
//       </div>
//       <h2 className='h2 flex justify-center gap-30'>
//         <div className='h3'>Posts</div>
//          <Link to='/Photo'><div className='h3'>Photos</div></Link>
//       </h2>
// <div style={{fontFamily: 'Rosehot'}} className='text-2xl mt-2 gap-2 text-black flex items-center justify-center'>
//   <div><img src={users.user_metadata?.avatar_url || UserImage} className='w-[2rem] h-[2rem] rounded-full' /></div>
//   <div><Link to='/createBlog'><input type='text' className='outline-0 border-2 h-12 rounded-full text-xl px-2 w-65 font-bold' placeholder='Post a Status Update'/></Link></div>
//   </div>
//       {posts.length === 0 ? (
//         <div className='grid mt-5 text-2xl place-content-center'><p className='font-bold'>No posts yet</p>
//         <Link to='/createBlog'><button className='NoB text-[16px] font-bold mt-5'>Create Posts</button></Link>
//      </div>
//       ) : ( posts.map((blog) => (
//         <div className='header2 grid grid-cols-1 ml-7'>
//           <div key={blog.id} onClick={UserProfilePage} className='UserPost mb-14 flex justify-center mt-5'>
//             {/* user profile */}
//             <div className='flex gap-3 relative left-10 User_id'>
//               <p1 className='profileImage w-[2rem] relative left-7 h-[2rem] rounded-full'><UserAvatar key={blog.id} user={blog.profiles} size={40} /></p1> {/* <img src={blog.profiles?.avatar_url || UserImage} className='profileImage w-[2rem] h-[2rem] rounded-full' /></p1> */}
//               <div className='w-[2rem]'>
//                 <span className='flex'><Link className='flex items-center gap-2' to={`/profile/${blog.user_id}`}>{blog.profiles?.user_name}{blog.profiles.Badge ? (<p><MdVerified className="text-blue-600 text-2xl"/></p>) : (<span></span>)}</Link></span>
//                 <div onClick={() => handleToggleMenu(blog.id)}>{activePostId[blog.id] ? (<div></div>) : (<div><TbDots className='text-3xl cursor-pointer'/></div>)}</div>
//         </div>
//               </div>
//             {/* post content */}
//             <div className='UserContent relative -left-15 top-12'>
//               <div className=''>
//                 <a
//                   href={blog.Link}
//                   className='text-blue-700 underline'>{blog.Link} </a>
//               </div>
//               <div className='flex items-center gap-13'>
//                 <p className=''>Posted {new Date(blog.created_at).toDateString()}</p>
//                 <div className='font-bold text-blue-600'>{blog.is_pinned && 'Pinned'}</div>
//                 </div>
//               <h2 className='text-2xl'>{blog.Title}</h2>
//               <p className='text-[12px]'>{blog.Content}</p>
//               <div>
//                 <img src={blog.image_url} className='mt-4 w-[40rem] rounded-2xl' alt='NO IMAGE' />
//               </div>
//               {/* <Like postId={blog.id} /> */}
//             </div>
//             <Link to={`/post/${blog.id}/comments`}>
//               <div className='Comment relative right-[23rem] top-[24rem]'>
//                 <FaRegCommentAlt className='relative  -top-10rem text-[24px]]' />
//                 <p className='commentCount ml-2 mt-[-5px]'>{blog?.comment_count || 0}</p>
//               </div>
//               <Link to=''>
//                 <div className='Like relative'>
//                   <Like postId={blog.id} />
//                 </div>
//               </Link>
//             </Link>
//           </div>
//           {/* Content */}
//      <div className=''>{activePostId[blog.id] ? (
//           <div style={{backgroundColor: 'wheat'}} className='flex h-[25vh] font-extrabold justify-center w-[120vw] items-center gap-49'>
//              <div style={{fontFamily: 'Rosehot'}} className='grid gap-6 px-2'>
//               <Link to={`/post/${blog.id}/UpdatePost`}><div className=''>Edit Post</div></Link>
//               <div onClick={() => deletePost(blog.id)}>Delete Post</div>
//               <div onClick={() => blog.is_pinned ? unpinPost(blog.id) : pinPost(blog.id)}>{blog.is_pinned ? 'UnPin Post' : 'Pin Post'}</div>
//             </div>
//             <p className='relative -top-14' onClick={() => handleToggleMenu(blog.id)}><MdOutlineCancel/></p>
//             </div>
//           ) : (<div></div>)
//           }
//           </div>
//           {/* Edit */}
//         </div>
//       )))}


//     </div>
//   );
// }
// export default Profile

import React, { useState, useEffect } from 'react';
import { RiUnpinFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import supabase from '../supabaseClient';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { MdOutlineFileDownload, MdVerified } from "react-icons/md";
import { FaPhoneSquareAlt, FaRegComment } from "react-icons/fa";
import './Profile.scss'
import { TbDots } from "react-icons/tb";
import '../Home/Home.scss'
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import UserImage from '../img/NoPro-Img.jpg'
import { TbPinnedFilled } from "react-icons/tb";
import { AiOutlineLoading } from "react-icons/ai"
import ProfileModal from '../Router/ProfileModal';
import UserProfilePage from '../Display/DispalyProfile';
import Like from '../Router/Like';
import UserAvatar from '../Router/UserAvatar';
import { toast } from 'react-toastify';
import { IoMdCard } from "react-icons/io";
import ReadMoreToggle from '../Updates/ReadMoreToggle';
import Share from '../Updates/Share';
import { ImCancelCircle } from 'react-icons/im';
import ManualShare from '../Updates/ManualShare';

dayjs.extend(relativeTime)
const Profile = () => {
  const [isImage, setIsImage] = useState(null)
  const [users, setUsers] = useState({});
  const [Loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [activePostId, setActivePostId] = useState({});

  const handleToggleMenu = (postId) => {
    setActivePostId((prevStates) => ({
      ...prevStates, [postId]: !prevStates[postId],
    }))
  }

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        setLoading(false)
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          // toast.error('Failed to Load User DATA')
          setLoading(false)
          console.error(error);
        } else {
          setLoading(false)
          setUsers(data.data || data.user);
          // console.log(data)
        }
      } catch (error) {
        toast.error('Check Internet Connection')
        setLoading(false)
        console.error(error);
      }
    };

    const fetchUserPsts = async () => {
      const { data, error } = await supabase
        .from('blog_post_with_comment_counts')
        .select(`*, profiles (id, user_name, avatar_url, Badge)`)
        .eq('user_id', users.id)
        .not('Title', 'is', null)
        .order('is_pinned', { ascending: false })
        .order('pinned_at', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)

      } else {
        setPosts(data)
        console.log(data);

      }
    }

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
    const confirmDelete = confirm('Are you sure you want to Delete Post?');
    if (confirmDelete) {
      toast.success("Post Deleted")
      try {
        const { error } = await supabase
          .from("blog_post")
          .delete()
          .eq("id", postId);
        if (error) {
          toast.error('TRY AGAIN')
          console.error('The:', error)
        } else {
          setPosts((prevBlog) => prevBlog.filter((post) => post.id !== postId))
        }
      } catch (error) {
        console.error('ANOTHER ERROR', error)
        toast.error('TRY AGAIN')
      }
    }
  }

  const pinPost = async (postId) => {
    await supabase
      .from('blog_post')
      .update({
        is_pinned: false,
        pinned_at: null
      })
      .eq('user_id', users.id);

    await supabase
      .from('blog_post')
      .update({
        is_pinned: true,
        pinned_at: new Date()
      })
      .eq('id', postId);
      toast.success('Post Pinned')
  };

  const unpinPost = async (postId) => {
    await supabase.from('blog_post')
      .update({
        is_pinned: false,
        pinned_at: null
      })
      .eq('id', postId)
  }

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(isImage)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Blog_Hub_File.jpg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error)
    }
  }

  const handleImageClick = (imageUrl) => {
    setIsImage(imageUrl)
  }
  const handleCloseImage = () => {
    setIsImage(null)
  }

  return (
    <div className='ALLPROFILES'>
      {Loading && (<p1 className='text-amber-300 text-2xl Load'>LOADING <AiOutlineLoading className='relative -top-7 left-26 animate-spin' /></p1>)}
      <div className='Profile'>
        <div className='Link'>
          <Link to='/'><p className='text-2xl text-black'><FaArrowLeft /></p></Link>
        </div>
        <h1 style={{ fontFamily: 'Rosehot', fontWeight: 900 }}>Profile</h1>
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
                  <p className='text-white font-bold'><p1 className='font-bold text-white'>Bio: </p1>{users.user_metadata?.Bio || 'You Have not Created A Bio'}</p>
                </div>
                <div className='BIOPROFILE items-center gap-2 flex'>
                  <p><IoMdCard /></p><p className='text-amber-300 font-extrabold'><p1 className='font-bold text-white'>PROFILE: </p1>{users.user_metadata?.Profile || 'You Have not Created A Profile'}</p>
                </div>
                <div className='BIOPROFILE items-center gap-2 flex'>
                  <p><FaPhoneSquareAlt /></p><p className='text-amber-300 font-extrabold'><p1 className='font-bold text-white'>Phone No: </p1>{users.user_metadata?.phone || 'Add a Phone Number'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className='text-2xl text-violet-900'>Loading.....</p>
          )
        }
      </div>
      <h2 className='h2 flex justify-center gap-30'>
        <div className='h3'>Posts</div>
        <Link to='/Photo'><div className='h3'>Photos</div></Link>
      </h2>
      <div style={{ fontFamily: 'Rosehot' }} className='text-2xl mt-2 gap-2 text-black flex items-center justify-center'>
        <div><img src={users.user_metadata?.avatar_url || UserImage} className='w-[2rem] h-[2rem] rounded-full' /></div>
        <div><Link to='/createBlog'><input type='text' className='outline-0 border- h-12 rounded-full text-xl px-2 w-65 font-bold' placeholder='Post a Status Update' /></Link></div>
      </div>
      {posts.length === 0 ? (
        <div className='grid mt-5 text-2xl place-content-center'><p className='font-bold'>No posts yet</p>
          <Link to='/createBlog'><button className='NoB text-[16px] font-bold mt-5'>Create Posts</button></Link>
        </div>
      ) : (posts.map((blog) => (
        <div onClick={UserProfilePage} key={blog.id} className='h-[85vh] grid justify-center'>
          {/* PostBackground */}
          <div style={{fontFamily: 'Rosehot'}} className='font-bold text-xl text-blue-600'>{blog.is_pinned && <div className='flex items-center'><TbPinnedFilled/>Pinned</div>}</div>
          <div style={{ backgroundColor: 'whitesmoke' }} className='w-[96vw] md:w-[50vw] h-[78vh] rounded-[12px]'>
            <div className='overflow-y-scroll h-[70vh] mb-3'>
              {/* User-Id */}
              <div className='flex gap-3 px-3 py-3'>
                {/* <div><img src={User} className='w-10 rounded-full h-10'/> </div> */}
                <div><UserAvatar key={blog.id} user={blog.profiles} size={40} /></div>
                <div>
                  <div style={{ fontFamily: 'Rosehot' }} className='font-extrabold items-center flex gap-2'><Link className='' to={`/profile/${blog.user_id}`}><div className='flex items-center gap-2'>{blog.profiles?.user_name}{blog.profiles.Badge ? (<div><MdVerified className="text-blue-600 text-xl" /></div>) : (<div></div>)}</div></Link><div onClick={() => handleToggleMenu(blog.id)}>{activePostId[blog.id] ? (<div></div>) : (<div><TbDots className='text-3xl cursor-pointer' /></div>)}</div></div>
                  <div>{dayjs(blog.created_at).fromNow()}</div>
                </div>
              </div>
              {/* Post Content */}
              <div>
                {/* Post Pic */}
                <div className='grid justify-center'>
                  <div><img src={blog.image_url} onClick={() => handleImageClick(blog.image_url)} className='w-[90vw] h-[50vh]' /></div>
                </div>
                {isImage && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1000,
                    }}
                  >
                    <img src={isImage} style={{ maxWidth: '90%', maxHeight: '100%' }} />
                    <button
                      onClick={handleCloseImage}
                      style={{
                        position: 'absolute',
                        top: 28,
                        right: 30,
                        border: 'none',
                        color: '#fff',
                        fontSize: 30,
                        cursor: 'pointer',
                      }}
                    >
                      <ImCancelCircle />
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      style={{
                        position: 'absolute',
                        top: 28,
                        right: 80,
                        backgroundColor: '',
                        border: 'none',
                        color: '#fff',
                        fontSize: 30,
                        cursor: 'pointer',
                      }}
                    >
                      <MdOutlineFileDownload />
                    </button>
                  </div>
                )}
                {/* Post Text */}
                <div className='mt-2 px-2'>
                  <div style={{ fontFamily: 'arial' }} className='text-xl font-semibold'>{blog.Title}</div>
                  <div className='text-xl'><a
                  style={{fontFamily: 'Rosehot'}}
                    href={blog.Link}
                    className='text-blue-700 underline'>{blog.Link} </a></div>
                  <button style={{ fontFamily: 'Rosehot' }} className='mt-2 font-bold'><ReadMoreToggle text={blog.Content} /></button>
                </div>
              </div>
            </div>
            {/* Comment Like Share Link */}
            <div className='flex justify-center gap-11'>
              <div className='py-1' style={{ fontFamily: 'Rosehot' }}><Like postId={blog.id} /></div>
              <Link to={`/post/${blog.id}/comments`}><div style={{ fontFamily: 'Rosehot' }} className='flex items-center gap-2'><FaRegComment />{blog?.comment_count || 0}</div></Link>
              <div style={{ fontFamily: 'Rosehot' }}><Share post={blog} /></div>
              <div style={{ fontFamily: 'Rosehot' }}><ManualShare share={blog} /></div>
            </div>
          </div>
          {/* Content */}
          <div className='relative left-20 bottom-[73vh]'>{activePostId[blog.id] ? (
            <div className='flex gap-2 h-[5vh] font-extrabold justify-center items-center'>
              <div style={{ fontFamily: 'Rosehot' }} className='flex gap-2'>
                <Link to={`/post/${blog.id}/UpdatePost`}><div className=''><MdEdit  className='text-xl'/></div></Link>
                <button onClick={() => deletePost(blog.id)}><AiFillDelete  className='text-xl'/></button>
                <button onClick={() => blog.is_pinned ? unpinPost(blog.id) : pinPost(blog.id)}>{blog.is_pinned ? <RiUnpinFill  className='text-xl'/> : <TbPinnedFilled  className='text-xl'/>}</button>
              </div>
              <p className='' onClick={() => handleToggleMenu(blog.id)}><MdOutlineCancel className='text-xl'/></p>
            </div>
          ) : (<div></div>)
          }
          </div>
          {/* Edit */}
        </div>
      )))}


    </div>
  );
}
export default Profile