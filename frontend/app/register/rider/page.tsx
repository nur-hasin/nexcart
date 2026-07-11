"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";

import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

// =========================================
// VALIDATION SCHEMA
// =========================================
const riderRegisterSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot be more than 100 characters"),

  email: z.string().email("Enter a valid email address"),

  phone: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(20, "Phone number cannot be more than 20 characters")
    .regex(/^01[0-9]{9}$/, "Enter a valid Bangladeshi phone number"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password cannot be more than 255 characters"),

  vehicle_type: z.enum([
    "bike",
    "car",
    "scooter",
    "bicycle",
    "truck",
  ]),

  current_location: z
    .string()
    .min(2, "Location is required"),

  profileImage: z
    .any()
    .refine((file) => file?.length === 1, "Profile image is required"),
});

type RiderRegisterData = z.infer<typeof riderRegisterSchema>;

// =========================================
// COMPONENT
// =========================================
export default function RiderRegisterPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RiderRegisterData>({
    resolver: zodResolver(riderRegisterSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      vehicle_type: "bike",
      current_location: "",
    },
  });

  // =========================================
  // SUBMIT
  // =========================================
  const onSubmit = async (data: RiderRegisterData) => {
    try {
      setLoading(true);

      console.log("Submitted Data:", data);
      console.log("Selected File:", data.profileImage?.[0]);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("vehicle_type", data.vehicle_type);
      formData.append("current_location", data.current_location);

      // IMAGE
      if (data.profileImage?.[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      // API CALL
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/riders/createRider`,
        formData
      );

      toast.success(
        response.data?.message || "Rider registered successfully"
      );

      reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend Error:", error.response?.data);

        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          message.forEach((msg) => toast.error(msg));
        } else if (typeof message === "string") {
          toast.error(message);
        } else {
          toast.error("Rider registration failed");
        }
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            border: "1px solid #e5e7eb",
            boxShadow: "0 25px 70px rgba(15, 23, 42, 0.1)",
          }}
        >
          {/* HEADER */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 62,
                height: 62,
                mx: "auto",
                mb: 2,
                borderRadius: 4,
                bgcolor: "secondary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DirectionsBikeIcon fontSize="large" />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Rider Registration
            </Typography>

            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Join the NexCart delivery team
            </Typography>
          </Box>

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* NAME */}
            <TextField
              label="Full Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* EMAIL + PHONE */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <TextField
                label="Email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Phone Number"
                fullWidth
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Box>

            {/* PASSWORD */}
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {/* VEHICLE TYPE */}
            <TextField
              select
              label="Vehicle Type"
              fullWidth
              defaultValue="bike"
              {...register("vehicle_type")}
            >
              <MenuItem value="bike">Bike</MenuItem>
              <MenuItem value="car">Car</MenuItem>
              <MenuItem value="scooter">Scooter</MenuItem>
              <MenuItem value="bicycle">Bicycle</MenuItem>
              <MenuItem value="truck">Truck</MenuItem>
            </TextField>

            {/* LOCATION */}
            <TextField
              label="Current Location"
              fullWidth
              {...register("current_location")}
              error={!!errors.current_location}
              helperText={errors.current_location?.message}
            />

            {/* PROFILE IMAGE */}
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Upload Profile Image
              </Typography>

              <input
                type="file"
                accept="image/*"
                {...register("profileImage")}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  background: "white",
                }}
              />

              {errors.profileImage && (
                <Typography
                  sx={{
                    color: "error.main",
                    fontSize: "14px",
                    mt: 1,
                  }}
                >
                  {String(errors.profileImage.message)}
                </Typography>
              )}
            </Box>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{
                py: 1.6,
                fontWeight: 800,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "white" }}
                />
              ) : (
                "Register as Rider"
              )}
            </Button>
          </Box>

          {/* LOGIN */}
          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Already have a rider account?{" "}
            <Link
              href="/login/rider"
              style={{
                color: "#9c27b0",
                fontWeight: 800,
              }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}