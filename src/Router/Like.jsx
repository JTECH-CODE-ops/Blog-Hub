// import { useState, useEffect } from 'react';
// import  supabase from '../supabaseClient';


// const Like = ({ postId, currentId }) => {
//   const [likesCount, setLikesCount] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
   

//   // Fetch likes count + whether user has liked
//   useEffect(() => {
    
//     if (!postId) return;

//     const fetchLikeData = async () => {
//       try {
//         // Count total likes for post
//         const { count, error: countError } = await supabase
//           .from('Likes')
//           .select('*', { count: 'exact' })
//           .eq('post_id', postId);

//         if (countError) throw countError;
//         setLikesCount(count || 0);

//         // Check if current user has liked it
//         if (currentId) {
//           const { data, error: likedError } = await supabase
//             .from('Likes')
//             .select('post_id')
//             .eq('post_id', Number(postId))
//             .eq('user_id', currentId)
//             .maybeSingle();

//           if (likedError) throw likedError;
//           setIsLiked(!!data);
//         }
//       } catch (err) {
//         console.error('[Like] fetch error:', err.message);
//       }
//     };
  
//     fetchLikeData();

//     // Realtime changes
//     const channel = supabase
//       .channel(`likes_${postId}`)
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'Likes', filter: `post_id=eq.${postId}` },
//         () => fetchLikeData() // refetch on any like/unlike
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [postId, currentId]);

//   // Toggle like/unlike
//   const toggleLike = async () => {
//     if (!currentId) {
//       alert('Sign in to like 😅');
//       return;
//     }

//     try {
//       if (isLiked) {
//         // Unlike
//         const { error } = await supabase
//           .from('Likes')
//           .delete()
//           .eq('post_id', Number(postId))
//           .eq('user_id', currentId);

//         if (error) throw error;
//         setLikesCount(prev => prev - 1);
//         setIsLiked(false);
//       } else {
//         // Like
//         const { error } = await supabase
//           .from('Likes')
//           .insert({ post_id: Number(postId), user_id: currentId });

//         if (error) throw error;
//         setLikesCount(prev => prev + 1);
//         setIsLiked(true);

//         // OPTIONAL: notify post author via Notifications table
//         // ...
//       }
//     } catch (err) {
//       console.error('[toggleLike] error:', err.message);
//       alert(`Failed to toggle like: ${err.message}`);
//     }
//   };

//   if (!postId) return null;

//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//       <button
//         onClick={toggleLike}
//         style={{ cursor: 'pointer', background: 'none', border: 'none' }}
//       >
//         {isLiked ? '❤️ Liked' : '🤍 Like'}
//       </button>
//       <span>{likesCount} likes</span>
//     </div>
//   );
// };

// export default Like;

import { useState, useEffect } from 'react';
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import supabase  from '../supabaseClient';
import { toast } from 'react-toastify';

const Like = ({ postId }) => {
  const [loading, setLoading] = useState(false)
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch logged in user (no useAuth needed)
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) setUser(data.user);
  };

  useEffect(() => {
    fetchUser(); // load user on component mount
  }, []);

  useEffect(() => {
    if (!postId) return;
    const numericPostId = Number(postId);

    // Fetch initial like data
    const fetchLikeData = async () => {
      try {
        // Count likes
        const { count, error: countError } = await supabase
          .from('Likes')
          .select('*', { count: 'exact' })
          .eq('post_id', numericPostId);

        if (countError) throw countError;
        setLikesCount(count || 0);

        // Check if this user has liked
        if (user) {
          const { data, error: likedError } = await supabase
            .from('Likes')
            .select('id')
            .eq('post_id', numericPostId)
            .eq('user_id', user.id)
            .maybeSingle();

          if (likedError) throw likedError;
          setIsLiked(!!data);
        }
      } catch (err) {
        console.error('[Like] fetch error:', err.message);
      }
    };

    fetchLikeData();

    // Realtime updates
    const channel = supabase
      .channel(`likes:${numericPostId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Likes',
          filter: `post_id=eq.${numericPostId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikesCount((prev) => prev + 1);
          }
          if (payload.eventType === 'DELETE') {
            setLikesCount((prev) => Math.max(prev - 1, 0));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [postId, user]);

  // Toggle like
  const toggleLike = async () => {
    const toastId = toast.loading('Liking Post ......')
    setLoading(true)
    if (!user) {
      alert('Sign in to like 😅');
      return;
    }

    const numericPostId = Number(postId);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('Likes')
          .delete()
          .eq('post_id', numericPostId)
          .eq('user_id', user.id);

        if (error) {
          toast.error('Failed to Unliked Post~')
          setLoading(false)
        }else{
          toast.update(toastId, { render: 'Unliked Post!', type: 'success', isLoading: false, autoClose: 3000 });
        }

        setIsLiked(false);
      } else {
        // Like
        const { error } = await supabase
          .from('Likes')
          .insert({
            post_id: numericPostId,
            user_id: user.id,
          });

          const { data: post, error: postError } = await supabase
      .from('blog_post')
      .select('user_id')
      .eq('id', postId)
      .single();

      if(postError) {
        toast.error('Failed to Liked Post!')
        setLoading(false)
        console.log(postError)
      }else {
        toast.update(toastId, { render: 'Liked!', type: 'success', isLoading: false, autoClose: 3000 });
        const recipientId = post.user_id;
        const { data: notificationData, error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            post_id: numericPostId,
            user_id: user.id,
            type: 'liked',
            recipient_id: recipientId,
            read: false,
          },
        ]);

        if(notificationError) {
          console.error(notificationError)
        }else {
          console.log(notificationData)
        }
      }

        if (error) throw error;

        setIsLiked(true);

      
      }
    } catch (err) {
       toast.update(toastId, { render: 'Failed to Liked Post', type: 'error', isLoading: false, autoClose: 3000 });
        setLoading(false)
      console.error('[toggleLike] error:', err.message);
    }

    
  };

  if (!postId) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        className='flex relative -top-1 gap-2'
        onClick={toggleLike}
        style={{ cursor: 'pointer', background: 'none', border: 'none' }}
      >
        {loading ? '' : ''}
        {isLiked ? <AiFillLike className='mt-1 text-blue-600'/> : <AiOutlineLike className='mt-1 text-18px'/>}
        <p>{likesCount} </p>
      </button>
      
    </div>
  );
};

export default Like;


