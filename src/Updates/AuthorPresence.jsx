import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient';

const useAuthorPresence = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const {data} = await supabase.auth.getUser();
            setUsers(data.user)
        };
        loadUser();
    }, []);

    useEffect(() => {
        if(!users) return;

        const channel = supabase.channel("online-users", {
            config:{
                presence: { key: users.id},
            },
        });
        channel.on("presence", {event: 'sync'}, () => {
            const state = channel.presenceState()
            const onlineList = Object.values(state).flat();
            setOnlineUsers(onlineList);
        })
        .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                await channel.track({
                    online: true,
                    user_id: users.id,
                    avatar_url: users?.user_metadata?.avatar_url,
                    user_name: users?.user_metadata?.display_name,
                    online_at: new Date().toISOString(),
                });
            }
        });

        return () => supabase.removeChannel(channel);
    }, [users])

  return { onlineUsers, users }
}

export default useAuthorPresence