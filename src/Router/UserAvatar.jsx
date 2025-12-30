import React from 'react'
import { useState } from 'react'
import Modal from '../Router/Modal'
import { MdOutlineFileDownload } from "react-icons/md";
import { toast } from 'react-toastify';


const UserAvatar = ({ user, size = 40}) => {
  const [isOpen, setIsOpen] = useState(false);

  if(!user){
    return <div>No User</div>
  }

  const avatarUrl = user.avatar_url || 'https://via.placeholder.com/150';
  const imageUrl = user.image_url

   const handleDownloadImage = async () => {
          try{
              const response = await fetch(avatarUrl)
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

  // console.log(avatarUrl,fullName);
  return (
    <div>
       <img 
        src={avatarUrl}
        alt='No Image'
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          cursor: 'pointer',
          objectFit: 'cover',
        }}

        onClick={() => setIsOpen(true)}
       />

       <Modal 
       isOpen={isOpen}
       onClose={() => setIsOpen(false)}>
        <img src={avatarUrl}
          alt={imageUrl}
        style={{ width: '100%', height: 'auto', borderRadius: 8}}
          
        />
        <button className='text-2xl' onClick={() => setIsOpen(false)}><MdOutlineFileDownload onClick={handleDownloadImage}/></button>
        </Modal>
    </div>
  )
}

export default UserAvatar