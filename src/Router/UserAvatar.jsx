import React from 'react'
import { useState } from 'react'
import Modal from '../Router/Modal'

const UserAvatar = ({ user, size = 40}) => {
  const [isOpen, setIsOpen] = useState(false);

  if(!user){
    return <div>No User</div>
  }

  const avatarUrl = user.avatar_url || 'https://via.placeholder.com/150';
  const imageUrl = user.image_url

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
        <button onClick={() => setIsOpen(false)}></button>
        </Modal>
    </div>
  )
}

export default UserAvatar