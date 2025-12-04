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


