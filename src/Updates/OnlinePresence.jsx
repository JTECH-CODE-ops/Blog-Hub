import React from 'react'
import useAuthorPresence from '../Updates/AuthorPresence';
import { GoDotFill } from "react-icons/go";
import { RiNavigationLine } from "react-icons/ri";
import '../Home/Home.scss'
import { Link } from 'react-router-dom';

const OnlinePresence = () => {
 const { onlineUsers, users} = useAuthorPresence()   

  return (
    <div>
        <h3 className=''>Online Users <Link to='/'><RiNavigationLine className='relative -top-6 text-blue-700'/></Link></h3>
         <ul className='Online relative top-[10rem] Online'>
          {onlineUsers.map((u) => (
            <li key={u.user_id} className='flex items-center gap-4 mb-4'>
                <img src={u.avatar_url} className='w-10 h-10 rounded-full border-2 border-amber-300' />
              {u.user_id === users.id ? "You" : u.user_name}<GoDotFill className='text-green-600'/>Online
            </li>
          ))}
         </ul>
    </div>
  )
}

export default OnlinePresence