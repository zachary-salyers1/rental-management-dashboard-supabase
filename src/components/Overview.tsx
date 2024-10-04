'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getTotalProperties, getCurrentlyStayingGuests } from '../utils/firestore'

const Overview: React.FC = () => {
  const { user } = useAuth()
  const [totalProperties, setTotalProperties] = useState<number | null>(null)
  const [currentGuests, setCurrentGuests] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          console.log('Fetching overview data for user:', user.uid);
          const properties = await getTotalProperties(user.uid)
          setTotalProperties(properties)
          console.log('Total properties:', properties);

          const guests = await getCurrentlyStayingGuests(user.uid)
          setCurrentGuests(guests)
          console.log('Current guests:', guests);
          setError(null)
        } catch (error) {
          console.error('Error fetching overview data:', error)
          setError('Failed to fetch overview data. Please try again later.')
        }
      }
    }

    fetchData()
  }, [user])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Properties</h3>
        <p className="text-3xl font-bold">{totalProperties !== null ? totalProperties : 'Loading...'}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Current Guests</h3>
        <p className="text-3xl font-bold">{currentGuests !== null ? currentGuests : 'Loading...'}</p>
      </div>
      {/* Add more overview cards here as needed */}
    </div>
  )
}

export default Overview