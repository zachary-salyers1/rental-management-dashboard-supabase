export interface Guest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  totalStays?: number;
  lastStay?: string | null;
}