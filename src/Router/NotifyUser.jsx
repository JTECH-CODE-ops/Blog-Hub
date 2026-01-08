import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import { BiSolidBellRing } from "react-icons/bi";
import { IoCheckmarkDoneSharp, IoNotifications } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from 'react-toastify';
import { ImSpinner6 } from 'react-icons/im';
import { LuCheck, LuCheckCheck } from 'react-icons/lu';

const NotifyUser = () => {
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
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

    const deleteNotifications = async () => {
    const confirmDelete = confirm('Are you sure you want to Delete Your Read Notifications?');
      if(confirmDelete) {
        const toastId = toast.loading('Deleting notifications.....')
      try{
        const { error} = await supabase
      .from("notifications")
      .delete()
      .eq("read", true)
      setLoading(true)
      
      if(error) {
        toast.update(toast, {render: 'Failed to Delete, Check your Network', type: 'error', isLoading: false, autoClose: 3000 })
        console.error('The:', error)
      }else{
         toast.update(toastId, { render: 'Notification deleted', type: 'success', isLoading: false, autoClose: 3000 });
      }
      }catch (error) {
        console.error('ANOTHER ERROR', error)
        toast.error('TRY AGAIN')
      }
    }
    }

  return (
    <div className='Notifications'>
      <div className='grid'>
        <h1 className='Notify'><Link to='/'><p className='relative top-5 text-2xl text-black'><FaArrowLeft /></p></Link>Notifications</h1>
        <p className='font-bold'>You have ({notifications.length}) notifications </p>
        <div className='flex justify-end gap-5'>
        <p className='relative bottom-6 justify-end text-red-600 text-2xl' onClick={() => deleteNotifications()}>{loading ? <RiDeleteBin6Line/> : <RiDeleteBin6Line/>}</p>
        <p className='relative bottom-6 justify-end text-blue-600 text-2xl'><IoNotifications/></p>
        </div>
        
        </div>
    <div className='read'>
      <h1 className='mb-2 text-black gap-2 flex items-center'>Unread Notifications ({unreadNotifications.length}) <LuCheck /></h1>
      {notifications.length === 0 ? (
        
        <div className='grid justify-center mt-20'>
                    <div className='h-50 w-80 rounded-[12px] grid justify-center' style={{backgroundColor:'whitesmoke'}}>
                      <div className='mt-20 grid justify-center'><ImSpinner6 className='text-4xl animate-spin text-blue-500'/></div>
                    <div style={{fontFamily:'Rosehot'}} className='font-semibold'>Loading Notifications ...</div>
                    </div>
                  </div>
      ) : ( 
          unreadNotifications.map((notify) => (
        <div className='flex items-center gap-[10px] mb-5' key={notify.id} >
          <div className='w-[2.8rem]'><img src={notify.profiles?.avatar_url} className='w-[2.5rem] h-[2.5rem] rounded-full' /></div>
          <p onClick={() => markAsRead(notify.id)} className='text-2xl commenT'><b className=''>{notify.user_id === notify.recipient_id ? 'You' : notify.profiles.user_name}</b> {notify.type} on Your Post <p className='text-green-500 flex'>Posted {new Date(notify.created_at).toLocaleString()}<GoDotFill className='text-blue-600'/></p><h2 className=''>{shrink(notify.message)}</h2></p>
        {/* <p className='text-green-500 flex-none'>{new Date(notify.created_at).toLocaleString()}</p> */}
        </div>
      )))}
    </div>
    <div className='read'>
      <h1 className='flex items-center text-black gap-2'>Read Notifications ({readNotifications.length}) <LuCheckCheck /></h1>
      {notifications.length === 0 ? (
        <p></p>
      ) : ( 
          readNotifications.map((notify) => (
        <div className='flex items-center gap-[10px] mb-5' key={notify.id} >
          <div className='w-[2.8rem]'><img src={notify.profiles?.avatar_url} className='w-[2.5rem] h-[2.5rem] rounded-full' /></div>
          <p onClick={() => markAsRead(notify.id)} className='text-2xl commenT'><b className=''>{notify.user_id === notify.recipient_id ? 'You' : notify.profiles.user_name}</b> {notify.type} on Your Post <p className='text-green-500'>Posted {new Date(notify.created_at).toLocaleString()}</p></p>
          
        </div>
      )))}
    </div>
    </div>
  )
}

export default NotifyUser