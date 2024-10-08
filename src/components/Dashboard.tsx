'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '../contexts/AuthContext'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Header from './Header'
import { getProperties } from '../utils/firestore'

const Overview = dynamic(() => import('./Overview'), { ssr: false })
const Properties = dynamic(() => import('./Properties'), { ssr: false })
const Guests = dynamic(() => import('./Guests'), { ssr: false })
const Calendar = dynamic(() => import('./Calendar'), { ssr: false })
const Bookings = dynamic(() => import('./Bookings'), { ssr: false })

interface Booking {
  id: number
  title: string
  start: Date
  end: Date
  property: string
}

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview')
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [showSignUp, setShowSignUp] = useState(false)
  const [guests, setGuests] = useState<any[]>([])

  useEffect(() => {
    console.log('Dashboard component mounted');
    // Fetch bookings data here
    // This is a mock implementation. Replace with actual API call.
    const mockBookings: Booking[] = [
      {
        id: 1,
        title: 'Booking 1',
        start: new Date(2023, 8, 15),
        end: new Date(2023, 8, 20),
        property: 'Lakeside Retreat'
      },
      {
        id: 2,
        title: 'Booking 2',
        start: new Date(2023, 8, 18),
        end: new Date(2023, 8, 25),
        property: 'Mountain View Cabin'
      },
      {
        id: 3,
        title: 'Booking 3',
        start: new Date(2023, 8, 22),
        end: new Date(2023, 8, 24),
        property: 'Downtown Loft'
      }
    ]
    setBookings(mockBookings)
  }, [])

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    if (user) {
      try {
        const fetchedProperties = await getProperties(user.uid)
        setProperties(fetchedProperties)
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Welcome to Rental Manager Dashboard
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card-bg py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {showSignUp ? <SignUp /> : <SignIn />}
            <div className="mt-6">
              <button
                onClick={() => setShowSignUp(!showSignUp)}
                className="w-full text-center text-sm text-accent hover:text-accent-dark"
              >
                {showSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'properties' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('properties')}
            >
              Properties
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'guests' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('guests')}
            >
              Guests
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'calendar' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendar
            </button>
          </div>
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'properties' && <Properties properties={properties} setProperties={setProperties} />}
          {activeTab === 'guests' && <Guests guests={guests} setGuests={setGuests} />}
          {activeTab === 'bookings' && <Bookings bookings={bookings} setBookings={setBookings} />}
          {activeTab === 'calendar' && <Calendar bookings={bookings} properties={properties} />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard