"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

type AddToCartButtonProps = {
  productId: number;
  productName: string;
  quantity: number;
};

export default function AddToCartButton({
  productId,
  productName,
  quantity,
}: AddToCartButtonProps) {

  const isOutOfStock = quantity <= 0;

  const handleAddToCart = async () => {

    try {

      const token = Cookies.get("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      // DECODE USER
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const customerId = payload.sub;

      // API
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/cart/${customerId}/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `${productName} added to cart`
      );

    } catch (error: any) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to add cart"
      );
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      disabled={isOutOfStock}
      startIcon={<ShoppingCartIcon />}
      onClick={handleAddToCart}
      sx={{
        py: 1.2,
        fontWeight: 900,
        bgcolor: isOutOfStock
          ? "#9ca3af"
          : "primary.main",
      }}
    >
      {isOutOfStock
        ? "Unavailable"
        : "Add to Cart"}
    </Button>
  );
}