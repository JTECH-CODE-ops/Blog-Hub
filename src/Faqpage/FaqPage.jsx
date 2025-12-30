import './Faq.scss'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { RiTelegram2Line } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
import { useState } from 'react'
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";


const BlogList = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen1, setIsOpen1] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [isOpen3, setIsOpen3] = useState(false)
    const [isOpen4, setIsOpen4] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }
    const toggleDropdown1 = () => {
        setIsOpen1(!isOpen1)
    }
    const toggleDropdown2 = () => {
        setIsOpen2(!isOpen2)
    }
    const toggleDropdown3 = () => {
        setIsOpen3(!isOpen3)
    }
    const toggleDropdown4 = () => {
        setIsOpen4(!isOpen4)
    }
    return (
        <div>
            {/* Top header */}
            <Link to='/'><FaArrowLeft/></Link>
            <div className='grid justify-center'>
                <div className='px-27 text-[12px]'>Faq</div>
                <div className='text-xl font-bold'>Frequently asked questions</div>
                <div className='text-[10px] px-5'>Thousand questions, we will give you the answers</div>
            </div>
            {/* Body */}
            <div className='grid justify-center FaqMain mt-5'>
                <div className='grid h-[70vh]'>
                    <div className='text-[14px] font-bold rounded-[12px] mb-5 dropDown pl-4 pr-4'>What is Bloghub and how can it help me? <div className='cursor-pointer' onClick={toggleDropdown}>{isOpen ? <IoIosArrowDropup className='text-xl'/> : <IoIosArrowDropdown className='text-xl'/>}</div>
                        <div className={`py-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className='font-light'>
                        <li>Blog-Hub is a online social media article <br/>Posting platform to connect people Globally it is still in it t Phase</li>
                        </ul>
                </div>
                    </div>
                    <div className='text-[14px] font-bold rounded-[12px] mb-5 dropDown pl-4 pr-4'>What Support do we offer with your platform <div className='cursor-pointer' onClick={toggleDropdown1}>{isOpen1 ? <IoIosArrowDropup className='text-xl'/> : <IoIosArrowDropdown className='text-xl'/>}</div>
                        <div className={`py-4 ${isOpen1 ? 'block' : 'hidden'}`}>
                    <ul className='font-light'>
                        <li>Blog-Hub offers visibility, <br/>Blog-Hub makes you filled welcomed</li>
                        </ul>
                </div>
                    </div>
                    <div className='text-[14px] font-bold rounded-[12px] mb-5 dropDown pl-4 pr-4'>How Do i start using Blog-Hub <div className='cursor-pointer' onClick={toggleDropdown2}>{isOpen2 ? <IoIosArrowDropup className='text-xl'/> : <IoIosArrowDropdown className='text-xl'/>}</div>
                        <div className={`py-4 ${isOpen2 ? 'block' : 'hidden'}`}>
                    <ul className='font-light'>
                        <li>Blog-Hub is a online social media article <br/>Posting platform to connect people Globally it is still in it testing Phase</li>
                        </ul>
                </div>
                    </div>
                    <div className='text-[14px] font-bold rounded-[12px] mb-5 dropDown pl-4 pr-4'>Can i Connect with people in Blog-Hub <div className='cursor-pointer' onClick={toggleDropdown3}>{isOpen3 ? <IoIosArrowDropup className='text-xl'/> : <IoIosArrowDropdown className='text-xl'/>}</div>
                        <div className={`py-4 ${isOpen3 ? 'block' : 'hidden'}`}>
                    <ul className='font-light'>
                        <li>Yes you can, and its very easy to do <br/>ALways make sure to post and be initiative</li>
                        </ul>
                </div>
                    </div>
                    <div className='text-[14px] font-bold rounded-[12px] mb-5 dropDown pl-4 pr-4'>Can i post Any Content on Blog Hub <div className='cursor-pointer' onClick={toggleDropdown4}>{isOpen4 ? <IoIosArrowDropup className='text-xl'/> : <IoIosArrowDropdown className='text-xl'/>}</div>
                        <div className={`py-4 ${isOpen4 ? 'block' : 'hidden'}`}>
                    <ul className='font-light'>
                        <li>Yes you can if your content is text,video or photo <br/>Blog-Hub will alow it, and always remember to post Good Content</li>
                        </ul>
                </div>
                    </div>
                    <div className='text-[14px] flex font-bold rounded-[12px] relative top-10 mb-5 dropDown1 pl-4 pr-4'>
                        <div>
                        <div className='py-2'>Still have a question?</div>
                        <div className='text-[10px] font-light'>Can't find the answer to your question?<br/> Send us an email and we will get back<br/> to you as soon as possible.</div>
                    </div>
                   <Link to='/Contact'><div className='ml-8 mt-10'><button className='conFaq p-2 rounded-full'>Contact Us</button></div></Link> 
                    </div>
                    {/* Social media Link */}
                    <div className='mt-15 flex justify-center'>
                        <div className='conFaq1 p-2 rounded-[12px] flex gap-4'>
                        <a href='https://chat.whatsapp.com/C9HH4eOiUpmBtbWKCwcuik?mode=wwt'><FaWhatsapp className='text-xl'/></a>
                        <a href='https://www.facebook.com/61580530344079/posts/pfbid0ewPQf1uS9iA5cwPhmTXeyvCscyiBhzsYbLRoq2PUMrS93VhSvRBFNHyA448cWqqXl/?app=fbl'><FaFacebookF className='text-xl'/></a>
                        <a href='https://www.instagram.com/jtechoding?igsh=MTc4ZHpweGhmbDk5ZA=='><FaInstagram className='text-xl'/></a>
                        <a href='https://t.me/CryptoAirdropsToi'><RiTelegram2Line className='text-xl'/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BlogList
