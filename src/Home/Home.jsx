import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import './Home.scss'
import { MdOndemandVideo } from "react-icons/md";
import { ImSpinner3 } from "react-icons/im";
import { FaRegComment } from "react-icons/fa";
import User from '../Images/0d7c8903a5fdae153a497f5fb051b951.jpg'
import { HiOutlineStatusOnline } from "react-icons/hi";
import { HiMiniUsers } from "react-icons/hi2";
import { IoMdHome } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import ImageHead from '../Images/134111-758552424_tiny.mp4'
import { IoNotifications } from "react-icons/io5";
import { FaComment, FaRegShareFromSquare } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { AiFillPlusCircle } from "react-icons/ai";
import { LuLogIn } from "react-icons/lu";
import { GiCancel } from "react-icons/gi";
import { FaQuestionCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdOutlineFileDownload } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { FaRegUser } from "react-icons/fa";
import { FaSquarePlus } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { ImSpinner6 } from "react-icons/im";
import { MdCircleNotifications } from "react-icons/md";
import UserAvatar from '../Router/UserAvatar';
import { IoSearchCircle } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
// import { useNotifications } from '../Router/NotifAlert';
import UserProfilePage from '../Display/DispalyProfile';
import { toast } from 'react-toastify';
import Like from '../Router/Like';
// import useAuthorPresence from '../Updates/AuthorPresence';
import Logo from '../Images/BlogHubLogo.jpg'
import ReadMoreToggle from '../Updates/ReadMoreToggle';
import Share from '../Updates/Share';
import ManualShare from '../Updates/ManualShare';

dayjs.extend(relativeTime)

