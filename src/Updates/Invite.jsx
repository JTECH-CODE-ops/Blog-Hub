import React from 'react'
import { FaHands } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { PiNumberCircleOneBold } from "react-icons/pi";
import { PiNumberCircleTwoBold } from "react-icons/pi";
import { PiNumberCircleThreeBold } from "react-icons/pi";
import { toast } from 'react-toastify';
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Invite = () => {
const textToCopy = "https://bloghubcom.netlify.app/"

const CopyButton = () =>  {
 
 navigator.clipboard.writeText(textToCopy)
 toast.success("Text copied")
}
  return (
    <div style={{backgroundColor: 'black', fontFamily: 'Rosehot'}} className='h-[100vh] text-white'>
          <Link to='/'><FaArrowLeft className='relative top-5'/></Link>
        <div style={{fontFamily: 'Rosehot'}} className='grid justify-center'>
          <div className='font-bold text-2xl'>Refer friends and earn</div>
          <div className='font-bold flex items-center gap-2 text-2xl px-4'>A verified Badge<MdVerified className='text-2xl text-blue-600'/></div>
          </div>
        <div className='flex justify-center'><FaHands className='text-[100px] text-blue-600'/></div>
   {/* Link */}
    <div className='flex items-center gap-4 mt-5 justify-center'>
<div className='text-white font-bold border-b-2'>{textToCopy}</div>
    <button onClick={CopyButton} style={{backgroundColor: 'white'}} className='text-black font-bold p-1 w-15 flex justify-center rounded-2xl'>Copy</button>
    </div>
    {/* Rules */}
    <div className='mt-20'>
<div className='text-xl font-bold  flex justify-center mb-10 items-center gap-2'><PiNumberCircleOneBold className='text-5xl text-pink-700'/>Send an invite to a friend</div>
<div className='text-xl font-bold flex justify-center mb-10 items-center gap-2'><PiNumberCircleTwoBold className='text-5xl text-pink-700'/>Your friend Signs up and <br/>Login.</div>
<div className='text-xl font-bold flex justify-center mb-10 items-center gap-2'><PiNumberCircleThreeBold className='text-5xl text-pink-700'/>You'll both receive your<br/>Verified Bagde when ur<br/>Friend make a Post.<br/></div>
<div></div>
    </div>
    {/* Footer */}
    <div className='flex items-center gap-3 justify-center'>
      <div className='font-bold'>For more Information</div>
      <button style={{backgroundColor: 'white'}} className='text-black font-extrabold p-1 rounded-2xl'>Contact-Us</button>
    </div>
    </div>
  )
}

export default Invite