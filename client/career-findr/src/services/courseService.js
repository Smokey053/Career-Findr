import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Create a new course
export const createCourse = async (courseData, institutionId) => {
  try {
    const coursesRef = collection(db, "courses");
    const newCourse = {
      ...courseData,
      institutionId,
      status: courseData.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(coursesRef, newCourse);
    return { id: docRef.id, ...newCourse };
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const updatedData = {
      ...courseData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(courseRef, updatedData);
    return { id: courseId, ...updatedData };
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Get a single course
export const getCourse = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    } else {
      throw new Error("Course not found");
    }
  } catch (error) {
    console.error("Error getting course:", error);
    throw error;
  }
};

// Get all courses for an institution
export const getInstitutionCourses = async (institutionId) => {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(
      coursesRef,
      where("institutionId", "==", institutionId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error("Error getting institution courses:", error);
    throw error;
  }
};

// Get all courses (for students to browse)
export const getAllCourses = async (filters = {}) => {
  try {
    const coursesRef = collection(db, "courses");
    const constraints = [where("status", "==", "active")];

    // Add filters if provided
    if (filters.field) {
      constraints.push(where("field", "==", filters.field));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(coursesRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    await deleteDoc(courseRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
