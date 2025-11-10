import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { ArrowBack, Send, Work } from "@mui/icons-material";
import { getJob } from "../../services/jobService";
import { submitJobApplication } from "../../services/applicationService";
import { useAuth } from "../../contexts/AuthContext";
import FileUploader from "../../components/common/FileUploader";
import LoadingScreen from "../../components/common/LoadingScreen";

export default function JobApplicationForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
    additionalInfo: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch job details
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });

  // Submit application mutation
  const submitMutation = useMutation({
    mutationFn: (applicationData) => submitJobApplication(applicationData),
    onSuccess: () => {
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/applications");
      }, 2000);
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to submit application");
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (url) => {
    handleInputChange("resumeUrl", url);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    }
    if (!formData.resumeUrl) {
      newErrors.resumeUrl = "Resume is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    const applicationData = {
      jobId,
      companyId: job.companyId,
      studentId: user.uid,
      studentName: user.displayName || user.email,
      studentEmail: user.email,
      jobTitle: job.title,
      companyName: job.companyName,
      ...formData,
      status: "pending",
      appliedAt: new Date().toISOString(),
    };

    submitMutation.mutate(applicationData);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading job details..." />;
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Job not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/jobs")}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  if (job.status !== "active") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          This job is no longer accepting applications
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/jobs")}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/jobs/${jobId}`)}
        sx={{ mb: 3 }}
      >
        Back to Job Details
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Apply for Position
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Chip icon={<Work />} label={job.title} color="primary" />
            <Chip label={job.companyName} color="secondary" />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Application submitted successfully! Redirecting...
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Cover Letter */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Cover Letter *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Explain why you're a great fit for this position..."
                value={formData.coverLetter}
                onChange={(e) =>
                  handleInputChange("coverLetter", e.target.value)
                }
                error={!!errors.coverLetter}
                helperText={errors.coverLetter}
                disabled={submitMutation.isPending}
              />
            </Grid>

            {/* Resume Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Resume *
              </Typography>
              <FileUploader
                onFileUpload={handleFileUpload}
                accept=".pdf,.doc,.docx"
                label="Upload Resume (PDF, DOC, DOCX)"
              />
              {errors.resumeUrl && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.resumeUrl}
                </Typography>
              )}
              {formData.resumeUrl && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Resume uploaded successfully
                </Alert>
              )}
            </Grid>

            {/* Portfolio URL */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Portfolio URL (Optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={(e) =>
                  handleInputChange("portfolioUrl", e.target.value)
                }
                disabled={submitMutation.isPending}
              />
            </Grid>

            {/* LinkedIn URL */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                LinkedIn Profile (Optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  handleInputChange("linkedinUrl", e.target.value)
                }
                disabled={submitMutation.isPending}
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Information (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Any additional information you'd like to share..."
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                disabled={submitMutation.isPending}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/jobs/${jobId}`)}
                  disabled={submitMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit Application"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
