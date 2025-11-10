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
} from "@mui/material";
import {
  School,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Schedule,
  CheckCircle,
  ArrowBack,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { getCourse } from "../../services/courseService";
import { saveItem, unsaveItem, checkIfSaved } from "../../services/savedItemsService";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../../components/common/LoadingScreen";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });

  // Check if course is saved
  const { data: isSaved, refetch: refetchSavedStatus } = useQuery({
    queryKey: ["savedCourse", courseId],
    queryFn: () => checkIfSaved(user?.uid, courseId, "course"),
    enabled: !!user?.uid && !!courseId,
  });

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveItem(user.uid, courseId, "course");
      } else {
        await saveItem(user.uid, {
          itemId: courseId,
          itemType: "course",
          itemData: {
            title: course.title,
            institution: course.institutionName,
            duration: course.duration,
            fee: course.fee,
          },
        });
      }
      await refetchSavedStatus();
    } catch (error) {
      console.error("Error saving/unsaving course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    navigate(`/apply/${courseId}`);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading course details..." />;
  }

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/courses")}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/courses")}
        sx={{ mb: 3 }}
      >
        Back to Courses
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
                {course.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Chip
                  icon={<School />}
                  label={course.institutionName || "Institution"}
                  color="primary"
                />
                <Chip
                  label={course.level || "Undergraduate"}
                  color="secondary"
                />
                <Chip
                  label={course.status === "active" ? "Open" : "Closed"}
                  color={course.status === "active" ? "success" : "error"}
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
                disabled={course.status !== "active"}
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
                  <Schedule sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                </Box>
                <Typography variant="h6">{course.duration || "N/A"}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Tuition Fee
                  </Typography>
                </Box>
                <Typography variant="h6">
                  ${course.fee?.toLocaleString() || "0"}
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
                    Start Date
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {course.startDate
                    ? new Date(course.startDate).toLocaleDateString()
                    : "TBD"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                </Box>
                <Typography variant="h6">{course.location || "Online"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            About This Course
          </Typography>
          <Typography variant="body1" paragraph>
            {course.description || "No description available."}
          </Typography>
        </Box>

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Prerequisites
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {course.prerequisites.map((prereq, index) => (
                <Chip
                  key={index}
                  icon={<CheckCircle />}
                  label={prereq}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Skills You'll Gain
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {course.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="secondary" />
              ))}
            </Box>
          </Box>
        )}

        {/* Curriculum */}
        {course.curriculum && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Curriculum
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {course.curriculum}
            </Typography>
          </Box>
        )}

        {/* Additional Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            {course.degree && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Degree Type
                </Typography>
                <Typography variant="body1">{course.degree}</Typography>
              </Grid>
            )}
            {course.credits && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Credits
                </Typography>
                <Typography variant="body1">{course.credits}</Typography>
              </Grid>
            )}
            {course.language && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Language
                </Typography>
                <Typography variant="body1">{course.language}</Typography>
              </Grid>
            )}
            {course.mode && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Mode of Study
                </Typography>
                <Typography variant="body1">{course.mode}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Application Deadline */}
        {course.deadline && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Application Deadline:</strong>{" "}
              {new Date(course.deadline).toLocaleDateString()}
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleApply}
            disabled={course.status !== "active"}
          >
            Apply Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
