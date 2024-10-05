'use client'

import React, { useState, useEffect } from 'react'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getProperties } from '../utils/firestore'
import { useAuth } from '../contexts/AuthContext'

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment)

interface CalendarProps {
  bookings: Array<{
    id: string
    guestName: string
    propertyId: string
    checkIn: string
    checkOut: string
    contract?: string
  }>
}

const Calendar: React.FC<CalendarProps> = ({ bookings }) => {
  const { user } = useAuth()
  const [properties, setProperties] = useState<any[]>([])
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState(Views.MONTH)

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    if (user) {
      const fetchedProperties = await getProperties(user.uid)
      setProperties(fetchedProperties)
    }
  }

  const events = bookings.map(booking => {
    const property = properties.find(p => p.id === booking.propertyId)
    return {
      id: booking.id,
      title: `${booking.guestName} - ${property ? property.name : 'Unknown Property'}`,
      start: new Date(booking.checkIn),
      end: new Date(booking.checkOut),
      color: property ? property.color : '#000000',
    }
  })

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: '5px',
      color: 'white',
      border: 'none',
      display: 'block',
    }
    return { style }
  }

  const onNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const onView = (newView: string) => {
    setView(newView as Views)
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
        eventPropGetter={eventStyleGetter}
        date={date}
        onNavigate={onNavigate}
        view={view}
        onView={onView}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
      />
    </div>
  )
}

export default Calendar