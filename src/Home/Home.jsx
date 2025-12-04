import { Link, useNavigate } from 'react-router-dom';
import { TiThMenu } from "react-icons/ti";
import './Home.scss'
import { HiOutlineStatusOnline } from "react-icons/hi";
import imageHead from '../Images/60bc027d360aec7bb7f504c9edc8f40d.jpg'
import { IoNotifications } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { FaRegCommentAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { FaQuestionCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { FaSquarePlus } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { ImSpinner6 } from "react-icons/im";
import UserAvatar from '../Router/UserAvatar';
import { useNotifications } from '../Router/NotifAlert';
import ThumbNail from '../Images/no-image-icon-23485.png'
import UserProfilePage from '../Display/DispalyProfile';
import { toast } from 'react-toastify';
import Like from '../Router/Like';
import useAuthorPresence from '../Updates/AuthorPresence';

const Home = () => {
  const { onlineUsers } = useAuthorPresence()
  const { newAlert, setNewAlert } = useNotifications()
  const [blogs, setBlogs] = useState([]);
  const [Loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState({});
  const [user, setUser] = useState(null)
  const [toggle, setToggle] = useState(false)
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

  
      // const createProfileIfNotExists = async (user) => {
      //   const {data: existingProfile, error} = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', user.id)
      
      //   if(!existingProfile) {
      //     await supabase
      //     .from('profiles')
      //     .insert({
      //       id: user.id,
      //       user_name: user.user_metadata.display_name ?? 'User',
      //       avatar_url: user.user_metadata.avatar_url,
      //     })
      //   }else{
      //     console.error('Google error', error)
      //   }
      // }

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



  const DisplayNone = (
    <h1><GiCancel className='text-2xl' />
      <div className='font-bold bg-black w-[8rem] Menu'>
        <Link to='/profile'><p className='text-white'><FaRegUser className='relative top-[18px]' />Profile</p></Link>
        <Link to='/Faq'><p className='text-white'><FaQuestionCircle className='relative top-[18px]' />Faq</p></Link>
        <Link to='/Notify'><p className='countNotify text-white flex'><IoNotifications className='ml-[-20px] relative top-[0.1px] text-[1.5rem]' /><p1 className='noCount text-white relative text-[14px] top-0.5 left-22.5'>{notifications.length}</p1><p1 className='relative -left-5'>Notification</p1></p></Link>
        <p className='text-white' onClick={Logout}><LuLogOut className='relative top-[19px]' />Logout</p>
        <Link to='/Online-Users'><p className='text-white'><HiOutlineStatusOnline className='relative top-[18px]' />see Whose Online ?</p></Link>
      </div>
    </h1>
  )

  const Display = (
    <IoMenu className='text-2xl' />
  )

  useEffect(() => {
    // const fetchCount = async () => {
    //   const { data: countData, error } = await supabase
    //     .from('blog_post_with_comment_count')
    //     .select('*');

    //   if (error) {
    //     console.error(error)
    //   } else {
    //     setBlogs(countData)
    //     console.log(countData)
    //   }
    // };

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          navigate("/register")
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
          .from('blog_post_with_comment_count')
          .select(`*, profiles (id, user_name, avatar_url)`)
          .order('created_at', { ascending: false });

        if (error) {
          toast.error('Check Your Network Or Login Again')
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

  // const deletePost = async (postId) => {
  //   if(!postId) {
  //     toast.error('POSTID Required');
  //     return;
  //   }

  //   try{
  //     const {data, error} = await supabase
  //   .from("blog_post")
  //   .delete()
  //   .eq("id", postId);

  //   if(error) {
  //     console.error(error)
  //   }else{
  //     toast.success("Post Deleted")
  //     console.log('Your Data', data)
  //     setBlogs((prevBlog) => prevBlog.filter((post) => post.id !== postId))
  //   }
  //   }catch (error) {
  //     console.error('ANOTHER ERROR'), error
  //     toast.error('TRY AGAIN')
  //   }

  // }
  return (
    <div className='MainHeader'>
      {/* header */}
      <div className='header grid grid-cols-2'>
        <div>
          <h1 className='font-bold text-3xl text-purple-500'>Blog<p1 className='text-amber-200 text-2xl font-semibold'>hub</p1></h1>
        </div>
        <div className='flex justify-end w-50'>
          <Link to='/createBlog'><button className='text-white mr-3 flex items-center gap-2'>Post<FaSquarePlus className='text-2xl' /></button></Link>
          <Link to='/profile'>{userProfile && <img src={userProfile.user_metadata?.avatar_url} className='w-10 h-10 rounded-full border-2 border-amber-300' />}</Link>
          <button onClick={() => setToggle(true)} className='text-white mr-1 ml-2 flex items-center gap-2'>{toggle ? '' : Display}</button>
          <button onClick={() => setToggle(false)} className='text-white mr-1 ml-2 flex items-center gap-2'>{toggle ? DisplayNone : ''}</button>
        </div>
      </div>
      {/* image header */}
      <div className='header2 grid grid-cols-1'>
        {newAlert && (<div className='AlertNotify text-green-500'><p1>{newAlert}</p1>
          <button onClick={() => setNewAlert(null)}><RiCloseCircleFill /></button>
        </div>)}
        <h3>Users Online: {onlineUsers.length}</h3>
        <div className='flex justify-center'>
          {/* <ul className='relative top-[10rem] Online'>
          {onlineUsers.map((u) => (
            <li key={u.user_id} className=''>
              {u.user_id === users.id ? "You" : u.user_name}
            </li>
          ))}
         </ul> */}
          <img src={imageHead} className='w-[36rem] h-[20rem]' />
        </div>

        <div className='header3 flex justify-center'>
          {Loading && <ImSpinner6 className='animate-spin relative left-[5rem] text-4xl top-[3rem] text-blue-700' />}
          <span className='mt-4 Latest'>Latest Stories</span>
        </div>
        {blogs.map((blog) => (
          <div key={blog.id} onClick={UserProfilePage} className='UserPost mb-14 flex justify-center mt-5'>
            {/* user profile */}
            <div className='flex gap-3 relative left-10 User_id'>
              <p1 className='profileImage w-[2rem] h-[2rem] rounded-full'><UserAvatar key={blog.id} user={blog.profiles} size={40} /></p1> {/* <img src={blog.profiles?.avatar_url || UserImage} className='profileImage w-[2rem] h-[2rem] rounded-full' /></p1> */}
              <div className='w-[2rem]'>
                <span className='flex'><Link to={`/profile/${blog.user_id}`}>{blog.profiles?.user_name
                }</Link></span>

              </div>
            </div>
            <div></div>
            {/* post content */}
            <div className='UserContent relative mr-5 top-12'>
              <div className=''>
                <a
                  href={blog.Link}
                  className='text-blue-700 underline'>{blog.Link} </a>
              </div>
              <div><p className=''>Posted {new Date(blog.created_at).toDateString() || ''}</p></div>
              <h2 className='text-xl'>{blog.Title}</h2>
              <p className='text-[12px]'>{blog.Content}</p>
              <div>
                <img src={blog.image_url} className='mt-4 w-[40rem] rounded-2xl' alt='NO IMAGE For This Post' />
              </div>
              {/* <Like postId={blog.id} /> */}
            </div>

            <Link to={`/post/${blog.id}/comments`}>
              <div className='Comment  relative right-[25rem] top-[24rem]'>
                <FaRegCommentAlt className='relative  -top-10rem text-[24px]]' />
                <p className='commentCount ml-2 mt-[-5px]'>{blog?.comment_count || 0}</p>
              </div>
              <Link to='/'>
                <div className='Like'>
                  <Like postId={blog.id} />
                </div>
              </Link>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )


  // return (
  //   <div>
  //     <div className="Apps">
  //     <div className="h-[50vh] bg-red-600">APPS1</div>
  //     <div className="menuApp2 h-[50vh] bg-blue-700">APPS2</div>
  //     <div className="menuApp3">APPS3</div>
  //     </div>
  //   </div>
  // )
}

export default Home