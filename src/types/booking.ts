export interface Booking {
  id: string
  guestId: string  // Add this line
  guestName: string
  propertyId: string
  property: string
  checkIn: string
  checkOut: string
  additionalInfo: string
  contract?: string
  pricePerNight: number
  totalAmount: number
  totalNights: number
}