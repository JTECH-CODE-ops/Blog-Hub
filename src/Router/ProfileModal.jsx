import React, { useState } from 'react'
import Modal from './Modal';

const ProfileModal = ({ user }) => {
 const [isOpen, setIsOpen] = useState(false);
 
   if(!user){
     return <div>No User</div>
   }

  const imageUrl = user.avatar_url

  return (
    <div>
        <img 
        src={imageUrl}
        alt='No Image'
        style={{
          width: '200px',
          height: '80px',
          borderRadius: '50%',
          cursor: 'pointer',
          objectFit: 'cover',
        }}

        onClick={() => setIsOpen(true)}
       />
       <Modal 
       isOpen={isOpen}
       onClose={() => setIsOpen(false)}>
        <img src={imageUrl}
          alt={imageUrl}
        style={{ width: '100%', height: 'auto', borderRadius: 8}}
          
        />
        <button onClick={() => setIsOpen(false)}></button>
        </Modal>
    </div>
  )
}

export default ProfileModal