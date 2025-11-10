import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Submit a course application
export const submitCourseApplication = async (applicationData, studentId) => {
  try {
    const applicationsRef = collection(db, "applications");

    // Check if student already has 2 applications to this institution
    const existingAppsQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("institutionId", "==", applicationData.institutionId),
      where("type", "==", "course")
    );

    const existingAppsSnapshot = await getDocs(existingAppsQuery);

    if (existingAppsSnapshot.size >= 2) {
      throw new Error(
        "You have already applied to 2 courses at this institution. Maximum 2 applications per institution allowed."
      );
    }

    const newApplication = {
      ...applicationData,
      studentId,
      type: "course",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(applicationsRef, newApplication);
    return { id: docRef.id, ...newApplication };
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

// Submit a job application
export const submitJobApplication = async (applicationData, studentId) => {
  try {
    const applicationsRef = collection(db, "applications");
    const newApplication = {
      ...applicationData,
      studentId,
      type: "job",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(applicationsRef, newApplication);
    return { id: docRef.id, ...newApplication };
  } catch (error) {
    console.error("Error submitting job application:", error);
    throw error;
  }
};

// Get applications for a student
export const getStudentApplications = async (studentId) => {
  try {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("type", "==", "course"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting student applications:", error);
    throw error;
  }
};

// Get job applications for a student
export const getStudentJobApplications = async (studentId) => {
  try {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("type", "==", "job"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting student job applications:", error);
    throw error;
  }
};

// Get applications for an institution
export const getInstitutionApplications = async (
  institutionId,
  filters = {}
) => {
  try {
    const applicationsRef = collection(db, "applications");
    const constraints = [
      where("institutionId", "==", institutionId),
      where("type", "==", "course"),
    ];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters.courseId) {
      constraints.push(where("courseId", "==", filters.courseId));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(applicationsRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting institution applications:", error);
    throw error;
  }
};

// Get job applications for a company
export const getCompanyJobApplications = async (companyId, filters = {}) => {
  try {
    const applicationsRef = collection(db, "applications");
    const constraints = [
      where("companyId", "==", companyId),
      where("type", "==", "job"),
    ];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters.jobId) {
      constraints.push(where("jobId", "==", filters.jobId));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(applicationsRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting company job applications:", error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId,
  status,
  reason = null
) => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    const updatedData = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (reason) {
      updatedData.statusReason = reason;
    }

    // If approved, create admission record
    if (status === "approved") {
      const appSnap = await getDoc(applicationRef);
      if (appSnap.exists()) {
        const appData = appSnap.data();
        await createAdmission(applicationId, appData);
      }
    }

    await updateDoc(applicationRef, updatedData);
    return { id: applicationId, ...updatedData };
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

// Create admission record
const createAdmission = async (applicationId, applicationData) => {
  try {
    const admissionsRef = collection(db, "admissions");
    const newAdmission = {
      applicationId,
      studentId: applicationData.studentId,
      institutionId: applicationData.institutionId,
      courseId: applicationData.courseId,
      status: "pending", // student needs to accept/decline
      createdAt: serverTimestamp(),
    };

    await addDoc(admissionsRef, newAdmission);
  } catch (error) {
    console.error("Error creating admission:", error);
    throw error;
  }
};

// Get admissions for a student
export const getStudentAdmissions = async (studentId) => {
  try {
    const admissionsRef = collection(db, "admissions");
    const q = query(
      admissionsRef,
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const admissions = [];
    querySnapshot.forEach((doc) => {
      admissions.push({ id: doc.id, ...doc.data() });
    });

    return admissions;
  } catch (error) {
    console.error("Error getting student admissions:", error);
    throw error;
  }
};

// Accept admission
export const acceptAdmission = async (admissionId) => {
  try {
    const admissionRef = doc(db, "admissions", admissionId);
    await updateDoc(admissionRef, {
      status: "accepted",
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error accepting admission:", error);
    throw error;
  }
};

// Decline admission
export const declineAdmission = async (admissionId) => {
  try {
    const admissionRef = doc(db, "admissions", admissionId);
    await updateDoc(admissionRef, {
      status: "declined",
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error declining admission:", error);
    throw error;
  }
};
