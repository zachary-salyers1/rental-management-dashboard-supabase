import { db, storage } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Booking } from '../types/booking';

const calculateTotalAmount = (checkIn: string, checkOut: string, pricePerNight: number): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return nights * pricePerNight;
};

export const testFirebaseConnection = async () => {
  try {
    const testCollection = collection(db, 'test');
    const testDoc = await addDoc(testCollection, { test: 'Connection successful' });
    console.log('Firebase connection test successful, doc ID:', testDoc.id);
    await deleteDoc(testDoc);
  } catch (error) {
    console.error('Firebase connection test failed:', error);
  }
};

export const addProperty = async (userId: string, propertyData: any) => {
  try {
    console.log('Adding property:', { userId, propertyData });
    const propertiesCollection = collection(db, 'properties');
    const docRef = await addDoc(propertiesCollection, {
      ...propertyData,
      userId,
    });
    console.log('Property added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding property: ', error);
    throw error;
  }
};

export const updateProperty = async (propertyId: string, propertyData: any) => {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    await updateDoc(propertyRef, propertyData);
  } catch (error) {
    console.error('Error updating property: ', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    await deleteDoc(doc(db, 'properties', propertyId));
  } catch (error) {
    console.error('Error deleting property: ', error);
    throw error;
  }
};

export const getProperties = async (userId: string) => {
  try {
    console.log('Fetching properties for user:', userId);
    const propertiesCollection = collection(db, 'properties');
    const q = query(propertiesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched properties:', properties);
    return properties;
  } catch (error) {
    console.error('Error getting properties: ', error);
    throw error;
  }
};

// Similar functions for guests and bookings...

export const addGuest = async (userId: string, guestData: Omit<Guest, 'id' | 'totalStays' | 'lastStay'>) => {
  try {
    console.log('Adding guest:', { userId, guestData });
    const guestsCollection = collection(db, 'guests');
    const docRef = await addDoc(guestsCollection, {
      ...guestData,
      userId,
      totalStays: 0,
      lastStay: null,
    });
    console.log('Guest added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding guest: ', error);
    throw error;
  }
};

export const updateGuest = async (guestId: string, guestData: any) => {
  try {
    const guestRef = doc(db, 'guests', guestId);
    await updateDoc(guestRef, guestData);
  } catch (error) {
    console.error('Error updating guest: ', error);
    throw error;
  }
};

export const deleteGuest = async (guestId: string) => {
  try {
    await deleteDoc(doc(db, 'guests', guestId));
  } catch (error) {
    console.error('Error deleting guest: ', error);
    throw error;
  }
};

export const getGuests = async (userId: string) => {
  try {
    console.log('Fetching guests for user:', userId);
    const guestsCollection = collection(db, 'guests');
    const q = query(guestsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const guestsPromises = querySnapshot.docs.map(async (guestDoc) => {
      const guestData = guestDoc.data();
      const bookingsCollection = collection(db, 'bookings');
      const bookingsQuery = query(bookingsCollection, 
        where('userId', '==', userId),
        where('guestId', '==', guestDoc.id)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const totalStays = bookingsSnapshot.size;
      
      // Get the most recent booking date
      let lastStay = null;
      if (totalStays > 0) {
        const sortedBookings = bookingsSnapshot.docs
          .map(doc => doc.data())
          .sort((a, b) => new Date(b.checkOut).getTime() - new Date(a.checkOut).getTime());
        lastStay = sortedBookings[0].checkOut;
      }

      return {
        id: guestDoc.id,
        ...guestData,
        totalStays,
        lastStay
      };
    });

    const guests = await Promise.all(guestsPromises);
    console.log('Fetched guests:', guests);
    return guests;
  } catch (error) {
    console.error('Error getting guests: ', error);
    throw error;
  }
};

export const addBooking = async (userId: string, bookingData: Omit<Booking, 'id'>) => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, {
      ...bookingData,
      userId,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding booking: ', error);
    throw error;
  }
};

export const updateBooking = async (bookingId: string, bookingData: Partial<Booking>) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, bookingData);
  } catch (error) {
    console.error('Error updating booking: ', error);
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
  } catch (error) {
    console.error('Error deleting booking: ', error);
    throw error;
  }
};

export const getBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const q = query(bookingsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (error) {
    console.error('Error getting bookings: ', error);
    throw error;
  }
};

export const uploadContract = async (userId: string, bookingId: string, file: File) => {
  try {
    console.log('Uploading contract:', { userId, bookingId, fileName: file.name });
    const contractRef = ref(storage, `contracts/${userId}/${bookingId}/${file.name}`);
    await uploadBytes(contractRef, file);
    console.log('Contract uploaded successfully');
    const downloadURL = await getDownloadURL(contractRef);
    console.log('Download URL obtained:', downloadURL);
    
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { contract: downloadURL });
    console.log('Booking document updated with contract URL');
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading contract:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

export const getTotalProperties = async (userId: string): Promise<number> => {
  try {
    const propertiesCollection = collection(db, 'properties');
    const q = query(propertiesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting total properties: ', error);
    throw error;
  }
};

export const getCurrentlyStayingGuests = async (userId: string): Promise<number> => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const todayString = today.toISOString().split('T')[0];
    
    console.log('Fetching current guests for date:', todayString);

    const q = query(
      bookingsCollection, 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const currentGuests = querySnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.checkIn <= todayString && data.checkOut > todayString;
    });

    console.log('Current guests query result:', currentGuests.map(doc => doc.data()));
    return currentGuests.length;
  } catch (error) {
    console.error('Error getting currently staying guests: ', error);
    throw error;
  }
};

export const getAssignedGuestsCount = async (userId: string, propertyId: string): Promise<number> => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const todayString = today.toISOString().split('T')[0];
    
    const q = query(
      bookingsCollection, 
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    
    const currentGuests = querySnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.checkIn <= todayString && data.checkOut > todayString;
    });

    return currentGuests.length;
  } catch (error) {
    console.error('Error getting assigned guests count: ', error);
    return 0; // Return 0 instead of throwing an error
  }
};