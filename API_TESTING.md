# API Testing Guide

## Tools Needed
- Postman, Insomnia, or Thunder Client (VS Code Extension)

## Base URL
```
http://localhost:5000/api
```

## Testing Workflow

### 1. Health Check
```http
GET http://localhost:5000/health
```

### 2. Register Users

#### Register Jobseeker
```http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "jobseeker@test.com",
  "password": "Test123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "jobseeker"
}
```

#### Register Employer
```http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "employer@test.com",
  "password": "Test123",
  "firstName": "Company",
  "lastName": "Owner",
  "role": "employer"
}
```

### 3. Login

```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "employer@test.com",
  "password": "Test123"
}
```

**Save the token from response!**

### 4. Get Current User Profile

```http
GET {{baseUrl}}/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Update Profile

```http
PUT {{baseUrl}}/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "phone": "555-1234",
  "bio": "Experienced software developer",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### 6. Create a Job (Employer Token Required)

```http
POST {{baseUrl}}/jobs
Authorization: Bearer EMPLOYER_TOKEN_HERE
Content-Type: application/json

{
  "title": "Senior Frontend Developer",
  "company": "Tech Solutions Inc",
  "location": "San Francisco, CA",
  "type": "full-time",
  "description": "We are seeking an experienced frontend developer to join our team. You will be responsible for building user-facing features and ensuring great user experience.",
  "requirements": [
    "5+ years of experience with React",
    "Strong JavaScript/TypeScript skills",
    "Experience with modern CSS frameworks",
    "Bachelor's degree in Computer Science or equivalent"
  ],
  "responsibilities": [
    "Build reusable components and front-end libraries",
    "Translate designs into high-quality code",
    "Optimize components for performance",
    "Collaborate with backend developers"
  ],
  "skills": ["React", "JavaScript", "TypeScript", "CSS", "Git"],
  "salary": {
    "min": 100000,
    "max": 150000,
    "currency": "USD"
  },
  "benefits": ["Health Insurance", "401k", "Remote Work", "Unlimited PTO"],
  "experienceLevel": "senior",
  "category": "technology"
}
```

### 7. Get All Jobs

```http
GET {{baseUrl}}/jobs
```

### 8. Search Jobs

```http
GET {{baseUrl}}/jobs/search?q=developer&type=full-time
```

### 9. Get Job by ID

```http
GET {{baseUrl}}/jobs/JOB_ID_HERE
```

### 10. Apply for Job (Jobseeker Token Required)

```http
POST {{baseUrl}}/applications
Authorization: Bearer JOBSEEKER_TOKEN_HERE
Content-Type: application/json

{
  "jobId": "JOB_ID_HERE",
  "coverLetter": "I am excited to apply for the Senior Frontend Developer position. With over 5 years of experience in React and modern web technologies, I believe I would be a great fit for your team. I have successfully delivered multiple large-scale projects and have a strong passion for creating excellent user experiences.",
  "resume": "https://example.com/resume.pdf"
}
```

### 11. Get My Applications (Jobseeker)

```http
GET {{baseUrl}}/applications/my-applications
Authorization: Bearer JOBSEEKER_TOKEN_HERE
```

### 12. Get Received Applications (Employer)

```http
GET {{baseUrl}}/applications/received
Authorization: Bearer EMPLOYER_TOKEN_HERE
```

### 13. Update Application Status (Employer)

```http
PUT {{baseUrl}}/applications/APPLICATION_ID_HERE/status
Authorization: Bearer EMPLOYER_TOKEN_HERE
Content-Type: application/json

{
  "status": "shortlisted",
  "notes": "Impressive background, moving to next round"
}
```

**Valid statuses:** `pending`, `reviewed`, `shortlisted`, `rejected`, `accepted`

### 14. Save a Job (Jobseeker)

```http
POST {{baseUrl}}/users/saved-jobs/JOB_ID_HERE
Authorization: Bearer JOBSEEKER_TOKEN_HERE
```

### 15. Get Saved Jobs (Jobseeker)

```http
GET {{baseUrl}}/users/saved-jobs
Authorization: Bearer JOBSEEKER_TOKEN_HERE
```

### 16. Get Featured Jobs

```http
GET {{baseUrl}}/jobs/featured?limit=6
```

### 17. Get My Posted Jobs (Employer)

```http
GET {{baseUrl}}/jobs/my/jobs
Authorization: Bearer EMPLOYER_TOKEN_HERE
```

### 18. Update Job (Employer)

```http
PUT {{baseUrl}}/jobs/JOB_ID_HERE
Authorization: Bearer EMPLOYER_TOKEN_HERE
Content-Type: application/json

{
  "title": "Senior Frontend Developer (Updated)",
  "isActive": true
}
```

### 19. Delete Job (Employer)

```http
DELETE {{baseUrl}}/jobs/JOB_ID_HERE
Authorization: Bearer EMPLOYER_TOKEN_HERE
```

### 20. Get Application Statistics (Employer)

```http
GET {{baseUrl}}/applications/stats
Authorization: Bearer EMPLOYER_TOKEN_HERE
```

### 21. Withdraw Application (Jobseeker)

```http
DELETE {{baseUrl}}/applications/APPLICATION_ID_HERE
Authorization: Bearer JOBSEEKER_TOKEN_HERE
```

### 22. Change Password

```http
PUT {{baseUrl}}/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "Test123",
  "newPassword": "NewTest456"
}
```

### 23. Forgot Password

```http
POST {{baseUrl}}/auth/forgot-password
Content-Type: application/json

{
  "email": "jobseeker@test.com"
}
```

### 24. Get User by ID

```http
GET {{baseUrl}}/users/USER_ID_HERE
```

### 25. Logout

```http
POST {{baseUrl}}/auth/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": {
      "id": "abc123...",
      "title": "Senior Frontend Developer",
      ...
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Tips

1. **Save Tokens**: After login, save the token and use it in subsequent requests
2. **Test in Order**: Follow the testing workflow to properly test the application
3. **Check Firestore**: Verify data is being saved in Firebase Console
4. **Use Variables**: In Postman, create environment variables for:
   - `baseUrl`: http://localhost:5000/api
   - `jobseekerToken`: Token from jobseeker login
   - `employerToken`: Token from employer login
   - `jobId`: ID of created job
   - `applicationId`: ID of created application

## Postman Collection

You can import this as a Postman collection or use it as a reference for manual testing.

## Expected Results

After completing the workflow:
- 2 users created in Firestore (jobseeker & employer)
- 1 job posting created
- 1 job application submitted
- Application visible to both jobseeker and employer
- Application status can be updated by employer

## Troubleshooting

### 401 Unauthorized
- Check if token is included in Authorization header
- Check if token is valid (not expired)
- Format: `Bearer YOUR_TOKEN`

### 403 Forbidden
- Check if user role has permission for this action
- Example: Only employers can create jobs

### 400 Bad Request
- Check request body format
- Verify all required fields are included
- Check validation rules (password strength, email format, etc.)

### 404 Not Found
- Verify the endpoint URL is correct
- Check if the resource ID exists

---

Happy Testing! 🚀
