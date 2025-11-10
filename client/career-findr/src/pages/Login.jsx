import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  RocketLaunch,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await login(data);

      // Redirect based on role
      if (response.user.role === "student") {
        navigate("/dashboard/student");
      } else if (response.user.role === "institute") {
        navigate("/dashboard/institute");
      } else if (response.user.role === "company") {
        navigate("/dashboard/company");
      } else if (response.user.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const response = await signInWithGoogle();

      // Redirect based on role
      if (response.user.role === "student") {
        navigate("/dashboard/student");
      } else if (response.user.role === "institute") {
        navigate("/dashboard/institute");
      } else if (response.user.role === "company") {
        navigate("/dashboard/company");
      } else if (response.user.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 2, sm: 3, md: 4 },
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%" }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            mx: "auto",
          }}
        >
          <Box textAlign="center" mb={3}>
            <RocketLaunch
              sx={{
                fontSize: 48,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Career Findr account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              autoFocus
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right" mt={1} mb={2}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                color="primary"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={<LoginIcon />}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 8,
                },
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
              sx={{
                mb: 2,
                py: 1.5,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              Continue with Google
            </Button>

            <Divider sx={{ my: 3 }} />

            <Box textAlign="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  color="primary"
                  fontWeight={500}
                >
                  Sign up
                </Link>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  color="primary"
                  fontWeight={500}
                >
                  Forgot Password?
                </Link>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
              >
                <Link
                  component={RouterLink}
                  to="/"
                  color="primary"
                  fontWeight={500}
                >
                  ← Back to Home
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
