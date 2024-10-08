import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getBookings, addBooking, updateBooking, deleteBooking, uploadContract } from '../utils/firestore'
import AddBookingModal from './AddBookingModal'
import { Booking } from '../types/booking'

interface BookingsProps {
  bookings: Booking[]
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
}

const Bookings: React.FC<BookingsProps> = ({ bookings, setBookings }) => {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (user) {
      try {
        const fetchedBookings = await getBookings(user.uid)
        setBookings(fetchedBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }
  }

  const handleAddBooking = () => {
    setEditingBooking(null)
    setIsModalOpen(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setIsModalOpen(true)
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (user) {
      try {
        await deleteBooking(bookingId)
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId))
      } catch (error) {
        console.error('Error deleting booking:', error)
      }
    }
  }

  const handleUploadContract = async (bookingId: string) => {
    if (!user) {
      console.error('User not authenticated');
      // You might want to show an error message to the user here
      return;
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx'
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const contractUrl = await uploadContract(user.uid, bookingId, file)
          setBookings(bookings.map(booking => 
            booking.id === bookingId ? { ...booking, contract: contractUrl } : booking
          ))
        } catch (error) {
          console.error('Error uploading contract:', error)
          // You might want to show an error message to the user here
        }
      }
    }
    input.click()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBooking(null)
  }

  const handleAddOrUpdateBooking = async () => {
    await fetchBookings()
    setIsModalOpen(false)
    setEditingBooking(null)
  };

  const refreshBookings = async () => {
    if (user) {
      await fetchBookings()
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Booking Management</h2>
        <div>
          <button onClick={handleAddBooking} className="bg-accent text-white px-4 py-2 rounded mr-2">
            + Add Booking
          </button>
          <button onClick={refreshBookings} className="bg-accent text-white px-4 py-2 rounded">
            Refresh Bookings
          </button>
        </div>
      </div>
      <div className="bg-card-bg rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 text-secondary">Guest</th>
              <th className="text-left p-2 text-secondary">Property</th>
              <th className="text-left p-2 text-secondary">Check-in</th>
              <th className="text-left p-2 text-secondary">Check-out</th>
              <th className="text-left p-2 text-secondary">Total Nights</th>
              <th className="text-left p-2 text-secondary">Price/Night</th>
              <th className="text-left p-2 text-secondary">Total Amount</th>
              <th className="text-left p-2 text-secondary">Additional Info</th>
              <th className="text-left p-2 text-secondary">Contract</th>
              <th className="text-left p-2 text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-100">
                <td className="p-2 text-foreground">{booking.guestName}</td>
                <td className="p-2 text-foreground">{booking.property}</td>
                <td className="p-2 text-foreground">{booking.checkIn}</td>
                <td className="p-2 text-foreground">{booking.checkOut}</td>
                <td className="p-2 text-foreground">{booking.totalNights}</td>
                <td className="p-2 text-foreground">${booking.pricePerNight}</td>
                <td className="p-2 text-foreground">
                  ${booking.totalAmount ? booking.totalAmount.toFixed(2) : 'N/A'}
                </td>
                <td className="p-2 text-foreground">
                  {booking.contract ? (
                    <a href={booking.contract} target="_blank" rel="noopener noreferrer" className="text-accent">View</a>
                  ) : (
                    <button onClick={() => handleUploadContract(booking.id)} className="text-accent">Upload</button>
                  )}
                </td>
                <td className="p-2">
                  <button onClick={() => handleEditBooking(booking)} className="text-accent mr-2">Edit</button>
                  <button onClick={() => handleDeleteBooking(booking.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddBooking={handleAddOrUpdateBooking}
        editingBooking={editingBooking}
      />
    </div>
  )
}

export default Bookings