import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { LiaComments } from "react-icons/lia";
import { FaArrowLeft } from "react-icons/fa6";
import '../Router/Design.scss'
import { useParams, Link } from 'react-router-dom';
import { BsFillSendFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import { MdVerified } from "react-icons/md";
import useOnlineReaders from '../Updates/OnlineReaders';


const VideoComment = () => {
  const { postId } = useParams();
  
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)

  const readers = useOnlineReaders(postId, users);
  useEffect(() => {
    const fetchComments = async () => {
      const { data: commentsData, error } = await supabase.from('Comments')
        .select(`*, profiles (id, user_name, avatar_url, Badge)`)
        .eq('post_id', parseInt(postId))
        .order('created_at', { ascending: false });
      // const commentWithUsers = await Promise.all(commentsData.map(async (comment) => {
      //   const { data: userData } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', comment.user_id)
      //   .single();
      //   return {...comment, user: userData }
      // }))
      if (error) {
        console.error('Failed', error);
      }
      else {
        console.log(commentsData)
        setComments(commentsData || []);
      }

    };

    fetchComments()

  }, [postId]);

  useEffect(() => {
    const channel = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'Comments',
        filter: `post_id=eq.${postId}`,
      },
        async (payload) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.user_id)
            .single()
          const newCommentWithUser = { ...payload.new, profiles: userData };
          setComments((prev) => [
            newCommentWithUser, ...prev]);

        }
      )
      .subscribe((status) => {
        setSubscriptionStatus(status)
        console.log(status)
      });

    return () => {
      supabase.removeChannel(channel)

    }

  }, [postId]);

  useEffect(() => {

    if (!postId) {
      console.warn("postId is not defined, skipping data fetches.");
      return;
    }

    const fetchPost = async () => {
      const { data, error } = await supabase.from('blog_post').select(

      ).eq('id', postId);
      if (error) {
        console.error(error)
      }

      else {
        setPost(data[0]);
        console.log(data)
      }
    };

    const fetchUser = async () => {
      try {


        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(error)
        } else {
          console.log(data)
          setUsers(data.data || data.user);
        }

      } catch (error) {
        console.error(error)
      }
    }
    fetchPost();
    fetchUser();
  }, [postId]);



  const handleCommentSubmit = async (e) => {
    e.preventDefault();


    const toastId = toast.loading('Posting your comment...')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: commentData, error } = await supabase.from('Comments')
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            comment_text: newComment,
          },
        ])
        .select();
      if (error) {
        console.error(error);
        toast.error('Failed to post comment')
        setLoading(false)
      }
      else {
        toast.update(toastId, { render: 'Comment Posted!', type: 'success', isLoading: false, autoClose: 3000 });
        setLoading(false)
        setComments((prevComments) => [...prevComments]);
        console.log(commentData, newComment)
        const { data: post, error: postError } = await supabase
          .from('blog_post')
          .select('user_id')
          .eq('id', postId)
          .single();

        if (postError) {
          console.log(postError)
          setLoading(false)
        } else {
          const recipientId = post.user_id;
          const { data: notificationData, error: notificationError } = await supabase
            .from('notifications')
            .insert([
              {
                post_id: postId,
                user_id: user.id,
                type: 'commented',
                comment_id: commentData[0].id,
                recipient_id: recipientId,
                message: newComment,
                read: false,
              },
            ]);

          if (notificationError) {
            console.error(notificationError)
          } else {
            console.log(notificationData)
          }
        }
      }
    } catch (error) {
      console.error(error)
      toast.update(toastId, { render: 'Failed to post comment', type: 'error', isLoading: false, autoClose: 3000 });
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value; // Remove existing spaces
    const spaceValue = value.replace(/(\S{15})(?=\S)/g, '$1 '); // Add space after every 5 characters
    setNewComment(spaceValue)
  }

  return (
    <div>
      <div className=''>
        <Link to='/Videos'><p className='mb-7 relative text-2xl text-black'><FaArrowLeft /></p></Link>
      </div>
      {post && (
        <div className='PostContent'>
          <div className='PostContent1'>
            <h2>{post.video_title}</h2>
            <video controls autoPlay src={post.video_url} />
          </div>
          {readers.length} Person is Reading This
        </div>
      )}
      <div className='AllComments'>
        <div className='HeadComment'>
          {subscriptionStatus === 'SUBSCRIBED' ? (
            <p className='text-5xl text-amber-400'></p>
          ) : (
            <p className='text-5xl text-amber-300'></p>
          )}
          <h1>All Comments</h1>
        </div>
        <div className='Test'>
          {comments.length === 0 ? (
            <div className='grid justify-center text-white mt-20'>
              <div className='grid justify-center'><LiaComments className='text-6xl'/></div>
              <div className='grid justify-center'>No comments yet</div>
              <div>Be the first to comment</div>
            </div>

          ) : (comments.map((comment) => (
            <div className='DisplayComments' key={comment.id}>
              <div className='userCred'>
                <img src={comment.profiles?.avatar_url} />
                <Link to={`/profile/${comment.user_id}`}><p className='flex items-center gap-17'>{comment.profiles?.user_name}{comment.profiles.Badge ? (<p><MdVerified className="text-blue-600 text-xl md:left-4 max-md:right-13 relative"/></p>) : (<span></span>)}</p></Link>
              </div>
              <div className='comment'>
                <p className=''>{comment.comment_text}</p>
              </div>
            </div>
          )))}
        </div>
        <div className='InputComment'>
          {users &&
            <img src={users.user_metadata.avatar_url} />}
          <form onSubmit={handleCommentSubmit}>
            <input
              type='text'
              placeholder='Write a Comment'
              value={newComment}
              onChange={(e) => {setNewComment(e.target.value);
                handleInputChange(e);
              }}
              className='CommentInput mt-4' />
            <button type="submit">{loading ? <BsFillSendFill className='ml-2 text-blue-700' /> : <BsFillSendFill className='ml-2 text-blue-700' />}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VideoComment