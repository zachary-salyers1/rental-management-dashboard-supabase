import React, { useState } from 'react'
import BookingDetailsCard from './BookingDetailsCard'
import ContractUploadModal from './ContractUploadModal'

interface BookingsProps {
  bookings: any[]
  setBookings: React.Dispatch<React.SetStateAction<any[]>>
  guests: any[]
  properties: any[]
}

const Bookings: React.FC<BookingsProps> = ({ bookings, setBookings, guests, properties }) => {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null)

  const handleAddBooking = () => {
    setSelectedBooking({ isNew: true })
  }

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking)
  }

  const handleCloseDetails = () => {
    setSelectedBooking(null)
  }

  const handleUpdateBooking = (updatedBooking: any) => {
    if (updatedBooking.isNew) {
      setBookings([...bookings, { ...updatedBooking, id: Date.now() }])
    } else {
      const updatedBookings = bookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
      setBookings(updatedBookings)
    }
    setSelectedBooking(null)
  }

  const handleDeleteBooking = (bookingId: number) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId)
    setBookings(updatedBookings)
  }

  const handleUploadContract = (bookingId: number) => {
    setCurrentBookingId(bookingId)
    setIsUploadModalOpen(true)
  }

  const handleContractUpload = (file: File) => {
    if (currentBookingId) {
      const updatedBookings = bookings.map(booking =>
        booking.id === currentBookingId ? { ...booking, contract: file.name } : booking
      )
      setBookings(updatedBookings)
    }
    setIsUploadModalOpen(false)
    setCurrentBookingId(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Booking Management</h2>
        <button onClick={handleAddBooking} className="bg-accent text-white px-4 py-2 rounded">
          + Add Booking
        </button>
      </div>
      <div className="bg-card-bg rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 text-secondary">Guest</th>
              <th className="text-left p-2 text-secondary">Property</th>
              <th className="text-left p-2 text-secondary">Check-in</th>
              <th className="text-left p-2 text-secondary">Check-out</th>
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
                <td className="p-2 text-foreground">{booking.additionalInfo}</td>
                <td className="p-2 text-foreground">
                  {booking.contract ? (
                    <button className="text-accent">View</button>
                  ) : (
                    <button
                      className="text-accent"
                      onClick={() => handleUploadContract(booking.id)}
                    >
                      Upload
                    </button>
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
      {selectedBooking && (
        <BookingDetailsCard
          booking={selectedBooking}
          onClose={handleCloseDetails}
          onUpdateBooking={handleUpdateBooking}
          guests={guests}
          properties={properties}
        />
      )}
      <ContractUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleContractUpload}
      />
    </div>
  )
}

export default Bookings