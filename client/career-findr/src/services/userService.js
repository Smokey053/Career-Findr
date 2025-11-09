import { db } from "../config/firebase";
import {
  collection,
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

// Get all users (for admin)
export const getUsers = async (filters = {}) => {
  try {
    const usersRef = collection(db, "users");
    const constraints = [];

    // Add filters
    if (filters.role) {
      constraints.push(where("role", "==", filters.role));
    }
    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    const q =
      constraints.length > 0
        ? query(usersRef, ...constraints)
        : query(usersRef);

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Get a single user
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { id: userId, status };
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp(),
    });
    return { id: userId, role };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Approve user (for admin)
export const approveUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "active",
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: userId, status: "active" };
  } catch (error) {
    console.error("Error approving user:", error);
    throw error;
  }
};

// Reject user (for admin)
export const rejectUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "rejected",
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: userId, status: "rejected" };
  } catch (error) {
    console.error("Error rejecting user:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get platform statistics (for admin dashboard)
export const getPlatformStats = async () => {
  try {
    const stats = {
      totalUsers: 0,
      totalCourses: 0,
      totalJobs: 0,
      totalApplications: 0,
      totalAdmissions: 0,
      activeUsers: 0,
      totalInstitutions: 0,
      activeInstitutions: 0,
      totalCompanies: 0,
      activeCompanies: 0,
      usersByRole: {
        student: 0,
        institution: 0,
        company: 0,
        admin: 0,
      },
      applicationsByStatus: {
        pending: 0,
        approved: 0,
        rejected: 0,
        interviewing: 0,
        shortlisted: 0,
      },
      recentActivity: [],
    };

    // Count users
    const usersSnapshot = await getDocs(collection(db, "users"));
    stats.totalUsers = usersSnapshot.size;
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const role = data.role;
      const status = (data.status || "").toLowerCase();
      if (stats.usersByRole[role] !== undefined) {
        stats.usersByRole[role]++;
      }
      if (status === "active") {
        stats.activeUsers++;
      }
      if (role === "institute") {
        stats.totalInstitutions++;
        if (status === "active") {
          stats.activeInstitutions++;
        }
      }
      if (role === "company") {
        stats.totalCompanies++;
        if (status === "active") {
          stats.activeCompanies++;
        }
      }
    });

    // Count courses
    const coursesSnapshot = await getDocs(collection(db, "courses"));
    stats.totalCourses = coursesSnapshot.size;

    // Count jobs
    const jobsSnapshot = await getDocs(collection(db, "jobs"));
    stats.totalJobs = jobsSnapshot.size;

    // Count applications
    const applicationsSnapshot = await getDocs(collection(db, "applications"));
    stats.totalApplications = applicationsSnapshot.size;
    applicationsSnapshot.forEach((doc) => {
      const data = doc.data();
      const status = (data.status || "").toLowerCase();
      if (stats.applicationsByStatus[status] !== undefined) {
        stats.applicationsByStatus[status]++;
      }
    });

    // Count admissions
    const admissionsSnapshot = await getDocs(collection(db, "admissions"));
    stats.totalAdmissions = admissionsSnapshot.size;

    return stats;
  } catch (error) {
    console.error("Error getting platform stats:", error);
    throw error;
  }
};

// Search candidates (for companies)
export const searchCandidates = async (filters = {}) => {
  try {
    const usersRef = collection(db, "users");
    const constraints = [where("role", "==", "student")];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    const q = query(usersRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const candidates = [];
    querySnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() };

      // Client-side filtering for search terms
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          userData.name?.toLowerCase().includes(searchLower) ||
          userData.email?.toLowerCase().includes(searchLower) ||
          userData.skills?.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          )
        ) {
          candidates.push(userData);
        }
      } else {
        candidates.push(userData);
      }
    });

    return candidates;
  } catch (error) {
    console.error("Error searching candidates:", error);
    throw error;
  }
};
