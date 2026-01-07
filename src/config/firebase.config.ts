import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase configuration interface
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Get Firebase configuration from environment or use demo values
const getFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || 'demo-api-key',
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || 'demo.firebaseapp.com',
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || 'demo-project',
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || 'demo.appspot.com',
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || '123456789',
    appId: Constants.expoConfig?.extra?.firebaseAppId || '1:123456789:web:abcdef',
  };
};

// Initialize Firebase
const config = getFirebaseConfig();
const app: FirebaseApp = initializeApp(config);
const db: Firestore = getFirestore(app);

export { app, db };
export default app;

