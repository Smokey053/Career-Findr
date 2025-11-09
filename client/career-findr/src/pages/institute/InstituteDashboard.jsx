import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  School,
  People,
  CheckCircle,
  Pending,
  Add,
  ArrowForward,
  TrendingUp,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { instituteAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getInstitutionCourses } from "../../services/courseService";
import { getInstitutionApplications } from "../../services/applicationService";

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["instituteProfile"],
    queryFn: instituteAPI.getProfile,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["instituteCourses"],
    queryFn: () => getInstitutionCourses(user.uid),
  });

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["instituteApplications"],
    queryFn: () => getInstitutionApplications(user.uid),
  });

  // Calculate statistics
  const admissionsCount =
    applications?.filter((app) => app.status === "approved").length || 0;
  const stats = {
    totalAdmissions: admissionsCount,
    acceptanceRate:
      applications?.length > 0
        ? Math.round((admissionsCount / applications.length) * 100)
        : 0,
    averageResponseTime: 2, // Placeholder
    totalStudentsEnrolled:
      courses?.reduce((sum, course) => sum + (course.enrolled || 0), 0) || 0,
  };

  if (coursesLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  const pendingApplications =
    applications?.filter((app) => app.status === "pending") || [];
  const recentApplications = applications?.slice(0, 5) || [];
  const activeCourses =
    courses?.filter((course) => course.status === "active") || [];

  const statsData = [
    {
      title: "Total Courses",
      value: courses?.length || 0,
      icon: School,
      color: "primary",
      action: () => navigate("/institute/courses"),
    },
    {
      title: "Pending Applications",
      value: pendingApplications.length,
      icon: Pending,
      color: "warning",
      action: () => navigate("/institute/applications"),
    },
    {
      title: "Total Applications",
      value: applications?.length || 0,
      icon: People,
      color: "info",
      action: () => navigate("/institute/applications"),
    },
    {
      title: "Admissions Offered",
      value: stats?.totalAdmissions || 0,
      icon: CheckCircle,
      color: "success",
      action: () => navigate("/institute/admissions"),
    },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Welcome back, {user?.name || profile?.name || "Institution"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your courses, review applications, and track admissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/institute/courses/new")}
            size="large"
          >
            Add New Course
          </Button>
        </Box>

        {/* Verification Status */}
        {profile && !profile.verified && (
          <Card
            sx={{
              mb: 3,
              bgcolor: "warning.50",
              borderLeft: 4,
              borderColor: "warning.main",
            }}
          >
            <CardContent>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                Account Pending Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your institution account is under review by our admin team.
                You'll be notified once verified.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={stat.action}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color={`${stat.color}.main`}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: `${stat.color}.main`,
                          color: "white",
                          p: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Icon />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="row g-3">
          {/* Recent Applications */}
          <div className="col-12 col-lg-7">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Recent Applications
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/institute/applications")}
                  >
                    View All
                  </Button>
                </Box>

                {appsLoading ? (
                  <Box py={3}>
                    <LinearProgress />
                  </Box>
                ) : recentApplications.length > 0 ? (
                  <List>
                    {recentApplications.map((app) => (
                      <ListItem
                        key={app.id}
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          mb: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/institute/applications/${app.id}`)
                        }
                      >
                        <ListItemText
                          primary={
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {app.studentName || "Student Name"}
                              </Typography>
                              <Chip
                                label={app.status}
                                size="small"
                                color={
                                  app.status === "accepted"
                                    ? "success"
                                    : app.status === "rejected"
                                    ? "error"
                                    : "warning"
                                }
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span">
                                {app.courseName || "Course"}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                Applied:{" "}
                                {app.createdAt
                                  ? new Date(app.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box py={6} textAlign="center">
                    <People
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No applications yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Courses */}
          <div className="col-12 col-lg-5">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Active Courses
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/institute/courses")}
                  >
                    Manage
                  </Button>
                </Box>

                {coursesLoading ? (
                  <Box py={3}>
                    <LinearProgress />
                  </Box>
                ) : activeCourses.length > 0 ? (
                  <List>
                    {activeCourses.slice(0, 5).map((course) => (
                      <ListItem
                        key={course.id}
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          mb: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/institute/courses/${course.id}`)
                        }
                      >
                        <School sx={{ mr: 2, color: "primary.main" }} />
                        <ListItemText
                          primary={course.name}
                          secondary={
                            <>
                              <Typography variant="caption" display="block">
                                {course.field} • {course.level}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="success.main"
                              >
                                {course.applicationsCount || 0} applications
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box py={6} textAlign="center">
                    <School
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      No active courses
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => navigate("/institute/courses/new")}
                    >
                      Create Course
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        {stats && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Performance Metrics
              </Typography>
              <div className="row g-3 mt-2">
                <div className="col-12 col-sm-4">
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight={700}
                    >
                      {stats.acceptanceRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Acceptance Rate
                    </Typography>
                  </Box>
                </div>
                <div className="col-12 col-sm-4">
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight={700}
                    >
                      {stats.averageResponseTime || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Response Time (days)
                    </Typography>
                  </Box>
                </div>
                <div className="col-12 col-sm-4">
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="secondary.main"
                      fontWeight={700}
                    >
                      {stats.totalStudentsEnrolled || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Students Enrolled
                    </Typography>
                  </Box>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
