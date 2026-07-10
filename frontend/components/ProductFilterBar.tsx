"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import TuneIcon from "@mui/icons-material/Tune";

import type { PriceFilter } from "./ProductGrid";

type ProductFilterBarProps = {
  categories: string[];
  selectedCategory: string;
  priceFilter: PriceFilter;
};

export default function ProductFilterBar({
  categories,
  selectedCategory,
  priceFilter,
}: ProductFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || value === "default") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    updateFilter("category", event.target.value);
  };

  const handlePriceChange = (event: SelectChangeEvent) => {
    updateFilter("price", event.target.value);
  };

  const handleClearFilters = () => {
    router.push(pathname, {
      scroll: false,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        bgcolor: "#f9fafb",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: {
          xs: "stretch",
          md: "center",
        },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "text.primary",
        }}
      >
        <TuneIcon sx={{ color: "primary.main" }} />

        <Typography sx={{ fontWeight: 900 }}>Filter Products</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          width: {
            xs: "100%",
            md: "auto",
          },
        }}
      >
        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 190,
            },
            bgcolor: "white",
          }}
        >
          <InputLabel>Category</InputLabel>

          <Select
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="all">All Categories</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              sm: 190,
            },
            bgcolor: "white",
          }}
        >
          <InputLabel>Price</InputLabel>

          <Select label="Price" value={priceFilter} onChange={handlePriceChange}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="lowToHigh">Low to High</MenuItem>
            <MenuItem value="highToLow">High to Low</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={handleClearFilters}
          sx={{
            borderColor: "#d1d5db",
            color: "text.primary",
            bgcolor: "white",
            "&:hover": {
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: "white",
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
}