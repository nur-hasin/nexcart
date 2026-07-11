"use client";

import Link from "next/link";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#030712",
        color: "white",
        borderTop: "1px solid #111827",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            py: 7,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1fr 1fr 1fr",
            },
            gap: {
              xs: 5,
              md: 6,
            },
          }}
        >
          {/* Brand Section */}
          <Box>
            <Box
              component={Link}
              href="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "white",
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 3,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 30px rgba(22, 163, 74, 0.25)",
                }}
              >
                <ShoppingBagIcon />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                }}
              >
                NexCart
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 3,
                maxWidth: 520,
                color: "#9ca3af",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              NexCart is a complete ecommerce platform for customers, sellers,
              riders, and admins. Built to make online shopping, selling, and
              delivery easier, faster, and smarter.
            </Typography>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                gap: 1.2,
                alignItems: "center",
              }}
            >
              <SocialButton icon={<FacebookIcon />} />
              <SocialButton icon={<TwitterIcon />} />
              <SocialButton icon={<InstagramIcon />} />
              <SocialButton icon={<LinkedInIcon />} />
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <FooterTitle title="Quick Links" />

            <FooterLink href="/" label="Home" />
            <FooterLink href="/products" label="Products" />
            <FooterLink href="/sellers" label="Sellers" />
            <FooterLink href="/about" label="About" />
          </Box>

          {/* Account */}
          <Box>
            <FooterTitle title="Account" />

            <FooterLink href="/login" label="Login" />
            <FooterLink href="/register" label="Register" />
            <FooterLink href="/customer/login" label="Customer Login" />
            <FooterLink href="/seller/login" label="Seller Login" />
          </Box>

          {/* User Roles */}
          <Box>
            <FooterTitle title="User Roles" />

            <FooterLink href="/admin/login" label="Admin" />
            <FooterLink href="/seller/login" label="Seller" />
            <FooterLink href="/rider/login" label="Rider" />
            <FooterLink href="/customer/login" label="Customer" />
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: "1px solid #1f2937",
            py: 3,
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: 14,
              textAlign: {
                xs: "center",
                md: "left",
              },
            }}
          >
            © {new Date().getFullYear()} NexCart. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <BottomLink href="/privacy" label="Privacy Policy" />
            <BottomLink href="/terms" label="Terms of Service" />
            <BottomLink href="/contact" label="Contact" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function FooterTitle({ title }: { title: string }) {
  return (
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 900,
        mb: 2.5,
        color: "#f9fafb",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
      }}
    >
      {title}
    </Typography>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        display: "block",
        color: "#9ca3af",
        textDecoration: "none",
        mb: 1.5,
        fontSize: 15,
        fontWeight: 500,
        transition: "0.2s ease",
        "&:hover": {
          color: "white",
          transform: "translateX(4px)",
        },
      }}
    >
      {label}
    </Typography>
  );
}

function BottomLink({ href, label }: { href: string; label: string }) {
  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        color: "#6b7280",
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 500,
        transition: "0.2s ease",
        "&:hover": {
          color: "white",
        },
      }}
    >
      {label}
    </Typography>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <IconButton
      sx={{
        width: 42,
        height: 42,
        color: "white",
        bgcolor: "#111827",
        border: "1px solid #1f2937",
        transition: "0.2s ease",
        "&:hover": {
          bgcolor: "primary.main",
          transform: "translateY(-3px)",
        },
      }}
    >
      {icon}
    </IconButton>
  );
}
