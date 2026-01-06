import React, { useState } from 'react'

const ReadMoreToggle = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const wordLimit = 20;

    if(!text) return '';
    const words = text.split(' ');
    const isLongText = words.length > wordLimit;

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    }
  return (
    <div>{isLongText && !isExpanded ? (
        <div>
            {words.slice(0, wordLimit).join(' ')}...
            <button className='font-bold text-blue-600 px-2' onClick={toggleText}>Read more</button>
            </div>
    ) : (
        <div>
        {text}
        {isLongText && (
            <button className='font-bold text-blue-600 px-2' onClick={toggleText}>See less</button>
        )}
        </div>
     )}
    </div>
  )
};

export default ReadMoreToggle