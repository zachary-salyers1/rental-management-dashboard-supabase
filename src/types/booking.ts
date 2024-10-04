export interface Booking {
  id: string
  guestName: string
  property: string
  checkIn: string
  checkOut: string
  additionalInfo: string
  contract?: string
}