import React from 'react'
import EventBookPage from '../../components/EventBookingPage/EventBookingPage'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const EventBook = () => {
  return (
    <div>
      <Navbar/>
      <EventBookPage    />
      <Footer/>
    </div>
  )
}

export default EventBook
