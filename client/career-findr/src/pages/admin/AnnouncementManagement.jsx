import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Campaign,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
} from "../../services/announcementService";
import { formatDistanceToNow } from "date-fns";

export default function AnnouncementManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    targetAudience: "all",
  });
  const [error, setError] = useState("");

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });

  // Add announcement mutation
  const addMutation = useMutation({
    mutationFn: (announcementData) => addAnnouncement(announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to add announcement");
    },
  });

  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: ({ announcementId, announcementData }) =>
      updateAnnouncement(announcementId, announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to update announcement");
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: (announcementId) => deleteAnnouncement(announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      setDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
    },
    onError: (error) => {
      setError(error.message || "Failed to delete announcement");
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ announcementId, isActive }) =>
      toggleAnnouncementStatus(announcementId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
    },
  });

  const handleOpenDialog = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title || "",
        message: announcement.message || "",
        type: announcement.type || "info",
        targetAudience: announcement.targetAudience || "all",
      });
    } else {
      setSelectedAnnouncement(null);
      setFormData({
        title: "",
        message: "",
        type: "info",
        targetAudience: "all",
      });
    }
    setError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAnnouncement(null);
    setFormData({
      title: "",
      message: "",
      type: "info",
      targetAudience: "all",
    });
    setError("");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return;
    }

    const announcementData = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      type: formData.type,
      targetAudience: formData.targetAudience,
      isActive: true,
    };

    if (selectedAnnouncement) {
      updateMutation.mutate({
        announcementId: selectedAnnouncement.id,
        announcementData,
      });
    } else {
      addMutation.mutate(announcementData);
    }
  };

  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAnnouncement) {
      deleteMutation.mutate(selectedAnnouncement.id);
    }
  };

  const handleToggleStatus = (announcement) => {
    toggleMutation.mutate({
      announcementId: announcement.id,
      isActive: !announcement.isActive,
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      info: "info",
      warning: "warning",
      success: "success",
      error: "error",
    };
    return colors[type] || "default";
  };

  if (isLoading) {
    return <LoadingScreen message="Loading announcements..." />;
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
            Announcements Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage platform-wide announcements
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New Announcement
        </Button>
      </Box>

      {announcements.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Campaign sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Announcements Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first announcement to notify users
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              New Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {announcement.title}
                      </Typography>
                      <Chip
                        label={announcement.type}
                        color={getTypeColor(announcement.type)}
                        size="small"
                      />
                      <Chip
                        label={announcement.targetAudience}
                        size="small"
                        variant="outlined"
                      />
                      {announcement.isActive ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="default" size="small" />
                      )}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {announcement.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {announcement.createdAt &&
                        `Posted ${formatDistanceToNow(
                          announcement.createdAt.toDate()
                        )} ago`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleStatus(announcement)}
                      color={announcement.isActive ? "primary" : "default"}
                    >
                      {announcement.isActive ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(announcement)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(announcement)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedAnnouncement ? "Edit Announcement" : "New Announcement"}
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
              label="Title *"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            <TextField
              fullWidth
              label="Message *"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={formData.targetAudience}
                label="Target Audience"
                onChange={(e) =>
                  handleInputChange("targetAudience", e.target.value)
                }
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="student">Students Only</MenuItem>
                <MenuItem value="institute">Institutions Only</MenuItem>
                <MenuItem value="company">Companies Only</MenuItem>
              </Select>
            </FormControl>
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
              : selectedAnnouncement
              ? "Update"
              : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${selectedAnnouncement?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedAnnouncement(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
}
