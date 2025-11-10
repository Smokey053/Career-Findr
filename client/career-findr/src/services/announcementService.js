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
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Get all announcements
export const getAnnouncements = async () => {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(announcementsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const announcements = [];
    querySnapshot.forEach((doc) => {
      announcements.push({ id: doc.id, ...doc.data() });
    });

    return announcements;
  } catch (error) {
    console.error("Error getting announcements:", error);
    throw error;
  }
};

// Get active announcements for specific audience
export const getActiveAnnouncements = async (userRole) => {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(
      announcementsRef,
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const announcements = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filter by target audience
      if (data.targetAudience === "all" || data.targetAudience === userRole) {
        announcements.push({ id: doc.id, ...data });
      }
    });

    return announcements;
  } catch (error) {
    console.error("Error getting active announcements:", error);
    throw error;
  }
};

// Add a new announcement
export const addAnnouncement = async (announcementData) => {
  try {
    const announcementsRef = collection(db, "announcements");
    const newAnnouncement = {
      ...announcementData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(announcementsRef, newAnnouncement);
    return { id: docRef.id, ...newAnnouncement };
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw error;
  }
};

// Update an announcement
export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    const announcementRef = doc(db, "announcements", announcementId);
    await updateDoc(announcementRef, {
      ...announcementData,
      updatedAt: serverTimestamp(),
    });
    return { id: announcementId, ...announcementData };
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

// Delete an announcement
export const deleteAnnouncement = async (announcementId) => {
  try {
    const announcementRef = doc(db, "announcements", announcementId);
    await deleteDoc(announcementRef);
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

// Toggle announcement status
export const toggleAnnouncementStatus = async (announcementId, isActive) => {
  try {
    const announcementRef = doc(db, "announcements", announcementId);
    await updateDoc(announcementRef, {
      isActive,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error toggling announcement status:", error);
    throw error;
  }
};
