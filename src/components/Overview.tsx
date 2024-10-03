'use client'

import React from 'react'

const Overview: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card-bg p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-secondary mb-2">Total Properties</h3>
          <p className="text-3xl font-bold text-primary">12</p>
        </div>
        <div className="bg-card-bg p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-secondary mb-2">Total Guests</h3>
          <p className="text-3xl font-bold text-primary">48</p>
        </div>
        <div className="bg-card-bg p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-secondary mb-2">Upcoming Bookings</h3>
          <p className="text-3xl font-bold text-primary">6</p>
        </div>
        <div className="bg-card-bg p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-secondary mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-primary">$24,500</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-bg p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">Recent Activity</h3>
          <p className="text-sm text-secondary mb-2">Your rental properties' latest updates and bookings.</p>
          <ul className="text-foreground">
            <li className="mb-2 flex items-center"><span className="mr-2">📅</span> New booking for Lakeside Retreat</li>
            <li className="mb-2 flex items-center"><span className="mr-2">👤</span> New guest registered: John Doe</li>
            <li className="flex items-center"><span className="mr-2">📈</span> Revenue increased by 15% this month</li>
          </ul>
        </div>
        <div className="bg-card-bg p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">Top Performing Properties</h3>
          <ul className="text-foreground">
            <li className="mb-2 flex items-center justify-between">
              <span>🏠 Lakeside Retreat</span>
              <span className="font-semibold">$5,200</span>
            </li>
            <li className="mb-2 flex items-center justify-between">
              <span>🏔️ Mountain View Cabin</span>
              <span className="font-semibold">$4,800</span>
            </li>
            <li className="flex items-center justify-between">
              <span>🏙️ Downtown Loft</span>
              <span className="font-semibold">$3,900</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Overview