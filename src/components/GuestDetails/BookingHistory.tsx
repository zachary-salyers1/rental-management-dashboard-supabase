import React from 'react'

interface BookingHistoryProps {
  bookingHistory: BookingHistoryItem[]
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookingHistory }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Booking History</h3>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Property</th>
            <th className="text-left p-2">Check-in</th>
            <th className="text-left p-2">Check-out</th>
          </tr>
        </thead>
        <tbody>
          {bookingHistory.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="p-2">{booking.property}</td>
              <td className="p-2">{booking.checkIn}</td>
              <td className="p-2">{booking.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingHistory