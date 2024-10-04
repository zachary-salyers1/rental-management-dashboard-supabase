import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addBooking, updateBooking, getProperties, getGuests } from '../utils/firestore'
import { Booking } from '../types/booking'

interface AddBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBooking: () => void
  editingBooking: any | null
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose, onAddBooking, editingBooking }) => {
  const { user } = useAuth()
  const [booking, setBooking] = useState<Omit<Booking, 'id' | 'totalAmount'>>({
    guestId: '',
    propertyId: '',
    guestName: '',
    property: '',
    checkIn: '',
    checkOut: '',
    pricePerNight: 0,
    additionalInfo: '',
  })
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [guests, setGuests] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [totalNights, setTotalNights] = useState<number>(0)

  useEffect(() => {
    if (user) {
      fetchGuests()
      fetchProperties()
    }
  }, [user])

  useEffect(() => {
    if (editingBooking) {
      setBooking(editingBooking)
      calculateTotalAmount(editingBooking.checkIn, editingBooking.checkOut, editingBooking.pricePerNight)
    } else {
      setBooking({
        guestId: '',
        propertyId: '',
        guestName: '',
        property: '',
        checkIn: '',
        checkOut: '',
        pricePerNight: 0,
        additionalInfo: '',
      })
      setTotalAmount(0)
    }
  }, [editingBooking])

  const fetchGuests = async () => {
    if (user) {
      const fetchedGuests = await getGuests(user.uid)
      setGuests(fetchedGuests)
    }
  }

  const fetchProperties = async () => {
    if (user) {
      const fetchedProperties = await getProperties(user.uid)
      setProperties(fetchedProperties)
    }
  }

  const calculateTotalAmount = (checkIn: string, checkOut: string, pricePerNight: number) => {
    if (checkIn && checkOut && pricePerNight) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);
      setTotalAmount(nights * pricePerNight);
    } else {
      setTotalNights(0);
      setTotalAmount(0);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    if (name === 'propertyId') {
      const selectedProperty = properties.find(p => p.id === value);
      if (selectedProperty) {
        setBooking(prev => ({
          ...prev,
          propertyId: value,
          property: selectedProperty.name,
          pricePerNight: selectedProperty.pricePerNight
        }));
        calculateTotalAmount(booking.checkIn, booking.checkOut, selectedProperty.pricePerNight);
      }
    }
    if (name === 'checkIn' || name === 'checkOut') {
      calculateTotalAmount(
        name === 'checkIn' ? value : booking.checkIn,
        name === 'checkOut' ? value : booking.checkOut,
        booking.pricePerNight
      );
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
          totalNights, // Add this line
          totalAmount,
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
              name="guestId"
              value={booking.guestId}
              onChange={handleInputChange}
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
              name="propertyId"
              value={booking.propertyId}
              onChange={handleInputChange}
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
              name="checkIn"
              value={booking.checkIn}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <input
              type="date"
              name="checkOut"
              value={booking.checkOut}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
            <input
              type="number"
              name="pricePerNight"
              value={booking.pricePerNight}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <input
              type="text"
              value={`$${totalAmount.toFixed(2)}`}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Nights</label>
            <input
              type="text"
              value={totalNights}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
            <textarea
              name="additionalInfo"
              value={booking.additionalInfo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
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