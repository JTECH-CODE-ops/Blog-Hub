import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import { BiSolidBellRing } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import { Link } from 'react-router-dom';

const NotifyUser = () => {
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  const [readNotifications, setReadNotifications] = useState([])
  const [unreadNotifications, setUnReadNotifications] = useState([])

  useEffect(() => {
     const getUser = async () => {
    const { data: {user} } = await supabase.auth.getUser();
      setUser(user)
  };
   getUser();
  })


  const shrink = (content, maxLength = 20) => {
      if(!content) return "";


      return content?.slice(0, maxLength) + (content?.length > maxLength ? '........' : '');
    }

  const markAsRead = async (notificationId) => {
  const { error } = await supabase
  .from('notifications')
  .update({ read: true })
  .eq('id', notificationId);

  if (error) {
    console.error(error)
  }else {
    setNotifications((prev) => 
    prev.map((notif) => 
    notif.id === notificationId ? {...notif, read: true } : notif
    )
    );
    
  }
 }

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
      .from('notifications')
      .select(`*, profiles!user_id(user_name, avatar_url)`)
      .eq('recipient_id', user.id)
      .order('created_at', {ascending: false });

      if(error){
        console.error(error)
      }else{
        setNotifications(data)
      }
    };
 
    fetchNotifications()
  }, [user])

  useEffect(() => {
    if (notifications.length > 0) {
      const unread = notifications.filter((notification) => !notification.read);
      const read = notifications.filter((notification) => notification.read)
      setUnReadNotifications(unread);
      setReadNotifications(read);
   
    }
  }, [notifications])

  return (
    <div className='Notifications'>
      <div className='grid'>
        <h1 className='Notify'><Link to='/'><p className='relative top-5 text-2xl text-amber-400'><FaRegArrowAltCircleLeft /></p></Link>Notifications</h1>
        <p>You have ({notifications.length}) notifications </p>
        <div className='flex justify-end'>
        <p className='relative bottom-6 justify-end text-blue-600 text-2xl'><IoNotifications/></p>
        </div>
        
        </div>
    <div className='read'>
      <h1>Unread Notifications ({unreadNotifications.length})</h1>
      {notifications.length === 0 ? (
        <p className='noNotify'>You Have No Notification <BiSolidBellRing className='mt-2 text-blue-500 animate-bounce'/></p>
      ) : ( 
          unreadNotifications.map((notify) => (
        <div className='flex items-center gap-[10px] mb-5' key={notify.id} >
          <div className='w-[2.5rem]'><img src={notify.profiles?.avatar_url} className='w-[3rem] h-[2.5rem] rounded-full' /></div>
          <p onClick={() => markAsRead(notify.id)} className='text-2xl commenT'><b className='userNotify'>{notify.user_id === notify.recipient_id ? 'You' : notify.profiles.user_name}</b> {notify.type} on Your Post <p className='text-green-500'>Posted {new Date(notify.created_at).toLocaleString()}</p><h2 className=''>{shrink(notify.message)}</h2></p>
        {/* <p className='text-green-500 flex-none'>{new Date(notify.created_at).toLocaleString()}</p> */}
        </div>
      )))}
    </div>
    <div className='read'>
      <h1>Read Notifications ({readNotifications.length})</h1>
      {notifications.length === 0 ? (
        <p className='noNotify'>You Have No Notification <BiSolidBellRing className='mt-2 text-blue-500 animate-bounce'/></p>
      ) : ( 
          readNotifications.map((notify) => (
        <div className='flex items-center gap-[10px] mb-5' key={notify.id} >
          <div className='w-[2.5rem]'><img src={notify.profiles?.avatar_url} className='w-[3rem] h-[2.5rem] rounded-full' /></div>
          <p onClick={() => markAsRead(notify.id)} className='text-2xl commenT'><b className='userNotify'>{notify.user_id === notify.recipient_id ? 'You' : notify.profiles.user_name}</b> {notify.type} on Your Post <p className='text-green-500'>Posted {new Date(notify.created_at).toLocaleString()}</p></p>
          
        </div>
      )))}
    </div>
    </div>
  )
}

export default NotifyUser