import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Work,
  LocationOn,
  AttachMoney,
  Schedule,
  CheckCircle,
  ArrowBack,
  BookmarkBorder,
  Bookmark,
  Business,
  CalendarToday,
} from "@mui/icons-material";
import { getJob } from "../../services/jobService";
import { saveItem, unsaveItem, checkIfSaved } from "../../services/savedItemsService";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../../components/common/LoadingScreen";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch job details
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });

  // Check if job is saved
  const { data: isSaved, refetch: refetchSavedStatus } = useQuery({
    queryKey: ["savedJob", jobId],
    queryFn: () => checkIfSaved(user?.uid, jobId, "job"),
    enabled: !!user?.uid && !!jobId,
  });

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveItem(user.uid, jobId, "job");
      } else {
        await saveItem(user.uid, {
          itemId: jobId,
          itemType: "job",
          itemData: {
            title: job.title,
            company: job.companyName,
            location: job.location,
            salary: job.salary,
          },
        });
      }
      await refetchSavedStatus();
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    navigate(`/jobs/${jobId}/apply`);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/jobs")}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {job.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Chip
                  icon={<Business />}
                  label={job.companyName || "Company"}
                  color="primary"
                />
                <Chip label={job.type || "Full-time"} color="secondary" />
                <Chip
                  label={job.status === "active" ? "Open" : "Closed"}
                  color={job.status === "active" ? "success" : "error"}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleApply}
                disabled={job.status !== "active"}
              >
                Apply Now
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Key Information Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {job.location || "Remote"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Salary
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {job.salary || "Competitive"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Schedule sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Experience
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {job.experience || "Entry Level"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recently"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Job Description
          </Typography>
          <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-line" }}>
            {job.description || "No description available."}
          </Typography>
        </Box>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Requirements
            </Typography>
            <List>
              {job.requirements.map((req, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Required Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {job.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="secondary" />
              ))}
            </Box>
          </Box>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Responsibilities
            </Typography>
            <List>
              {job.responsibilities.map((resp, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Work color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={resp} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Benefits
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {job.benefits.map((benefit, index) => (
                <Chip
                  key={index}
                  icon={<CheckCircle />}
                  label={benefit}
                  variant="outlined"
                  color="success"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Additional Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            {job.department && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1">{job.department}</Typography>
              </Grid>
            )}
            {job.positions && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Open Positions
                </Typography>
                <Typography variant="body1">{job.positions}</Typography>
              </Grid>
            )}
            {job.remote !== undefined && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Remote Work
                </Typography>
                <Typography variant="body1">
                  {job.remote ? "Available" : "On-site"}
                </Typography>
              </Grid>
            )}
            {job.workMode && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Work Mode
                </Typography>
                <Typography variant="body1">{job.workMode}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Application Deadline */}
        {job.deadline && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Application Deadline:</strong>{" "}
              {new Date(job.deadline).toLocaleDateString()}
            </Typography>
          </Alert>
        )}

        {/* Footer Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/jobs")}>
            Back to Jobs
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleApply}
            disabled={job.status !== "active"}
          >
            Apply Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
