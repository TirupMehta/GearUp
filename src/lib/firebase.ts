import { getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";

// Firebase app is already initialized in AuthContext.tsx
// We just grab the existing instance here
export const db = getFirestore(getApp());
