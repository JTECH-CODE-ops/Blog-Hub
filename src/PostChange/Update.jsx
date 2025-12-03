import React from 'react'
import supabase from '../supabaseClient'
import { toast } from 'react-toastify';

const usedeletePost = () => {
    const deletePost = async (postId) => {
        try {
            const { data, error } = await supabase
                .from('blog_post')
                .delete()
                .eq('id', postId);

            if (error) {
                console.error('There is Error', error)
                toast.error('FAILED TO DELETE POST')
            } else {
                return console.log('SUCCESSFUL OPERATION', data)
            }
        } catch (error) {
            console.error(error)
        }
    }
    return { deletePost }
}

export default usedeletePost