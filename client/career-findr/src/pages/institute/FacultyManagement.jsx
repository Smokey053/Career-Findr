import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  School,
  People,
  Description,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  getFaculties,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../services/facultyService";

export default function FacultyManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dean: "",
    contactEmail: "",
    departments: "",
  });
  const [error, setError] = useState("");

  // Fetch faculties
  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ["faculties", user?.uid],
    queryFn: () => getFaculties(user?.uid),
    enabled: !!user?.uid,
  });

  // Add faculty mutation
  const addMutation = useMutation({
    mutationFn: (facultyData) => addFaculty(user.uid, facultyData),
    onSuccess: () => {
      queryClient.invalidateQueries(["faculties"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to add faculty");
    },
  });

  // Update faculty mutation
  const updateMutation = useMutation({
    mutationFn: ({ facultyId, facultyData }) =>
      updateFaculty(facultyId, facultyData),
    onSuccess: () => {
      queryClient.invalidateQueries(["faculties"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to update faculty");
    },
  });

  // Delete faculty mutation
  const deleteMutation = useMutation({
    mutationFn: (facultyId) => deleteFaculty(facultyId),
    onSuccess: () => {
      queryClient.invalidateQueries(["faculties"]);
      setDeleteDialogOpen(false);
      setSelectedFaculty(null);
    },
    onError: (error) => {
      setError(error.message || "Failed to delete faculty");
    },
  });

  const handleOpenDialog = (faculty = null) => {
    if (faculty) {
      setSelectedFaculty(faculty);
      setFormData({
        name: faculty.name || "",
        description: faculty.description || "",
        dean: faculty.dean || "",
        contactEmail: faculty.contactEmail || "",
        departments: Array.isArray(faculty.departments)
          ? faculty.departments.join(", ")
          : "",
      });
    } else {
      setSelectedFaculty(null);
      setFormData({
        name: "",
        description: "",
        dean: "",
        contactEmail: "",
        departments: "",
      });
    }
    setError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFaculty(null);
    setFormData({
      name: "",
      description: "",
      dean: "",
      contactEmail: "",
      departments: "",
    });
    setError("");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("Faculty name is required");
      return;
    }

    const facultyData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      dean: formData.dean.trim(),
      contactEmail: formData.contactEmail.trim(),
      departments: formData.departments
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d),
    };

    if (selectedFaculty) {
      updateMutation.mutate({
        facultyId: selectedFaculty.id,
        facultyData,
      });
    } else {
      addMutation.mutate(facultyData);
    }
  };

  const handleDeleteClick = (faculty) => {
    setSelectedFaculty(faculty);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFaculty) {
      deleteMutation.mutate(selectedFaculty.id);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading faculties..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Faculty Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your institution's faculties and departments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Faculty
        </Button>
      </Box>

      {faculties.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <School sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Faculties Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first faculty to organize courses and departments
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Faculty
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {faculties.map((faculty) => (
            <Grid item xs={12} md={6} key={faculty.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <School color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {faculty.name}
                        </Typography>
                        {faculty.dean && (
                          <Typography variant="body2" color="text.secondary">
                            Dean: {faculty.dean}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(faculty)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(faculty)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  {faculty.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {faculty.description}
                    </Typography>
                  )}

                  {faculty.contactEmail && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      📧 {faculty.contactEmail}
                    </Typography>
                  )}

                  {faculty.departments && faculty.departments.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {faculty.departments.map((dept, index) => (
                        <Chip key={index} label={dept} size="small" />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedFaculty ? "Edit Faculty" : "Add New Faculty"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Faculty Name *"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            <TextField
              fullWidth
              label="Dean/Head of Faculty"
              value={formData.dean}
              onChange={(e) => handleInputChange("dean", e.target.value)}
            />
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                handleInputChange("contactEmail", e.target.value)
              }
            />
            <TextField
              fullWidth
              label="Departments (comma-separated)"
              placeholder="e.g., Computer Science, Mathematics, Physics"
              value={formData.departments}
              onChange={(e) => handleInputChange("departments", e.target.value)}
              helperText="Enter department names separated by commas"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            {addMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : selectedFaculty
              ? "Update"
              : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Faculty"
        message={`Are you sure you want to delete "${selectedFaculty?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedFaculty(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
}
