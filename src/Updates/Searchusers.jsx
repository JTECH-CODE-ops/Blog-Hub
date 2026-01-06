import React, { useState } from 'react'
import supabase from '../supabaseClient';
import { FaArrowLeft } from "react-icons/fa6";
import './Design.scss'
import { IoSearchCircleSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';

const Searchusers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUser] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try{
          const { data, error } = await supabase
          .from('profiles')
          .select('id, user_name, avatar_url')
          .textSearch('user_name', searchTerm)

          if (error) {
            setError('Check your network connection!')
            setUser([]);
          }else{
            console.log('User-Data', data)
            setUser(data)
            setError(null);
          }
        }catch (error) {
            setError(error.message)
            setUser([])
        }
    }
    const allSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try{
          const { data, error } = await supabase
          .from('profiles')
          .select('id, user_name, avatar_url, Number, Badge, profile')

          if (error) {
            setError('Check your network connection!')
            setUser([]);
          }else{
            console.log('User-Data', data)
            setUser(data)
            setError(null);
          }
        }catch (error) {
            setError(error.message)
            setUser([])
        }
    }
  return (
    <div className='uSearch'>
        {/* Top Header */}
        <div>
        <Link to='/'><FaArrowLeft className='mb-3'/></Link>
        <div className='flex relative left-7 justify-center'>
            <form onSubmit={handleSearch}>
            <input 
            onClick={allSearch}
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); allSearch(e)}}
            type='text' 
            className='outline-0 rounded-[20px] h-10 px-2 w-100 max-md:w-75 border-2'
            placeholder='Search for Users'
            />
           <button className='relative right-11 top-[19px]' type='submit'><IoSearchCircleSharp className='text-5xl'/></button>
        </form>
        </div>
        </div>
        {/* Search Term */}
        <div className='mt-2'>
            {error && (
                <div className='font-bold text-red-600'>{error}</div>
            )}
        </div>
        <div>
            {users.length == 0 && searchTerm.trim() !== '' && (
                <div>User not found</div>
            )}
            <ul className='gap-10 grid justify-center'>
                {users.map((user) => (
                    <li style={{backgroundColor: 'ghostwhite'}} className='w-[100vw] px-1 ml-6 text-black h-30 rounded-[12px]' key={user.id}>
                        <div className='flex gap-4 mt-4 items-center'>
                            <div>
                                <img src={user.avatar_url} className='w-15 h-15 rounded-full'/>
                                </div>
                           <div className='font-semibold'><div className='text-xl flex gap-2 items-center font-bold'>{user.user_name}{user.Badge ? (<div><MdVerified className="text-blue-600 text-xl"/></div>) : (<div></div>)}<div></div></div> 
                           {user.Number}
                           <div>{user.profile}</div>
                           </div>
                            </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Searchusers