const Home = () => {
  // const { onlineUsers } = useAuthorPresence()
  // const { newAlert, setNewAlert } = useNotifications()
  const [blogs, setBlogs] = useState([]);
  const [Loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState({});
  const [user, setUser] = useState(null)
  // const [toggle, setToggle] = useState(false)
   const [isImage, setIsImage] =  useState(null)
  //  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null)
      
      const{ data: google, error} = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        user_name: user.user_metadata.display_name ?? 'user',
        avatar_url: user.user_metadata.avatar_url,
      })

      if(error) {
        console.error('Google', error)
      }else [
        console.log('Google Data', google)
      ]
   };

    const fetchNotifications = async () => {

      const { data: noData, error: noError } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .eq('read', false)

      if (noError) {
        console.error(noError)
      } else {
        // console.log(noData)
        setNotifications(noData)
      }
    }
    getUser();
    fetchNotifications();
  }, [user])

  const handleDownloadImage = async () => {
        try{
            const response = await fetch(isImage)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Blog_Hub_File.jpg';
            a.click();
            URL.revokeObjectURL(url);
        }catch (error) {
            console.error(error)
        }
     }

   const handleImageClick = (imageUrl) => {
            setIsImage(imageUrl)
        }
        const handleCloseImage = () => {
            setIsImage(null)
        }

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`

        },
        async (payload) => {
          const newNotification = payload.new;
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel)
    }
  })

  const Logout = async (e) => {
    e.preventDefault();
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      try {
        await supabase.auth.signOut();
        navigate("/login")
      } catch (error) {
        console.error('Error logging out', error)
      }
    }
  }


  useEffect(() => {

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          // navigate("/login")
          console.error(error);
        } else {
          setUserProfile(data.data || data.user);
          console.log(data)
        }
      } catch (error) {
        console.error(error);
      }

    };
    const fetchBlogs = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('blog_post_with_comment_counts')
          .select(`*, profiles (id, user_name, avatar_url, Badge)`)
          .not('Title', 'is', null)
          .order('created_at', { ascending: false })
          

        if (error) {
          // toast.error('Check Your Network Or Login Again')
          setLoading(false)
          console.error(error);
        } else {
          setLoading(false)
          // console.log(data)
          setBlogs(data);
        }
      } catch (error) {
        navigate('/login')
        toast.error('Try Logging In Again')
        setLoading(false)
        console.error(error);
      }
    };


    const fetchImageUrls = async () => {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .list();

      if (error) {
        console.error(error)
      } else {
        const urls = data.map((file) => supabase.storage.from('avatars').getPublicUrl(file.name).data.publicUrl);
        // setImageUrls(urls)
        console.log(urls)
      }
    }
    fetchImageUrls()
    fetchBlogs();
    fetchUser();

    const channel = supabase
      .channel('blog_posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'blog_post',
        // filter: `post_id=eq.${postId}`,
      },
        async (payload) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.user_id)
            .single()
          const newCommentWithUser = { ...payload.new, profiles: userData };
          setBlogs((prev) => [
            newCommentWithUser, ...prev]);
          alert('New Post')
        }
      )
      .subscribe((status) => {

        console.log(status)
      });

    return () => {
      supabase.removeChannel(channel)

    }
  }, [navigate]);

  if(!user) return <div className='grid justify-center mt-[45vh]'>
    <div><ImSpinner3 className='text-5xl relative ml-10 mb-5 animate-spin text-blue-600'/></div>
    <Link to='/login'><button style={{backgroundColor: 'blue', fontFamily: 'Rosehot'}} className='font-bold flex items-center gap-2 text-white p-2 rounded-3xl'>Login Again<LuLogIn className='text-xl'/></button></Link>
    </div>

  return (
    <div className='HomeMain'>
      {/* Top Header */}
      <div>
         <div style={{fontFamily: 'Bulb'}} className='relative top-4 px-2'>
      <div className='text-xl text-blue-900'>bloghub</div>
      </div>
      <div className='flex justify-end relative -top-4'>
      {/* Other Top */}
      <div className='flex gap-5 items-center'>
    
      <Link to='/createBlog'><div><AiFillPlusCircle className='text-3xl text-blue-600'/></div></Link>
       <Link to='/profile'><div><img src={userProfile.user_metadata?.avatar_url} className='w-10 rounded-full h-10 border-blue-700 border-3'/></div></Link>
      </div>
      </div> 
      <div className='flex gap-20 justify-center'>
        <Link to='/Videos'><div><div><MdOndemandVideo  className='text-3xl text-blue-600'/><div></div></div></div></Link>
       <Link to='/Notify'><div className='relative -top-2'><div className='flex items-center'><MdCircleNotifications className='text-3xl text-blue-600'/><div style={{backgroundColor: 'red', fontFamily: 'Rosehot'}} className='w-6 h-6 justify-center mb-5 text-white  font-bold flex rounded-full'>{notifications.length}</div></div></div></Link>
        <Link to='/Searchusers'><div><div><IoSearchCircle className='text-3xl text-blue-700'/></div></div></Link>
      </div>
      </div>
      {/* Middle Header */}
      <div className='h-[77vh] overflow-y-scroll'>
        {blogs.map((blog) => (
      <div onClick={UserProfilePage} key={blog.id} className='h-[85vh] grid justify-center'>
        {/* PostBackground */}
        <div style={{backgroundColor: 'whitesmoke'}} className='w-[96vw] md:w-[50vw] h-[78vh] rounded-[12px]'>
          <div className='overflow-y-scroll h-[70vh] mb-3'>
          {/* User-Id */}
          <div className='flex gap-3 px-3 py-3'>
            {/* <div><img src={User} className='w-10 rounded-full h-10'/> </div> */}
            <div><UserAvatar key={blog.id} user={blog.profiles} size={40} /></div>
            <div>
              <div style={{fontFamily: 'Rosehot'}} className='font-extrabold '><Link className='' to={`/profile/${blog.user_id}`}><div className='flex items-center gap-2'>{blog.profiles?.user_name}{blog.profiles.Badge ? (<div><MdVerified className="text-blue-600 text-xl"/></div>) : (<div></div>)}</div></Link></div>
              <div>{dayjs(blog.created_at).fromNow()}</div>
            </div>
            </div>
            {/* Post Content */}
            <div>
              {/* Post Pic */}
            <div className='grid justify-center'>
              <div><img src={blog.image_url} onClick={() => handleImageClick(blog.image_url)} className='w-[90vw] h-[50vh]'/></div>
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
                        <img src={isImage}  style={{ maxWidth: '90%', maxHeight: '100%' }} />
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
            <div style={{fontFamily: 'arial'}} className='text-xl font-semibold'>{blog.Title}</div>
            <div className='text-xl'>   <a
                  href={blog.Link}
                  className='text-blue-700 underline'>{blog.Link} </a></div>
            <button style={{fontFamily: 'Rosehot'}} className='mt-2 font-bold'><ReadMoreToggle text={blog.Content} /></button>
            </div>
            </div>
        </div>
        {/* Comment Like Share Link */}
        <div className='flex justify-center gap-11'>
          <div className='py-1' style={{fontFamily: 'Rosehot'}}><Like postId={blog.id} /></div>
           <Link to={`/post/${blog.id}/comments`}><div style={{fontFamily: 'Rosehot'}} className='flex items-center gap-2'><FaRegComment />{blog?.comment_count || 0}</div></Link>
          <div style={{fontFamily: 'Rosehot'}}><Share post={blog} /></div>
          <div style={{fontFamily: 'Rosehot'}}><ManualShare share={blog} /></div>
        </div>
        </div>
        </div>
        ))}
        </div>
        {/* Bottom Header */}
      <div className='grid gap-10 grid-cols-5'>
       <Link to='/'><div><IoMdHome className='text-2xl text-blue-600'/></div></Link>
        <Link to='/faq'><div><FaQuestionCircle className='text-2xl text-blue-600'/></div></Link>
        <Link to='/Invite'><div><FaRegShareFromSquare className='text-2xl text-blue-600'/></div></Link>
        <Link to='/Online-Users'><div><HiMiniUsers className='text-2xl text-blue-600'/></div></Link>
        <div><LuLogOut onClick={Logout} className='text-2xl text-blue-600'/></div>
      </div>
    </div>
  )
}

export default Home