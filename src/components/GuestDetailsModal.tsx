import React, { useState, useEffect } from 'react'
import BasicInfo from './GuestDetails/BasicInfo'
import BookingHistory from './GuestDetails/BookingHistory'
import Notes from './GuestDetails/Notes'

interface GuestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  guest: Guest
  onUpdateGuest: (guest: Guest) => void
}

interface Guest {
  id: number
  name: string
  email: string
  phone: string
  lastStay: string
  upcomingStay: string
  totalStays: number
  favoriteProperty: string
  assignedProperty: string
  bookingHistory: BookingHistoryItem[]
  notes: Note[]
}

interface BookingHistoryItem {
  id: number
  property: string
  checkIn: string
  checkOut: string
}

interface Note {
  id: number
  content: string
  date: string
}

const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({ isOpen, onClose, guest, onUpdateGuest }) => {
  const [activeTab, setActiveTab] = useState('basicInfo')
  const [editedGuest, setEditedGuest] = useState(guest)

  useEffect(() => {
    setEditedGuest(guest)
  }, [guest])

  const handleUpdateGuest = (updatedInfo: Partial<Guest>) => {
    const updatedGuest = { ...editedGuest, ...updatedInfo }
    setEditedGuest(updatedGuest)
    onUpdateGuest(updatedGuest)
  }

  const handleAddNote = (newNote: Omit<Note, 'id'>) => {
    const noteWithId = { ...newNote, id: Date.now() }
    handleUpdateGuest({ notes: [...editedGuest.notes, noteWithId] })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Guest Details: {editedGuest.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="mb-4 border-b border-gray-200">
          <button
            className={`mr-4 pb-2 ${activeTab === 'basicInfo' ? 'border-b-2 border-accent text-accent font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basicInfo')}
          >
            Basic Info
          </button>
          <button
            className={`mr-4 pb-2 ${activeTab === 'bookingHistory' ? 'border-b-2 border-accent text-accent font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('bookingHistory')}
          >
            Booking History
          </button>
          <button
            className={`mr-4 pb-2 ${activeTab === 'notes' ? 'border-b-2 border-accent text-accent font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
        {activeTab === 'basicInfo' && (
          <BasicInfo guest={editedGuest} onUpdateGuest={handleUpdateGuest} />
        )}
        {activeTab === 'bookingHistory' && (
          <BookingHistory bookingHistory={editedGuest.bookingHistory} />
        )}
        {activeTab === 'notes' && (
          <Notes notes={editedGuest.notes} onAddNote={handleAddNote} />
        )}
      </div>
    </div>
  )
}

export default GuestDetailsModal