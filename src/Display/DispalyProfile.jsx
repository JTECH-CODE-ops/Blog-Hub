import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { ImSpinner3 } from "react-icons/im";
import './DisplayProfile.scss'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import Like from '../Router/Like';
import { FaPhoneSquareAlt, FaRegComment } from "react-icons/fa";
import UserProfilePage from '../Display/DispalyProfile';
import UserAvatar from '../Router/UserAvatar';
import { IoMdCard } from "react-icons/io";
import { MdOutlineFileDownload, MdVerified } from "react-icons/md";
import { TbDots } from "react-icons/tb";
import ReadMoreToggle from "../Updates/ReadMoreToggle";
import ManualShare from "../Updates/ManualShare";
import Share from "../Updates/Share";
import { ImCancelCircle } from "react-icons/im";

dayjs.extend(relativeTime)

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
   const [isImage, setIsImage] =  useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select('user_name, avatar_url, Bio, Badge, profile, Number')
        .eq('id', userId)
        .single()

      if (error) {
        console.error(error)
      }
      else {
        setUser(data)
        console.log(data)
      }
    }

    const fetchpostUser = async () => {
      const { data, error } = await supabase
        .from("blog_post_with_comment_counts")
        .select(`*, profiles (id, user_name, avatar_url)`)
        .eq('user_id', userId)
        .not('Title', 'is', null)
        .order('is_pinned', { ascending: false })
        .order('pinned_at', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setPosts(data)
        console.log(data)
      }
    }
    fetchpostUser()
    fetchUser();
  }, [userId]);



  if (!user) return <div className="flex items-center gap-2 justify-center"><p className="text-2xl font-bold">Loading...</p><ImSpinner3 className="text-2xl animate-spin text-blue-600"/></div>;

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

  return (
    <div className="otherMain">
      {/* Top header */}
      <div className="grid justify-center">
    <div className="flex items-center gap-15 mt-5">
      <div className=""> <Link to='/'><FaArrowLeft className="text-2xl text-amber-400"/></Link></div>
      <div className="text-2xl font-extrabold">Profile</div>
    </div>
    </div>
    {/* background Profie */}
    <div className="grid justify-center rounded-[15px] otherMain1 h-[67.5vh]">
     <div className="Userbg h-[20vh] w-[100vw] border-b-4 border-b-white rounded-[20px]">
      <div className="px-8 mt-10">
        <div className="w-45 "><img src={user.avatar_url} className="rounded-full w-24 h-25 border-4 border-white"/></div>
        <div className="text-3xl font-extrabold flex items-center gap-4 text-white">@{user.user_name}{user.Badge ? (<p><MdVerified className="text-blue-600"/></p>) : (<span></span>)}</div>
      </div>
      <div className="text-white flex px-4 py-8 font-bold">Bio: {user.Bio || 'This User Have Not Created A Bio yet!'}</div>
      <div className="text-amber-400 items-center gap-2 flex px-4 py-8 font-bold"><IoMdCard />PROFILE: {user.profile || 'Hey, I am Blog-Hub '}</div>
      <div className="text-amber-400 flex px-4 font-bold items-center gap-2"><FaPhoneSquareAlt />Phone No: {user.Number || 'No Phone Number'}</div>
     </div>
     </div>
    
     {/* Posts continue */}
     {posts.map((blog) => (
      <div onClick={UserProfilePage} key={blog.id} className='h-[85vh] grid justify-center'>
        {/* PostBackground */}
        <div style={{backgroundColor: 'whitesmoke'}} className='w-[96vw] h-[78vh] rounded-[12px]'>
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
            <button style={{fontFamily: 'Rosehot'}} className='mt-2'><ReadMoreToggle text={blog.Content} /></button>
            </div>
            </div>
        </div>
        {/* Comment Like Share Link */}
        <div className='flex justify-center gap-11'>
          <div className="py-1" style={{fontFamily: 'Rosehot'}}><Like postId={blog.id} /></div>
           <Link to={`/post/${blog.id}/comments`}><div style={{fontFamily: 'Rosehot'}} className='flex items-center gap-2'><FaRegComment />{blog?.comment_count || 0}</div></Link>
          <div style={{fontFamily: 'Rosehot'}}><Share post={blog} /></div>
          <div style={{fontFamily: 'Rosehot'}}><ManualShare share={blog} /></div>
        </div>
        </div>
        </div>
        ))}
     
    </div>
  );
}

export default ProfilePage;