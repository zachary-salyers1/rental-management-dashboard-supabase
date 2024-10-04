'use client'

import React, { useState } from 'react'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment)

interface CalendarProps {
  bookings: Array<{
    id: string
    guestName: string
    property: string
    checkIn: string
    checkOut: string
    contract?: string
  }>
}

const Calendar: React.FC<CalendarProps> = ({ bookings }) => {
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())

  const onNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const onView = (newView: any) => {
    setView(newView)
  }

  const events = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.guestName} - ${booking.property}`,
    start: new Date(booking.checkIn),
    end: new Date(booking.checkOut),
    contract: booking.contract,
  }))

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.contract ? '#4CAF50' : '#2196F3',
      borderRadius: '5px',
      color: 'white',
      border: 'none',
      display: 'block',
    }
    return { style }
  }

  return (
    <div className="h-[600px]"> {/* Adjust the height as needed */}
      <h2 className="text-xl font-semibold mb-4">Booking Calendar</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        onView={onView}
        date={date}
        onNavigate={onNavigate}
        toolbar={true}
        views={['month', 'week', 'day']}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  )
}

export default Calendar