import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import {
    FacebookShareButton,
    WhatsappShareButton
} from 'react-share'

const Share = ({post}) => {
    const url = `https://bloghubcom.netlify.app/${post.id}`
    const title = post.Title;

  return (
    <div className='flex gap-8'>
        <FacebookShareButton url={url} quote={title}>
            <button><FaFacebookSquare className='text-xl text-blue-600'/></button>
        </FacebookShareButton>
        <WhatsappShareButton url={url} quote={title}>
            <button><IoLogoWhatsapp className='text-2xl text-blue-600'/></button>
        </WhatsappShareButton>
    </div>
  )
}

export default Share