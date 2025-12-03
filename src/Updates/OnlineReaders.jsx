// import React, { useEffect, useState } from 'react'

// import supabase from '../supabaseClient';

// const usePresence = ({userId}) => {
//     const [presence, setPresence] = useState(null);
//     // const [users, setUsers] = useState(null);
    
//     //     useEffect(() => {
//     //         const loadUser = async () => {
//     //             const {data} = await supabase.auth.getUser();
//     //             setUsers(data.user)
//     //         };
//     //         loadUser();
//     //     }, []);

//     useEffect(() => {
//         // if(!users) return;
//         const presenceChannel = supabase.channel('global', {
//             config:{
//                 presence: { key: 'user_id'},
//             },
//         })

//          presenceChannel.subscribe((status) => {
//             if (status === 'SUBSCRIBED') {
//                 presenceChannel.track({
//                     user_id: userId,
//                     online: true,
//                 });
//             }
//          })

//           presenceChannel.on('presence', {event: 'sync'}, () => {
//             // const userId = supabase.auth.getUser().id
//             const presenceState = presenceChannel.presenceState();
//             console.log('HELLO', presenceState)
//             const userPresence = Object.values(presenceState).find((p) => p[0].user_id === userId)
//             setPresence(userPresence ? userPresence[0] : null);
            
//         });

//         document.addEventListener('visibilitychange', () => {
//             // const userId = supabase.auth.getUser().id
//             if(document.hidden ) {
//             presenceChannel.track({
//             online: false,
//             user_id: userId,
//         })
//         }else{
//             presenceChannel.track({
//             online: true,
//             user_id: userId,
//         })
//         }
//         })

//     }, [userId])
//   return presence
// }

// export default usePresence

import React, { useEffect } from 'react'
import { useState } from 'react'
import supabase from '../supabaseClient';

const useOnlineReaders = (postId, uset) => {
    const [readers, setReaders] = useState([]);

    useEffect(() => {
        if(!postId || !uset) return;

        const channel = supabase.channel(`post:${postId}`, {
            config: { presence: { key: uset}}
        });

        channel.on('presence', { event:"sync"}, () => {
            const state = channel.presenceState();
            const users = Object.keys(state);
            setReaders(users);
        })
        .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                await channel.track({ viewing: postId});
            }
        });
        return () => supabase.removeChannel(channel);
    }, [postId, uset])
  return readers
}

export default useOnlineReaders