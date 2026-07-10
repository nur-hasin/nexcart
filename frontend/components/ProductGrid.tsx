import Link from "next/link";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import ProductFilterBar from "./ProductFilterBar";
import AddToCartButton from "./AddToCartButton";

export type SellerShop = {
  id: number;
  shopName: string;
  shopAddress: string;
  tradeLicense: string;
};

export type Product = {
  id: number;
  productName: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  productImage?: string | null;
  sellerShop?: SellerShop | null;
};

export type PriceFilter = "default" | "lowToHigh" | "highToLow";

const API_BASE_URL = "http://localhost:3000";

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
];

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
}

type ProductGridProps = {
  selectedCategory?: string;
  priceFilter?: PriceFilter;
};

export default async function ProductGrid({
  selectedCategory = "all",
  priceFilter = "default",
}: ProductGridProps) {
  const products = await getProducts();

  let filteredProducts = [...products];

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  if (priceFilter === "highToLow") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#ffffff",
        py: {
          xs: 7,
          md: 10,
        },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: 5,
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: {
              xs: "flex-start",
              md: "flex-end",
            },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Chip
              label="Latest Products"
              sx={{
                mb: 2,
                bgcolor: "#dcfce7",
                color: "primary.dark",
                fontWeight: 800,
              }}
            />

            <Typography
              component="h2"
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: "-1px",
                color: "text.primary",
                fontSize: {
                  xs: "2rem",
                  md: "3rem",
                },
              }}
            >
              Shop New Arrivals
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                color: "text.secondary",
                maxWidth: 620,
                lineHeight: 1.7,
              }}
            >
              Explore products uploaded by NexCart sellers with real-time
              availability, shop information, category filter, and price
              sorting.
            </Typography>
          </Box>

          <Link href="/products" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              sx={{
                color: "text.primary",
                borderColor: "#d1d5db",
                bgcolor: "white",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "white",
                },
              }}
            >
              View All Products
            </Button>
          </Link>
        </Box>

        <ProductFilterBar
          categories={PRODUCT_CATEGORIES}
          selectedCategory={selectedCategory}
          priceFilter={priceFilter}
        />

        {products.length > 0 && (
          <Typography
            sx={{
              mb: 2,
              color: "text.secondary",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Showing {filteredProducts.length} of {products.length} products
          </Typography>
        )}

        {filteredProducts.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 2,
              textAlign: "center",
              bgcolor: "#f9fafb",
              border: "1px dashed #d1d5db",
            }}
          >
            <Inventory2OutlinedIcon
              sx={{
                fontSize: 58,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography component="h3" variant="h5" sx={{ fontWeight: 900 }}>
              No products found
            </Typography>

            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Try changing the category or price filter.
            </Typography>
          </Paper>
        )}

        {filteredProducts.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = Number(product.quantity) <= 0;

  const imageUrl = product.productImage
    ? `${API_BASE_URL}/uploads/products/${product.productImage}`
    : "";

  return (
    <Paper
      component="article"
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: 2,
        bgcolor: "white",
        border: "1px solid #e5e7eb",
        transition: "0.25s ease",
        position: "relative",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          borderColor: "#86efac",
        },
        "&:hover .cart-overlay": {
          opacity: 1,
          transform: "translateY(0)",
        },
        "&:hover .product-image": {
          transform: "scale(1.06)",
        },
      }}
    >
      <Box
        sx={{
          height: 220,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#f9fafb",
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={`${product.productName} product image`}
            className="product-image"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "0.35s ease",
            }}
          />
        ) : (
          <Box
            className="product-image"
            sx={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 55%, #ffffff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.35s ease",
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 58, color: "primary.main" }} />
          </Box>
        )}

        <Chip
          label={isOutOfStock ? "Out of Stock" : "In Stock"}
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            bgcolor: isOutOfStock ? "#fee2e2" : "#dcfce7",
            color: isOutOfStock ? "#b91c1c" : "#15803d",
            fontWeight: 900,
          }}
        />

        <Box
          className="cart-overlay"
          sx={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 14,
            opacity: 0,
            transform: "translateY(10px)",
            transition: "0.25s ease",
          }}
        >
          <AddToCartButton
            productName={product.productName}
            quantity={Number(product.quantity)}
             productId={product.id}     />
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: 13,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {product.category}
        </Typography>

        <Box
          sx={{
            mt: 0.8,
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            color: "text.secondary",
          }}
        >
          <StorefrontIcon sx={{ fontSize: 17, color: "primary.main" }} />

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.sellerShop?.shopName || "No shop assigned"}
          </Typography>
        </Box>

        {product.sellerShop?.shopAddress && (
          <Box
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              color: "text.secondary",
            }}
          >
            <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />

            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.sellerShop.shopAddress}
            </Typography>
          </Box>
        )}

        <Typography
          component="h3"
          variant="h6"
          sx={{
            mt: 1,
            fontWeight: 900,
            lineHeight: 1.35,
            color: "text.primary",
            minHeight: 52,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.productName}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
            fontSize: 14,
            lineHeight: 1.6,
            minHeight: 44,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description || "No description available."}
        </Typography>

        <Box
          sx={{
            mt: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Price
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "text.primary",
              }}
            >
              ৳{Number(product.price).toLocaleString()}
            </Typography>
          </Box>

          <Link
            href={`/products/${product.id}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              sx={{
                borderColor: "#d1d5db",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "white",
                },
              }}
            >
              View
            </Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}