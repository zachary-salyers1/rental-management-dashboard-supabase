import React, { useState, useEffect } from 'react'

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProperty: (property: any) => void
  onUpdateProperty: (property: any) => void
  editingProperty: any | null
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onAddProperty, onUpdateProperty, editingProperty }) => {
  const [property, setProperty] = useState({
    name: '',
    type: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    pricePerNight: '',
    description: ''
  })

  useEffect(() => {
    if (editingProperty) {
      setProperty(editingProperty)
    } else {
      setProperty({
        name: '',
        type: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        maxGuests: '',
        pricePerNight: '',
        description: ''
      })
    }
  }, [editingProperty])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const propertyData = {
      ...property,
      bedrooms: parseInt(property.bedrooms as string),
      bathrooms: parseInt(property.bathrooms as string),
      maxGuests: parseInt(property.maxGuests as string),
      pricePerNight: parseFloat(property.pricePerNight as string),
      assignedGuests: editingProperty ? editingProperty.assignedGuests : 0
    }
    if (editingProperty) {
      onUpdateProperty(propertyData)
    } else {
      onAddProperty(propertyData)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
        <p className="text-sm text-gray-600 mb-4">Enter the details of the property below.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={property.name}
              onChange={(e) => setProperty({ ...property, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={property.type}
              onChange={(e) => setProperty({ ...property, type: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Cabin">Cabin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={property.location}
              onChange={(e) => setProperty({ ...property, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number"
              value={property.bedrooms}
              onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number"
              value={property.bathrooms}
              onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
            <input
              type="number"
              value={property.maxGuests}
              onChange={(e) => setProperty({ ...property, maxGuests: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
            <input
              type="number"
              value={property.pricePerNight}
              onChange={(e) => setProperty({ ...property, pricePerNight: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={property.description}
              onChange={(e) => setProperty({ ...property, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              {editingProperty ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPropertyModal