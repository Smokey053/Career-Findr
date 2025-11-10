import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Get all faculties for an institution
export const getFaculties = async (institutionId) => {
  try {
    const facultiesRef = collection(db, "faculties");
    const q = query(facultiesRef, where("institutionId", "==", institutionId));
    const querySnapshot = await getDocs(q);

    const faculties = [];
    querySnapshot.forEach((doc) => {
      faculties.push({ id: doc.id, ...doc.data() });
    });

    return faculties;
  } catch (error) {
    console.error("Error getting faculties:", error);
    throw error;
  }
};

// Add a new faculty
export const addFaculty = async (institutionId, facultyData) => {
  try {
    const facultiesRef = collection(db, "faculties");
    const newFaculty = {
      ...facultyData,
      institutionId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(facultiesRef, newFaculty);
    return { id: docRef.id, ...newFaculty };
  } catch (error) {
    console.error("Error adding faculty:", error);
    throw error;
  }
};

// Update a faculty
export const updateFaculty = async (facultyId, facultyData) => {
  try {
    const facultyRef = doc(db, "faculties", facultyId);
    await updateDoc(facultyRef, {
      ...facultyData,
      updatedAt: serverTimestamp(),
    });
    return { id: facultyId, ...facultyData };
  } catch (error) {
    console.error("Error updating faculty:", error);
    throw error;
  }
};

// Delete a faculty
export const deleteFaculty = async (facultyId) => {
  try {
    const facultyRef = doc(db, "faculties", facultyId);
    await deleteDoc(facultyRef);
  } catch (error) {
    console.error("Error deleting faculty:", error);
    throw error;
  }
};
