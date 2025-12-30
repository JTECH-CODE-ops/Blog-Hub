import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import './DisplayProfile.scss'
import Like from '../Router/Like';
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import UserAvatar from '../Router/UserAvatar';
import { IoMdCard } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import { TbDots } from "react-icons/tb";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
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



  if (!user) return <p>Loading...</p>;

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
      <div key={blog.id}>
       
     {/* profile name and image */}
        <div className="flex items-center gap-4 mt-8 px-2">
        <div><UserAvatar key={blog.id} user={blog.profiles} size={40} /></div>
        <div className="font-bold flex items-center gap-2">{blog.profiles?.user_name}{user.Badge ? (<p><MdVerified className="text-blue-600"/></p>) : (<span></span>)}</div>
        <div>
        <Link to={`/ShowPhoto/${blog.user_id}`}><TbDots /></Link>
      </div>
        </div>
        {/* Post continue */}
        <div className="grid justify-center mt-4">
        <div className="postBG overflow-y-scroll h-[40vh] w-[90vw]">
        <div className="px-2 mt-2"><a href={blog.Link} className="text-blue-700 underline"></a></div> 
        <div className="px-2 py-2 flex gap-15"><div>Posted {new Date(blog.created_at).toDateString()}</div><div className='font-bold text-blue-600'>{blog.is_pinned && 'Pinned'}</div></div>
        <div className="px-2 font-bold text-xl">{blog.Title}</div>
        <div className="px-2.5">{blog.Content}</div>
        <div className="px-2 mt-2"><img src={blog.image_url} alt="No Image" className="w-[85vw] rounded-2xl h-[60vh]"/></div>
      </div>
      {/* Comment and Like */}
      <div className="mt-3 gap-10 flex">
      <div className="CL pl-4 pr-3 rounded-[4px] flex gap-2 items-center pt-1 pb-1"><Link to={`/post/${blog.id}/comments`}><FaRegCommentAlt/></Link>{blog?.comment_count || 0}</div>
      <div className="CL pl-4 pr-3 rounded-[4px] pt-1 pb-1"><Like postId={blog.id} /></div>
      </div>
      </div>
     </div>
     ))}
     
    </div>
  );
}

export default ProfilePage;