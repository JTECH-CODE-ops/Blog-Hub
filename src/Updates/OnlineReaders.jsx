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