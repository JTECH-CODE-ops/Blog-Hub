import React, { useEffect, useState } from 'react'
import '../Profile/Profile.scss'
import Noimage from '../Images/no-image-icon-23485.png'
import supabase from '../supabaseClient'
import { useParams } from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

const ShowPhoto = () => {
     const { userId } = useParams();

      const [posts, setPosts] = useState([])
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
            console.error(error)
        }
     }

      useEffect(() => {



         const fetchUserPsts = async () => {
            const { data, error } = await supabase
            .from("blog_post")
        .select(`*`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
            if (error) {
              console.error(error)
      
            } else {
              setPosts(data)
              console.log(data);
      
            }
      
      
      
          }
         
          fetchUserPsts()
      }, [userId])

     
    return (
        <div>
            {/* header */}
            <div className='grid justify-center'>
                <div className='Photo1 font-extrabold text-2xl mb-5'>Photos</div>
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

export default ShowPhoto