export interface Price {
  id: string;
  name: string;
  amount: number;
  isDefault: boolean;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number; // This will now be set based on the selected price
  description: string;
  color: string;
  prices: Price[];
}