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

// Create a new job
export const createJob = async (jobData, companyId) => {
  try {
    const jobsRef = collection(db, "jobs");
    const newJob = {
      ...jobData,
      companyId,
      status: jobData.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(jobsRef, newJob);
    return { id: docRef.id, ...newJob };
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Update a job
export const updateJob = async (jobId, jobData) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const updatedData = {
      ...jobData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(jobRef, updatedData);
    return { id: jobId, ...updatedData };
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Get a single job
export const getJob = async (jobId) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    } else {
      throw new Error("Job not found");
    }
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

// Get all jobs for a company
export const getCompanyJobs = async (companyId) => {
  try {
    const jobsRef = collection(db, "jobs");
    const q = query(
      jobsRef,
      where("companyId", "==", companyId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    return jobs;
  } catch (error) {
    console.error("Error getting company jobs:", error);
    throw error;
  }
};

// Get all jobs (for students to browse)
export const getAllJobs = async (filters = {}) => {
  try {
    const jobsRef = collection(db, "jobs");
    const constraints = [where("status", "==", "active")];

    // Add filters if provided
    if (filters.type) {
      constraints.push(where("type", "==", filters.type));
    }
    if (filters.location) {
      constraints.push(where("location", "==", filters.location));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(jobsRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    return jobs;
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

// Search jobs
export const searchJobs = async (filters = {}) => {
  try {
    const jobsRef = collection(db, "jobs");
    const constraints = [where("status", "==", "active")];

    // Add filters
    if (filters.type) {
      constraints.push(where("type", "==", filters.type));
    }
    if (filters.location) {
      constraints.push(where("location", "==", filters.location));
    }
    if (filters.experience) {
      constraints.push(where("experienceLevel", "==", filters.experience));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(jobsRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const jobs = [];
    querySnapshot.forEach((doc) => {
      const jobData = { id: doc.id, ...doc.data() };
      // Client-side search filter for title/description
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          jobData.title?.toLowerCase().includes(searchLower) ||
          jobData.description?.toLowerCase().includes(searchLower)
        ) {
          jobs.push(jobData);
        }
      } else {
        jobs.push(jobData);
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (jobId) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    await deleteDoc(jobRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
