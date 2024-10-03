import React from 'react'

interface BasicInfoProps {
  guest: Guest
  onUpdateGuest: (updatedInfo: Partial<Guest>) => void
}

const BasicInfo: React.FC<BasicInfoProps> = ({ guest, onUpdateGuest }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Guest Information</h3>
      <p className="text-sm text-gray-600 mb-4">Basic details about the guest.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Email</p>
          <p>{guest.email}</p>
        </div>
        <div>
          <p className="font-semibold">Phone</p>
          <p>{guest.phone}</p>
        </div>
        <div>
          <p className="font-semibold">Last Stay</p>
          <p>{guest.lastStay}</p>
        </div>
        <div>
          <p className="font-semibold">Upcoming Stay</p>
          <p>{guest.upcomingStay}</p>
        </div>
        <div>
          <p className="font-semibold">Total Stays</p>
          <p>{guest.totalStays}</p>
        </div>
        <div>
          <p className="font-semibold">Favorite Property</p>
          <p>{guest.favoriteProperty}</p>
        </div>
        <div>
          <p className="font-semibold">Assigned Property</p>
          <select
            value={guest.assignedProperty}
            onChange={(e) => onUpdateGuest({ assignedProperty: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="Lakeside Retreat">Lakeside Retreat</option>
            <option value="Mountain View Cabin">Mountain View Cabin</option>
            <option value="Downtown Loft">Downtown Loft</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default BasicInfo