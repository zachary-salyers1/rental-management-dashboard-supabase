'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getGuests, addGuest, updateGuest, deleteGuest } from '../utils/firestore'
import AddGuestModal from './AddGuestModal'
import { Guest } from '../types/guest'

interface GuestsProps {
  guests: Guest[]
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>
}

const Guests: React.FC<GuestsProps> = ({ guests, setGuests }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  useEffect(() => {
    if (user) {
      fetchGuests();
    }
  }, [user]);

  const fetchGuests = async () => {
    if (user) {
      try {
        const fetchedGuests = await getGuests(user.uid);
        setGuests(fetchedGuests);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    }
  };

  const handleAddGuest = async (newGuest: Omit<Guest, 'id' | 'totalStays' | 'lastStay'>) => {
    if (user) {
      try {
        console.log('Attempting to add guest:', newGuest);
        const guestId = await addGuest(user.uid, newGuest);
        console.log('Guest added successfully with ID:', guestId);
        setGuests(prevGuests => [...prevGuests, { ...newGuest, id: guestId, totalStays: 0, lastStay: null }]);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error adding guest:', error);
      }
    }
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleUpdateGuest = async (updatedGuest: Guest) => {
    if (user && updatedGuest.id) {
      try {
        await updateGuest(updatedGuest.id, updatedGuest);
        setGuests(prevGuests => prevGuests.map(guest => 
          guest.id === updatedGuest.id ? updatedGuest : guest
        ));
      } catch (error) {
        console.error('Error updating guest:', error);
      }
    }
    setEditingGuest(null);
    setIsModalOpen(false);
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (user) {
      try {
        await deleteGuest(guestId);
        setGuests(prevGuests => prevGuests.filter(guest => guest.id !== guestId));
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Guest Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-accent text-white px-4 py-2 rounded">
          + Add Guest
        </button>
      </div>
      <div className="bg-card-bg rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 text-secondary">Name</th>
              <th className="text-left p-2 text-secondary">Email</th>
              <th className="text-left p-2 text-secondary">Phone</th>
              <th className="text-left p-2 text-secondary">Last Stay</th>
              <th className="text-left p-2 text-secondary">Total Stays</th>
              <th className="text-left p-2 text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-b border-gray-100">
                <td className="p-2 text-foreground">{guest.name}</td>
                <td className="p-2 text-foreground">{guest.email}</td>
                <td className="p-2 text-foreground">{guest.phone}</td>
                <td className="p-2 text-foreground">{guest.lastStay || 'N/A'}</td>
                <td className="p-2 text-foreground">{guest.totalStays}</td>
                <td className="p-2">
                  <button onClick={() => handleEditGuest(guest)} className="text-accent mr-2">Edit</button>
                  <button onClick={() => handleDeleteGuest(guest.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddGuestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddGuest={handleAddGuest}
        onUpdateGuest={handleUpdateGuest}
        editingGuest={editingGuest}
      />
    </div>
  )
}

export default Guests