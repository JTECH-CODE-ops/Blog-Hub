import React from 'react'
import useAuthorPresence from '../Updates/AuthorPresence';
import { GoDotFill } from "react-icons/go";
import { RiNavigationLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import '../Home/Home.scss'
import { Link } from 'react-router-dom';

const OnlinePresence = () => {
 const { onlineUsers, users} = useAuthorPresence()   

  return (
    <div>
      <div className='grid justify-center'><FaUsers className='text-3xl text-blue-600 mb-2'/></div>
        <h3 className='font-bold'>Online Users: {onlineUsers.length}<Link to='/'><RiNavigationLine className='relative -top-6 text-blue-700'/></Link></h3>
         <ul className='Online relative top-[10rem] Online'>
          {onlineUsers.map((u) => (
            <li style={{backgroundColor: 'wheat'}} key={u.user_id} className='w-[90vw] flex h-[15vh] rounded-[12px] px-2 items-center gap-4 mb-4'>
                <img src={u.avatar_url} className='w-10 h-10 rounded-full border-2 border-amber-300' />
              <div className='text-xl font-semibold'>{u.user_id === users.id ? "You" : u.user_name}<div className='font-bold text-green-400'>Active</div></div>
            </li>
          ))}
         </ul>
    </div>
  )
}

export default OnlinePresence
