import './Faq.scss'
import Img from '../Images/4de26bb962a47b9d5c2e76d30544ddc1.jpg'
import { Link } from 'react-router-dom'
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import Telegram from '../Assets/20359662fcd835fa8637bdee18ad6697.jpg'
import Whatsapp from '../Assets/93b265c795140247db600ac92e58746a (1).jpg'
import Facebook from '../Assets/5bb0f73a7b3e0f976acad614a42e5040.jpg'
import Instagram from '../Assets/Reactimg.jpg'

const BlogList = () => {
    return (
        <div className='Faq'>
            <div className="flex justify-center">
                <div className=''>
                    <Link to='/'><p className='mb-7 relative -left-30 text-2xl text-white'><FaRegArrowAltCircleLeft /></p></Link>
                </div>
                <h1 className="Top font-bold text-white text-2xl">Welcome To <p className="text-amber-300 Bloghub font-semibold font-serif">Bloghub</p></h1>
            </div>
            <div className='flex justify-center mt-3'>
                <img src={Img} className='w-[25rem] rounded-[8px]' />
            </div>
            <div className='flex justify-center mt-5'>
                <h1 className='text-3xl text-amber-400'>Have Any QuestionTo ASk ? </h1>
            </div>
            <div className='mt-4 gap Questions'>
                <div><p1 className='text-white text-2xl capitalize'>How to Create An Account ? just click <Link className='text-amber-300' to='/register'>Signup</Link></p1><br /><br /></div>
                <div><p1 className='text-white text-2xl capitalize'>How to Login ? you can login in with google or <Link className='text-amber-300' to='/login'>Login</Link></p1><br /><br /></div>
                <div><p1 className='text-white text-2xl capitalize'>You can also search for other users  <Link to='/Online-Users'>Search</Link></p1></div>
            </div>
            <div className='mb-5 flex justify-center'>
                <Link to='/Contact'><p className='text-white Send'>Send Us A Message</p></Link>
            </div>


            <div className='Faq1 mt-5 text-white'>
                <div className='flex justify-center'>
                    <p className='text-blue-700'>Contact us at Our Socia Media Platform</p>
                </div>
                <div className='mt-15 flex gap-[3rem] justify-center'>
                    <a href='https://t.me/CryptoAirdropsToi'><img src={Telegram} className='w-12 rounded-full' /></a>
                    <a href='https://chat.whatsapp.com/C9HH4eOiUpmBtbWKCwcuik?mode=wwt'><img src={Whatsapp} className='w-12 rounded-full' /></a>
                    <a href='https://www.facebook.com/61580530344079/posts/pfbid0ewPQf1uS9iA5cwPhmTXeyvCscyiBhzsYbLRoq2PUMrS93VhSvRBFNHyA448cWqqXl/?app=fbl'><img src={Facebook} className='w-12 rounded-full' /></a>
                    <a href='https://www.instagram.com/jtechoding?igsh=MTc4ZHpweGhmbDk5ZA=='><img src={Instagram} className='w-12 rounded-full' /></a>
                </div>
                <div className='mt-10 flex justify-center font-semibold text-amber-400'>
                    <h1 className='text-3xl'>Stay Updated With Us</h1>
                </div>
                {/* <div className='flex justify-center'>
                <form>
                 <input type='text' className=' text-white text-2xl mt-6 w-[22rem] p-2 rounded-[12px] border-2 outline-0 border-green-500' placeholder='Your Email Address'/>
                </form>
            </div> */}
            </div>
        </div>
    )

}

export default BlogList