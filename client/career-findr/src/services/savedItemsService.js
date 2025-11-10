import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const mapTimestamp = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "number") {
    return new Date(value);
  }
  return null;
};

export const getSavedItems = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to load saved items");
  }

  const savedRef = collection(db, "savedItems");
  const savedQuery = query(savedRef, where("userId", "==", userId));
  const snapshot = await getDocs(savedQuery);

  const jobs = [];
  const courses = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const item = {
      id: docSnap.id,
      ...data,
      savedAt: mapTimestamp(data.savedAt),
    };

    if (data.type === "job") {
      jobs.push(item);
    } else if (data.type === "course") {
      courses.push(item);
    }
  });

  const sortDescending = (a, b) => {
    const aTime = a.savedAt ? a.savedAt.getTime() : 0;
    const bTime = b.savedAt ? b.savedAt.getTime() : 0;
    return bTime - aTime;
  };

  jobs.sort(sortDescending);
  courses.sort(sortDescending);

  return { jobs, courses };
};

export const removeSavedItem = async (userId, type, itemId) => {
  if (!userId || !type || !itemId) {
    throw new Error("Missing required parameters to remove saved item");
  }

  const savedRef = collection(db, "savedItems");
  const savedQuery = query(
    savedRef,
    where("userId", "==", userId),
    where("type", "==", type),
    where("itemId", "==", itemId)
  );

  const snapshot = await getDocs(savedQuery);

  if (!snapshot.empty) {
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    return;
  }

  // Fallback: try deleting by document id if itemId was stored as document key
  const docRef = doc(savedRef, itemId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
  }
};

// Save an item (job or course)
export const saveItem = async (userId, itemData) => {
  if (!userId || !itemData) {
    throw new Error("User ID and item data are required");
  }

  const savedRef = collection(db, "savedItems");

  // Check if already saved
  const existingQuery = query(
    savedRef,
    where("userId", "==", userId),
    where("itemId", "==", itemData.itemId),
    where("type", "==", itemData.itemType)
  );

  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    return; // Already saved
  }

  await addDoc(savedRef, {
    userId,
    itemId: itemData.itemId,
    type: itemData.itemType,
    itemData: itemData.itemData || {},
    savedAt: serverTimestamp(),
  });
};

// Unsave an item
export const unsaveItem = async (userId, itemId, itemType) => {
  if (!userId || !itemId || !itemType) {
    throw new Error("User ID, item ID, and item type are required");
  }

  const savedRef = collection(db, "savedItems");
  const savedQuery = query(
    savedRef,
    where("userId", "==", userId),
    where("itemId", "==", itemId),
    where("type", "==", itemType)
  );

  const snapshot = await getDocs(savedQuery);
  if (!snapshot.empty) {
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }
};

// Check if an item is saved
export const checkIfSaved = async (userId, itemId, itemType) => {
  if (!userId || !itemId || !itemType) {
    return false;
  }

  const savedRef = collection(db, "savedItems");
  const savedQuery = query(
    savedRef,
    where("userId", "==", userId),
    where("itemId", "==", itemId),
    where("type", "==", itemType)
  );

  const snapshot = await getDocs(savedQuery);
  return !snapshot.empty;
};
