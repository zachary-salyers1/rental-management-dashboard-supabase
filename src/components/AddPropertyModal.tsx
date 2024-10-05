import React, { useState, useEffect } from 'react'
import { Property, Price } from '../types/property'

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProperty: (property: Property) => void
  onUpdateProperty: (property: Property) => void
  editingProperty: Property | null
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onAddProperty, onUpdateProperty, editingProperty }) => {
  const [property, setProperty] = useState<Property>({
    id: '',
    name: '',
    type: '',
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    maxGuests: 0,
    pricePerNight: 0,
    description: '',
    color: '#000000',
    prices: []
  })

  const [newPrice, setNewPrice] = useState<Omit<Price, 'id'>>({
    name: '',
    amount: 0,
    isDefault: false
  })

  const [selectedPriceId, setSelectedPriceId] = useState<string>('')

  useEffect(() => {
    if (editingProperty) {
      setProperty({
        ...editingProperty,
        prices: editingProperty.prices || []
      })
      if (editingProperty.prices && editingProperty.prices.length > 0) {
        const defaultPrice = editingProperty.prices.find(price => price.isDefault)
        setSelectedPriceId(defaultPrice ? defaultPrice.id : editingProperty.prices[0].id)
      }
    } else {
      setProperty({
        id: '',
        name: '',
        type: '',
        location: '',
        bedrooms: 0,
        bathrooms: 0,
        maxGuests: 0,
        pricePerNight: 0,
        description: '',
        color: '#000000',
        prices: []
      })
      setSelectedPriceId('')
    }
  }, [editingProperty])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPrice = property.prices.find(price => price.id === selectedPriceId)
    const propertyData = {
      ...property,
      bedrooms: Number(property.bedrooms),
      bathrooms: Number(property.bathrooms),
      maxGuests: Number(property.maxGuests),
      pricePerNight: selectedPrice ? selectedPrice.amount : 0,
    }
    if (editingProperty) {
      onUpdateProperty(propertyData)
    } else {
      onAddProperty(propertyData)
    }
    onClose()
  }

  const handleAddPrice = () => {
    const newPriceWithId: Price = {
      ...newPrice,
      id: Date.now().toString(),
      isDefault: property.prices.length === 0 // Make the first price default
    }
    setProperty(prev => ({
      ...prev,
      prices: [...prev.prices, newPriceWithId]
    }))
    if (property.prices.length === 0) {
      setSelectedPriceId(newPriceWithId.id)
    }
    setNewPrice({ name: '', amount: 0, isDefault: false })
  }

  const handleRemovePrice = (id: string) => {
    setProperty(prev => ({
      ...prev,
      prices: prev.prices.filter(price => price.id !== id)
    }))
    if (selectedPriceId === id) {
      setSelectedPriceId(property.prices[0]?.id || '')
    }
  }

  const handleSetDefaultPrice = (priceId: string) => {
    const updatedPrices = property.prices.map(price => ({
      ...price,
      isDefault: price.id === priceId
    }))
    setProperty(prev => ({
      ...prev,
      prices: updatedPrices,
      pricePerNight: updatedPrices.find(price => price.id === priceId)?.amount || prev.pricePerNight
    }))
    setSelectedPriceId(priceId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
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
              onChange={(e) => setProperty({ ...property, bedrooms: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number"
              value={property.bathrooms}
              onChange={(e) => setProperty({ ...property, bathrooms: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
            <input
              type="number"
              value={property.maxGuests}
              onChange={(e) => setProperty({ ...property, maxGuests: Number(e.target.value) })}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={property.color}
              onChange={(e) => setProperty({ ...property, color: e.target.value })}
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Prices</h3>
            {property.prices && property.prices.length > 0 ? (
              property.prices.map(price => (
                <div key={price.id} className="flex items-center mb-2">
                  <span className="mr-2">{price.name}: ${price.amount}</span>
                  <button type="button" onClick={() => handleSetDefaultPrice(price.id)} className={`mr-2 px-2 py-1 text-xs ${price.isDefault ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded`}>
                    {price.isDefault ? 'Default' : 'Set as Default'}
                  </button>
                  <button type="button" onClick={() => handleRemovePrice(price.id)} className="text-red-500">Remove</button>
                </div>
              ))
            ) : (
              <p>No prices added yet.</p>
            )}
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={newPrice.name}
                onChange={(e) => setNewPrice(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Price Name"
                className="mr-2 p-1 border rounded"
              />
              <input
                type="number"
                value={newPrice.amount}
                onChange={(e) => setNewPrice(prev => ({ ...prev, amount: Number(e.target.value) }))}
                placeholder="Amount"
                className="mr-2 p-1 border rounded w-20"
              />
              <button type="button" onClick={handleAddPrice} className="bg-blue-500 text-white px-2 py-1 rounded">Add Price</button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Price</label>
            <select
              value={selectedPriceId}
              onChange={(e) => setSelectedPriceId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a price</option>
              {property.prices.map(price => (
                <option key={price.id} value={price.id}>
                  {price.name}: ${price.amount}
                </option>
              ))}
            </select>
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