import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

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

export const addGuest = async (userId: string, guestData: any) => {
  try {
    console.log('Adding guest:', { userId, guestData });
    const guestsCollection = collection(db, 'guests');
    const docRef = await addDoc(guestsCollection, {
      ...guestData,
      userId,
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
    const guests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched guests:', guests);
    return guests;
  } catch (error) {
    console.error('Error getting guests: ', error);
    throw error;
  }
};