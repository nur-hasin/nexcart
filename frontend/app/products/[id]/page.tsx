import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Link from "next/link";

import AddToCartButton from "@/components/AddToCartButton";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type SellerShop = {
  id: number;
  shopName: string;
  shopAddress: string;
  tradeLicense: string;
};

type Product = {
  id: number;
  productName: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  productImage?: string | null;
  sellerShop?: SellerShop | null;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data?.data || data;
  } catch {
    return null;
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Product Not Found
          </Typography>

          <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
            The product you are looking for does not exist.
          </Typography>

          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="contained"
              sx={{
                mt: 4,
                bgcolor: "primary.main",
              }}
            >
              Back To Home
            </Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  const imageUrl = product.productImage
    ? `${API_BASE_URL}/uploads/products/${product.productImage}`
    : "";

  const isOutOfStock = Number(product.quantity) <= 0;

  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        py: {
          xs: 6,
          md: 10,
        },
      }}
    >
      <Container maxWidth="lg">
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 4,
              color: "text.primary",
            }}
          >
            Back
          </Button>
        </Link>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
            }}
          >
            {/* LEFT IMAGE */}
            <Box
              sx={{
                bgcolor: "#ffffff",
                minHeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {imageUrl ? (
                <Box
                  component="img"
                  src={imageUrl}
                  alt={product.productName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <ShoppingCartIcon
                  sx={{
                    fontSize: 100,
                    color: "primary.main",
                  }}
                />
              )}

              <Chip
                label={isOutOfStock ? "Out of Stock" : "In Stock"}
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  bgcolor: isOutOfStock ? "#fee2e2" : "#dcfce7",
                  color: isOutOfStock ? "#b91c1c" : "#15803d",
                  fontWeight: 900,
                }}
              />
            </Box>

            {/* RIGHT CONTENT */}
            <Box
              sx={{
                p: {
                  xs: 3,
                  md: 5,
                },
              }}
            >
              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: 13,
                }}
              >
                {product.category}
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  mt: 1.5,
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                {product.productName}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 3,
                  fontWeight: 900,
                }}
              >
                ৳{Number(product.price).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                {product.description || "No description available."}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Inventory2OutlinedIcon color="primary" />

                  <Typography sx={{ fontWeight: 700 }}>
                    Available Quantity: {product.quantity}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <StorefrontIcon color="primary" />

                  <Typography sx={{ fontWeight: 700 }}>
                    {product.sellerShop?.shopName || "No Shop"}
                  </Typography>
                </Box>

                {product.sellerShop?.shopAddress && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocationOnIcon color="action" />

                    <Typography color="text.secondary">
                      {product.sellerShop.shopAddress}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 5 }}>
                <AddToCartButton
                  productName={product.productName}
                  quantity={Number(product.quantity)}
                  productId={0}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}