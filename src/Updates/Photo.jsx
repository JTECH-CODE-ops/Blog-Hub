import React, { useEffect, useState } from 'react'
import '../Profile/Profile.scss'
import Noimage from '../Images/no-image-icon-23485.png'
import supabase from '../supabaseClient'
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';

const Photo = () => {
      const [posts, setPosts] = useState([])
       const [users, setUsers] = useState({});
       const [isImage, setIsImage] =  useState(null)

        const handleImageClick = (imageUrl) => {
            setIsImage(imageUrl)
        }
        const handleCloseImage = () => {
            setIsImage(null)
        }

     const handleDownloadImage = async () => {
        try{
            const response = await fetch(isImage)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Download-image.jpg';
            a.click();
            URL.revokeObjectURL(url);
        }catch (error) {
            toast.error('Could not Download!')
            console.error(error)
        }
     }

      useEffect(() => {
         const fetchUser = async () => {
              try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                  // toast.error('Failed to Load User DATA')

                  console.error(error);
                } else {

                  setUsers(data.data || data.user);
                  // console.log(data)
                }
              } catch (error) {
                console.error(error);
              }
            };



         const fetchUserPsts = async () => {
            const { data, error } = await supabase
              .from('blog_post')
              .select(`*`)
              .eq('user_id', users.id)
              .order('created_at', { ascending: false })
      
            if (error) {
              console.error(error)
      
            } else {
              setPosts(data)
              // console.log(data);
      
            }
      
      
      
          }
          fetchUser()
          fetchUserPsts()
      })

     
    return (
        <div>
            {/* header */}
            <div className='flex items-center gap-8 mb-5 justify-center'>
              <div className="text-black"> <Link to='/profile'><FaArrowLeft className="text-2xl"/></Link></div>
                <div className='Photo1 font-extrabold text-2xl '>Your Photos</div>
            </div>
                <div className='grid grid-cols-3 gap-10'>
                    
                    {posts.length === 0 ? (
                        <div className='Photo1 w-[100vw] grid justify-center text-2xl font-extrabold'>
                         <div className='grid justify-center'><img src={Noimage} className='w-25 mb-2'/></div>
                          <div>No Photos Yet?</div>
                          </div>
                    ): (
                    posts.map((blog) => (
                        <div key={blog.id}>
                            <img
        src={blog.image_url}
        
        onClick={() => handleImageClick(blog.image_url)}
        style={{ cursor: 'pointer' }}
      />

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
                   {/* <img src={blog.image_url} className='w-30 h-30 mb-1' /> */}
                    </div>
                    )))}
                </div>
           
        </div>
    )
}

export default Photo