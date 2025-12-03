import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

const Callback = () => {
    const navigate = useNavigate()

    useEffect(() =>{
        supabase.auth.getSession().then(({data: {session}}) =>{
            if(session){
                navigate('/profile')
            } else {
                navigate('/login')
            }
        })
    }, [navigate])
    
    return <div>Authenticating.....</div>
 
}

export default Callback;