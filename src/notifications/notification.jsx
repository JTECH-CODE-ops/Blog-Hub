import React from 'react'
import {  ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import "react-toastify/dist/ReactToastify.css"

const notification = () => {
  return (
    <div>
        <ToastContainer />
        <Toaster position='top-center'/>
    </div>
  )
}

export default notification