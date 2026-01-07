import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase configuration
// In production, use environment variables or secure config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || 'demo-api-key',
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || 'demo.firebaseapp.com',
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || 'demo-project',
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || 'demo.appspot.com',
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || '123456789',
  appId: Constants.expoConfig?.extra?.firebaseAppId || '1:123456789:web:abcdef',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
