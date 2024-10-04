import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Guest } from '../types/guest'

interface AddGuestModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGuest: (guest: Omit<Guest, 'id' | 'totalStays' | 'lastStay'>) => void
  onUpdateGuest: (guest: Guest) => void
  editingGuest: Guest | null
}

const AddGuestModal: React.FC<AddGuestModalProps> = ({ isOpen, onClose, onAddGuest, onUpdateGuest, editingGuest }) => {
  const { user } = useAuth()
  const [guest, setGuest] = useState<Omit<Guest, 'id' | 'totalStays' | 'lastStay'>>({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (editingGuest) {
      setGuest({
        name: editingGuest.name,
        email: editingGuest.email,
        phone: editingGuest.phone,
      })
    } else {
      setGuest({
        name: '',
        email: '',
        phone: '',
      })
    }
  }, [editingGuest])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const guestData: Omit<Guest, 'id' | 'totalStays' | 'lastStay'> = {
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
    };
    console.log('Submitting guest data:', guestData);
    if (editingGuest) {
      onUpdateGuest({ ...editingGuest, ...guestData });
    } else {
      onAddGuest(guestData);
    }
    onClose();
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={guest.name}
              onChange={(e) => setGuest({ ...guest, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={guest.email}
              onChange={(e) => setGuest({ ...guest, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={guest.phone}
              onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
              {editingGuest ? 'Update' : 'Add'} Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddGuestModal