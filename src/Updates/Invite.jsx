import React from 'react'
import { toast } from 'react-toastify';
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Logo from '../img/Invite_logo.jpg'

const Invite = () => {
const textToCopy = "https://bloghubcom.netlify.app/register"

const CopyButton = () =>  {
 
 navigator.clipboard.writeText(textToCopy)
 toast.success("Text copied")
}
  return (
//     <div style={{fontFamily: 'Rosehot'}} className='h-[110vh] text-black'>
//           <Link to='/'><FaArrowLeft className='relative top-5'/></Link>
//         <div style={{fontFamily: 'Rosehot'}} className='grid justify-center'>
//           <div className='font-bold text-2xl'>Refer friends and earn</div>
//           <div className='font-bold flex items-center gap-2 text-2xl px-4'>A verified Badge<MdVerified className='text-2xl text-blue-600'/></div>
//           </div>
//         <div className='flex justify-center'><FaHands className='text-[100px] text-blue-600'/></div>
//    {/* Link */}
//     <div className='flex items-center gap-4 mt-5 justify-center'>
// <input value={textToCopy} className='text-black font-bold otline-0 border-2 p-2' />
//     <button onClick={CopyButton} style={{backgroundColor: 'blue'}} className='text-white font-bold p-1 w-15 flex justify-center rounded-2xl'>Copy</button>
//     </div>
//     {/* Rules */}
//     <div className='mt-20'>
// <div className='grid justify-center font-extrabold text-xl'>Steps:</div>

//     </div>
//     {/* Footer */}
//     <div className='flex items-center gap-3 justify-center'>
//       <div className='font-bold'>For more Information</div>
//       <button style={{backgroundColor: 'black'}} className='text-white font-extrabold p-1 rounded-2xl'>Contact-Us</button>
//     </div>
//     </div>
<div style={{fontFamily: '  Rosehot'}}>
  {/* Top */}
  <div className='grid items-center'>
    <Link to='/'><div className='flex justify-start'><FaArrowLeft className='text-xl'/></div></Link>
  <div className='font-bold flex justify-center text-2xl'>Invite Friends</div>
  </div>
  {/* middle */}
  <div>
    <div className='grid justify-center'><img className='w-85 h-80' src={Logo}/></div>
    <div className='text-xl font-bold mt-5 grid justify-center'>Steps To Follow :</div>
    {/* Steps */}
    <div className='mt-5 grid gap-5'>
      <div className='flex items-center gap-2'><b>1.</b> Copy and Share the link below.</div>
      <div className='flex items-center gap-2'><b>2.</b> Your Friend Signs Up and make their first post.</div>
      <div className='flex items-center gap-2'><b>3.</b> Then he/she will Contact the Blog-Hub Admin.</div>
      <div className='flex items-center gap-2'><b>4.</b> Afterwards Both you and your friend will receive your reward.</div>
    </div>
  </div>
  {/* bottom */}
  <div className='mt-5 grid justify-center text-white font-bold'>
    <button onClick={CopyButton} style={{backgroundColor:'black'}} className='w-80 h-10 rounded-4xl'>Share Link</button>
  </div>
</div>
  )
}

export default Invite