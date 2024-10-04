import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addBooking, updateBooking, getProperties, getGuests } from '../utils/firestore'

interface AddBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBooking: () => void
  editingBooking: any | null
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose, onAddBooking, editingBooking }) => {
  const { user } = useAuth()
  const [booking, setBooking] = useState({
    guestId: '',
    propertyId: '',
    checkIn: '',
    checkOut: '',
    additionalInfo: '',
  })
  const [properties, setProperties] = useState<any[]>([])
  const [guests, setGuests] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchPropertiesAndGuests()
    }
  }, [user])

  useEffect(() => {
    if (editingBooking) {
      setBooking(editingBooking)
    } else {
      setBooking({
        guestId: '',
        propertyId: '',
        checkIn: '',
        checkOut: '',
        additionalInfo: '',
      })
    }
  }, [editingBooking])

  const fetchPropertiesAndGuests = async () => {
    if (user) {
      try {
        const fetchedProperties = await getProperties(user.uid)
        const fetchedGuests = await getGuests(user.uid)
        setProperties(fetchedProperties)
        setGuests(fetchedGuests)
      } catch (error) {
        console.error('Error fetching properties and guests:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      try {
        const bookingData = {
          ...booking,
          guestName: guests.find(g => g.id === booking.guestId)?.name,
          property: properties.find(p => p.id === booking.propertyId)?.name,
        }
        if (editingBooking) {
          await updateBooking(editingBooking.id, bookingData)
        } else {
          await addBooking(user.uid, bookingData)
        }
        onAddBooking()
        onClose()
      } catch (error) {
        console.error('Error adding/updating booking:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Guest</label>
            <select
              value={booking.guestId}
              onChange={(e) => setBooking({ ...booking, guestId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a guest</option>
              {guests.map((guest) => (
                <option key={guest.id} value={guest.id}>{guest.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              value={booking.propertyId}
              onChange={(e) => setBooking({ ...booking, propertyId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <input
              type="date"
              value={booking.checkIn}
              onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <input
              type="date"
              value={booking.checkOut}
              onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
            <textarea
              value={booking.additionalInfo}
              onChange={(e) => setBooking({ ...booking, additionalInfo: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
              {editingBooking ? 'Update' : 'Add'} Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookingModal