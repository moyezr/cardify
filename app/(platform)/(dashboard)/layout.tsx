import React from 'react'
import Navbar from './_components/navbar'

const DashboardLayout = ({  children}: {  children: React.ReactNode}) => {
  return (
    <div className='h-fullfirst-letter:'>
        <Navbar />
        {children}</div>
  )
}

export default DashboardLayout