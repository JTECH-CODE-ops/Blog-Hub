// import React from 'react'
// import usePresence from './OnlineReaders';


// const OnlineBadge = ({present}) => {
   
//     const presence = usePresence({userId: present})
//     console.log('Hi:',presence)
//     if(!presence) return null;
//   return (
//     <div>
//         {presence.online ? (<h4 className='text-black'>Online</h4> 
//         ) : (
//             <h4>Offline</h4>
//         )}
//     </div>
//   )
// }

// export default OnlineBadge

import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient';
import useOnlineReaders from './OnlineReaders';

const PostReaders = ({ postId }) => {
     const [user, setUser] = useState(null)
     useEffect(() => {
        const getUser = async () => {
      const { data: {user} } = await supabase.auth.getUser();
        setUser(user ?? null)
        
    };
    getUser()
     }, []);

     const readers = useOnlineReaders(postId, user?.id)
  return (
    <div>{readers.length} Person are reading This</div>
  )
}

export default PostReaders

