import React from 'react'
import { toast } from 'react-toastify'
import { FaShareAlt } from "react-icons/fa";

const ManualShare = ({share}) => {
      const handleShare = async () => {
        if(navigator.share) {
          try {
            await navigator.share({
              title: share.title,
              url: `http://localhost:5173/posts/${share.id}`
            })
          }catch (error) {
            toast.error('Error sharing Post', error)
          }
        }
      }
  return (
    <div onClick={handleShare}><FaShareAlt className='text-xl'/></div>
  )
}

export default ManualShare