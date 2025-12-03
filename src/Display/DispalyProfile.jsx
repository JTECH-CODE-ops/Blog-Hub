// import React, { useEffect, useState } from 'react'
// import '../DisplayProfile.scss'
// import supabase from '../supabaseClient';

// const DispalyProfile = () => {
//    const [users, setUsers] = useState({});
//      const [Loading, setLoading] = useState(true)

//      useEffect(() => {
//        const fetchUser = async () => {
//          setLoading(true)
//          try {
//            setLoading(true)
//            const { data, error } = await supabase.auth.getUser();
//            if (error) {
//              setLoading(false)
//              console.error(error);
//            } else {
//              setLoading(false)
//              setUsers(data.data || data.user);
//              console.log(data)
//            }
//          } catch (error) {
//            setLoading(false)
//            console.error(error);
//          }
//        };
//        fetchUser();
//      }, []);


//    return (
//     <div>
//       {Loading && (<p className='text-amber-300 text-2xl'>LOADING.....</p>)}
//     <div className='UserData'>
//       <ul>
//       {
//         users ? (
//           <div>
//             <h1>Profile</h1>
//             <div className='container'>
//             <span className=''><img src={users.user_metadata?.avatar_url || <span className='animate-pulse'>Loading.....</span>} className='rounded-full'/></span>
//               <p className='text-amber-400 relative right-[2rem]'>User-Name: {users.user_metadata?.display_name || <span className='animate-pulse'>Loading.....</span>}</p>
//             <p className='text-amber-400 relative -top-10 right-[1.5rem] email'>Email: {users.email || <span className='animate-pulse'>Loading.....</span>}</p>
//           </div>
//           </div>
//         ) : (
//            <p className='text-2xl text-violet-900'>Loading.....</p>
//         )
//       }
//       </ul>
//     </div>
//     </div>
//   );
// }

// export default DispalyProfile

// import React, { useState, useEffect } from 'react';
// import  supabase  from '../supabaseClient';
// import { useParams } from 'react-router-dom';

// const UserProfilePage = () => {
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('blog_posts')
//         .select('*')
//         .eq('id', userId)
//         .single();
//       if (error) {
//         console.error(error);
//       } else {
//         console.log(data)
//         setUser(data);
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, [userId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>User not found</div>;
//   }

//   return (
//     <div>
//       <h1>{user.User_id}</h1>
//       <img src={user.user_metadata?.avatar_url} alt={user.name} />
//       <p>Email: {user.user_metadata?.email}</p>
//       {/* Display other user information here */}
//     </div>
//   );
// };

// export default UserProfilePage;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Link } from 'react-router-dom';
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
    <div className="Otheruser flex flex-col h-[80rem]  items-center mt-10">
      <img
        src={user.avatar_url}
        alt='no image'
        className="w-24 h-24 rounded-full mb-4"
      />
      <h1 className="Name text-2xl font-semibold text-black">@{user.user_name}</h1>
      <h1 className="text-2xl font-semibold text-black">{user.Bio}</h1>
      <h1 className="text-2xl font-semibold items-center gap-3 flex text-green-500"><FaCircleCheck/>{user.Badge || 'not Verified'}</h1>
   
   
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
            <div className='UserContent relative top-12'>
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