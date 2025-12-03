import React, { useEffect } from 'react'
import './Design.scss'
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ isOpen, onClose, children }) => {

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);

    }, [isOpen, onClose]);

    if(!isOpen) return null;
  return (
    <div className='modal-overlay' onClick={onClose}>
     <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}><IoMdCloseCircle /></button>
        {children}
     </div>
    </div>
  )
}

export default Modal