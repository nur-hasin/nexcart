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
import StorefrontIcon from "@mui/icons-material/Storefront";

const sellerRegisterSchema = z.object({
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

  nidNumber: z
    .string()
    .min(10, "NID number must be at least 10 digits")
    .max(50, "NID number cannot be more than 50 characters")
    .regex(/^[0-9]+$/, "NID number must contain only numbers"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password cannot be more than 255 characters"),

  /// ======================
  // SHOP FIELDS
  // ======================

  shopName: z.string().min(3, "Shop name must be at least 3 characters"),

  shopAddress: z.string().min(5, "Shop address is required"),

  tradeLicense: z.string().min(5, "Trade license is required"),

  nidImage: z
    .any()
    .refine((files) => files?.length === 1, "NID image is required")
    .refine(
      (files) =>
        files?.[0]?.type === "image/jpeg" ||
        files?.[0]?.type === "image/jpg" ||
        files?.[0]?.type === "image/png" ||
        files?.[0]?.type === "image/webp",
      "Only JPG, JPEG, PNG, or WEBP image is allowed",
    )
    .refine(
      (files) => files?.[0]?.size <= 2 * 1024 * 1024,
      "Image size must be less than 2MB",
    ),
});

type SellerRegisterData = z.infer<typeof sellerRegisterSchema>;

export default function SellerRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellerRegisterData>({
    resolver: zodResolver(sellerRegisterSchema),
  });

  const nidImageRegister = register("nidImage");

  const onSubmit = async (data: SellerRegisterData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("nidNumber", data.nidNumber);
      formData.append("password", data.password);

      formData.append("shopName", data.shopName);
      formData.append("shopAddress", data.shopAddress);
      formData.append("tradeLicense", data.tradeLicense);

      formData.append("nidImage", data.nidImage[0]);
      const response = await axios.post(
        "http://localhost:3000/seller",
        formData,
      );

      toast.success(response.data?.message || "Seller registered successfully");

      reset();
      setSelectedFileName("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          toast.error(message.join(", "));
        } else {
          toast.error(message || "Seller registration failed");
        }
      } else {
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
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 62,
                height: 62,
                mx: "auto",
                mb: 2,
                borderRadius: 4,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StorefrontIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                letterSpacing: "-0.8px",
              }}
            >
              Seller Registration
            </Typography>

            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Create your seller account for NexCart
            </Typography>
          </Box>

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
            <TextField
              label="Full Name"
              placeholder="Enter seller name"
              fullWidth
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              placeholder="Enter email address"
              fullWidth
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />

            <TextField
              label="Phone Number"
              placeholder="Example: 017XXXXXXXX"
              fullWidth
              {...register("phone")}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />

            <TextField
              label="NID Number"
              placeholder="Enter NID number"
              fullWidth
              {...register("nidNumber")}
              error={Boolean(errors.nidNumber)}
              helperText={errors.nidNumber?.message}
            />

            <TextField
              label="Password"
              placeholder="Enter password"
              type="password"
              fullWidth
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />

            <TextField
              label="Shop Name"
              placeholder="Enter shop name"
              fullWidth
              {...register("shopName")}
              error={Boolean(errors.shopName)}
              helperText={errors.shopName?.message}
            />

            <TextField
              label="Shop Address"
              placeholder="Enter shop address"
              fullWidth
              {...register("shopAddress")}
              error={Boolean(errors.shopAddress)}
              helperText={errors.shopAddress?.message}
            />

            <TextField
              label="Trade License Number"
              placeholder="Enter trade license number"
              fullWidth
              {...register("tradeLicense")}
              error={Boolean(errors.tradeLicense)}
              helperText={errors.tradeLicense?.message}
            />

            <Box>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  py: 1.6,
                  borderColor: errors.nidImage ? "#d32f2f" : "#d1d5db",
                  color: errors.nidImage ? "#d32f2f" : "text.primary",
                  bgcolor: "white",
                  "&:hover": {
                    borderColor: errors.nidImage ? "#d32f2f" : "primary.main",
                    color: errors.nidImage ? "#d32f2f" : "primary.main",
                    bgcolor: "white",
                  },
                }}
              >
                Upload NID Image
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  name={nidImageRegister.name}
                  ref={nidImageRegister.ref}
                  onBlur={nidImageRegister.onBlur}
                  onChange={(event) => {
                    nidImageRegister.onChange(event);
                    const file = event.target.files?.[0];
                    setSelectedFileName(file ? file.name : "");
                  }}
                />
              </Button>

              {selectedFileName && (
                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                    fontSize: 14,
                  }}
                >
                  Selected: {selectedFileName}
                </Typography>
              )}

              {errors.nidImage?.message && (
                <Typography
                  sx={{
                    mt: 0.8,
                    ml: 1.8,
                    color: "#d32f2f",
                    fontSize: "0.75rem",
                  }}
                >
                  {String(errors.nidImage.message)}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.6,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Create Seller Account"
              )}
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            Already have a seller account?{" "}
            <Typography
              component={Link}
              href="/login/seller"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Login
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
