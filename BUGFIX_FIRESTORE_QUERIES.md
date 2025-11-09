# Bug Fix: Firestore Query Data Display Issue

## Problem Identified

The app was not displaying information from the database on other pages, even though the data existed in Firestore. The root cause was **incorrect Firestore query construction** in multiple service files.

## Root Cause

When building Firestore queries with multiple constraints (filters), the code was chaining `query()` calls, where each subsequent call would **overwrite all previous constraints**:

```javascript
// ❌ BROKEN - Each query() call overwrites the previous one
let q = query(coursesRef, where("status", "==", "active"));
if (filters.field) {
  q = query(q, where("field", "==", filters.field)); // Overwrites the first query!
}
if (filters.location) {
  q = query(q, where("location", "==", filters.location)); // Overwrites again!
}
```

In this example, only the final `where("location", ...)` constraint would be applied, losing all previous filters.

## Solution Applied

All constraints must be collected in an array and passed to a **single `query()` call** using the spread operator:

```javascript
// ✅ FIXED - All constraints applied together
const constraints = [where("status", "==", "active")];
if (filters.field) {
  constraints.push(where("field", "==", filters.field));
}
if (filters.location) {
  constraints.push(where("location", "==", filters.location));
}
const q = query(coursesRef, ...constraints); // All constraints applied!
```

## Files Fixed

1. **src/services/courseService.js**

   - `getAllCourses()` - Fixed field filter not being applied

2. **src/services/jobService.js**

   - `getAllJobs()` - Fixed type and location filters being overwritten
   - `searchJobs()` - Fixed all filter constraints being overwritten

3. **src/services/applicationService.js**

   - `getInstitutionApplications()` - Fixed status and courseId filters
   - `getCompanyJobApplications()` - Fixed status and jobId filters

4. **src/services/userService.js**
   - `getUsers()` - Fixed role and status filters
   - `searchCandidates()` - Fixed status filter being overwritten

## Impact

- **Course Search Page**: Now correctly filters courses by field of study
- **Job Board**: Now correctly applies location, job type, and experience level filters
- **Institute Dashboard**: Now correctly shows filtered course applications
- **Company Dashboard**: Now correctly shows filtered job applications
- **Admin Dashboard**: Now correctly filters users by role and status
- **Candidate Search**: Now correctly filters candidates

## Testing Recommendations

1. Search courses with field filter - should return only courses in that field
2. Search jobs with multiple filters (location + type) - should apply all filters
3. View institution applications with status filter - should show only matching applications
4. Search candidates with status filter - should show only active students
5. Use admin user filter - should filter users by role/status correctly

## Notes

- All data fetching now uses Firebase's native query constraints properly
- No API changes were required, only internal service fixes
- The fix maintains backward compatibility with existing code
