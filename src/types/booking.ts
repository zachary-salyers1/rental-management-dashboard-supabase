export interface Booking {
  id: string
  guestName: string
  property: string
  checkIn: string
  checkOut: string
  additionalInfo: string
  contract?: string
  pricePerNight: number // Add this line
  totalAmount: number // Add this line
  totalNights: number // Add this line
}