import React, { useState } from 'react'
import { IoMail } from "react-icons/io5";

const Documentation = () => {
   const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "18311ffe-0f8a-4db7-a079-146d7f17aa53");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data.success ? "Email Suscribed, Success!" : "Check Your Network");
  };

  
  return (
    <div className='mt-5 Contact max-md:mt-25 flex place-content-center'>
      <div className='Contact1'>
      <div className='flex mail text-white mb-5 mt-3 place-content-center'><IoMail/></div>
       <div className='flex text-white font-bold place-content-center'>Get in touch</div>
   <form onSubmit={onSubmit} className='mt-4 text-white'>
    <label className='ml-5'>Name</label><br/>
    <input required type='text' name='email' placeholder='Your name' className='ml-5 md:ml-7 mb-5 mt-4 outline-0 h-10 rounded-[8px] border-2 w-[24rem]'/>
    <label className='ml-5'>Email</label><br/>
    <input required type='email' name='email' placeholder='Your email' className='ml-5 md:ml-7 mb-5 mt-4 outline-0 h-10 rounded-[8px] border-2 w-[24rem]'/>
    <label className='ml-5'>Phone No.</label><br/>
    <input required type='number' name='email' placeholder='Phone number' className='ml-5 md:ml-7 mb-5 mt-4 outline-0 h-10 rounded-[8px] border-2 w-[24rem]'/>
    <label className='ml-5'>Message</label><br/>
    <textarea required type='text' name='email' placeholder='Please tell us how we can help you' className='ml-5 md:ml-7 mb-5 mt-4 outline-0 h-25 rounded-[8px] border-0 w-[24rem]'/>
   <button type='submit' className='ml-4 md:ml-7 rounded-[8px] h-7 w-[24rem]'>Send</button>
   <p className='text-green-500 font-extrabold mt-8 ml-24 animate-bounce'>{result}</p>
   </form>
   </div>
    </div>
   
  )
}

export default Documentation