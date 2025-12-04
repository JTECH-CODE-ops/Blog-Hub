import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Link } from 'react-router-dom';
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import './DisplayProfile.scss'
import Like from '../Router/Like';
import { FaCircleCheck } from "react-icons/fa6";
import { FaRegCommentAlt } from "react-icons/fa";
import UserAvatar from '../Router/UserAvatar';
import UserProfilePage from '../Display/DispalyProfile';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select('user_name, avatar_url, Bio, Badge')
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
        .from("blog_post_with_comment_count")
        .select(`*, profiles (id, user_name, avatar_url)`)
        .eq('user_id', userId)
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
    <div className="Otheruser flex flex-col h-[80rem]  items-center m">
      <div className=''>
                      <Link to='/'><p className='mb-7 relative -left-42 text-2xl text-amber-400'><FaRegArrowAltCircleLeft /></p></Link>
                    </div>
      <img
        src={user.avatar_url}
        alt='no image'
        className="w-24 h-24 rounded-full mb-4"
      />
      <h1 className="Name text-2xl font-semibold text-black">@{user.user_name}</h1>
      <h1 className="text-[12px] font-semibold text-black">{user.Bio}</h1>
      <h1 className="text-2xl font-semibold items-center gap-3 flex text-green-500"><FaCircleCheck/>{user.Badge || 'not Verified'}</h1>
   
   
    {posts.map((blog) => (
        <div className='header2 grid grid-cols-1'>
          <div key={blog.id} onClick={UserProfilePage} className='UserPost mb-14 flex justify-center mt-5'>
            {/* user profile */}
            <div className='flex gap-3 relative left-10 User_id'>
              <p1 className='profileImage w-[2rem] h-[2rem] rounded-full'><UserAvatar key={blog.id} user={blog.profiles} size={40} /></p1> {/* <img src={blog.profiles?.avatar_url || UserImage} className='profileImage w-[2rem] h-[2rem] rounded-full' /></p1> */}
              <div className='w-[2rem]'>
                <span className='flex text-black'><Link to={`/profile/${blog.profiles.user_name}`}>{blog.profiles?.user_name}</Link></span>
              </div>
            </div>
            <div></div>
            {/* post content */}
            <div className='UserContent relative mr-10 top-12'>
              <div className=''>
                <a
                  href={blog.Link}
                  className='text-blue-700 underline'>{blog.Link} </a>
              </div>
              <div><p className='text-black'>Posted {new Date(blog.created_at).toDateString()}</p></div>
              <h2 className='text-2xl text-black'>{blog.Title}</h2>
              <p className='text-[12px] text-black'>{blog.Content}</p>
              <div>
                <img src={blog ? (blog.image_url) : (<p>Teah</p>)} className='mt-4 w-[40rem] rounded-2xl'/>
              </div>
              {/* <Like postId={blog.id} /> */}
            </div>
            <Link to={`/post/${blog.id}/comments`}>
              <div className='Comment  relative right-[25rem] top-[24rem]'>
                <FaRegCommentAlt className='relative text-black  -top-10rem text-[24px]]' />
                <p className='commentCount text-black ml-2 mt-[-5px]'>{blog?.comment_count || 0}</p>
              </div>
              <Link to='/'>
                <div className='Like text-black'>
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

export default ProfilePage;