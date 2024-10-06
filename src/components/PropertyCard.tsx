import React from 'react'

interface PropertyCardProps {
  property: {
    id: string
    name: string
    type: string
    location: string
    bedrooms: number
    bathrooms: number
    maxGuests: number
    pricePerNight: number
    assignedGuests: number
    color: string
  }
  onEdit: () => void
  onDelete: () => void
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: property.color }}></div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{property.type} in {property.location}</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-sm font-medium">Bedrooms</p>
          <p>{property.bedrooms}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Bathrooms</p>
          <p>{property.bathrooms}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Max Guests</p>
          <p>{property.maxGuests}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Price/Night</p>
          <p>${property.pricePerNight}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm">
          <span className="font-medium">Assigned Guests:</span> {property.assignedGuests ?? 'N/A'}
        </p>
        <div>
          <button onClick={onEdit} className="text-accent mr-2">Edit</button>
          <button onClick={onDelete} className="text-red-500">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard