"use client";

// "use client";

// import Link from "next/link";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";

// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import Stack from "@mui/material/Stack";

// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DashboardSection from "../app/dashboard/seller/DashboardSection";

// export default function Header() {

//   // Mounted State
//   const [mounted, setMounted] = useState(false);

//   // Token State
//   const [token, setToken] = useState<
//     string | undefined
//   >();

//   useEffect(() => {
//     setMounted(true);

//     const savedToken = Cookies.get("token");

//     setToken(savedToken);
//   }, []);

//   // Prevent Hydration Error
//   if (!mounted) return null;

//   const navItems = [
//     { label: "Home", href: "/" },
//     { label: "Products", href: "/products" },
//     { label: "Sellers", href: "/sellers" },
//     { label: "About", href: "/about" },
//   ];

//   // Logout Function
//   const handleLogout = () => {
//     Cookies.remove("token");
//     Cookies.remove("role");

//     setToken(undefined);

//     // Full Reload
//     window.location.href = "/login";
//   };

//   return (
//     <AppBar
//       position="sticky"
//       elevation={0}
//       sx={{
//         bgcolor: "rgba(255,255,255,0.9)",
//         backdropFilter: "blur(14px)",
//         borderBottom: "1px solid #e5e7eb",
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar
//           disableGutters
//           sx={{
//             py: 1.2,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           {/* Logo */}
//           <Box
//             component={Link}
//             href="/"
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//               textDecoration: "none",
//             }}
//           >
//             <Box
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: 3,
//                 bgcolor: "primary.main",
//                 color: "white",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <ShoppingBagIcon />
//             </Box>

//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: 900,
//                 color: "text.primary",
//                 letterSpacing: "-0.5px",
//               }}
//             >
//               NexCart
//             </Typography>
//           </Box>

//           {/* Nav Items */}
//           <Stack
//             direction="row"
//             spacing={4}
//             sx={{
//               display: { xs: "none", md: "flex" },
//               alignItems: "center",
//             }}
//           >
//             {navItems.map((item) => (
//               <Typography
//                 key={item.label}
//                 component={Link}
//                 href={item.href}
//                 sx={{
//                   color: "text.secondary",
//                   textDecoration: "none",
//                   fontSize: 15,
//                   fontWeight: 600,
//                   transition: "0.2s",

//                   "&:hover": {
//                     color: "primary.main",
//                   },
//                 }}
//               >
//                 {item.label}
//               </Typography>
//             ))}
//           </Stack>

//           {/* Auth Buttons */}
//           <Stack direction="row" spacing={1.5}>

//             {!token ? (
//               <>
//                 {/* Login */}
//                 <Button
//                   component={Link}
//                   href="/login"
//                   variant="outlined"
//                   sx={{
//                     borderColor: "#d1d5db",
//                     color: "text.primary",

//                     "&:hover": {
//                       borderColor: "primary.main",
//                       color: "primary.main",
//                       bgcolor: "white",
//                     },
//                   }}
//                 >
//                   Login
//                 </Button>

//                 {/* Register */}
//                 <Button
//                   component={Link}
//                   href="/register"
//                   variant="contained"
//                 >
//                   Register
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </Button>
//             )}

//           </Stack>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// "use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { LayoutDashboard } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Mounted State
  const [mounted, setMounted] = useState(false);

  // Token State
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  useEffect(() => {
    setMounted(true);
    setToken(Cookies.get("token"));
    setRole(Cookies.get("role"));
  }, [pathname]);

  // Load token whenever route changes
  useEffect(() => {
    setMounted(true);

    const savedToken = Cookies.get("token");

    setToken(savedToken);
  }, [pathname]);

  // Prevent Hydration Error
  if (!mounted) return null;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Sellers", href: "/sellers" },
    { label: "About", href: "/about" },
  ];

  // Logout Function
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("seller");
    Cookies.remove("customer");

    setToken(undefined);

    router.push("/login");
    router.refresh();
  };
  const goToDashboard = () => {
    const path = role ? `/dashboard/${role}` : "/dashboard";
    router.push(path);
  
  };
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            py: 1.2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBagIcon />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                letterSpacing: "-0.5px",
              }}
            >
              NexCart
            </Typography>
          </Box>

          {/* Nav Items */}
          <Stack
            direction="row"
            spacing={4}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  transition: "0.2s",

                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          {/* Auth Buttons */}
          <Stack direction="row" spacing={1.5}>
            {!token ? (
              <>
                {/* Login */}
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
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
                  Login
                </Button>

                {/* Register */}
                <Button component={Link} href="/register" variant="contained">
                  Register
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={goToDashboard}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm w-full text-left"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                  {role && (
                    <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-md capitalize">
                      {role}
                    </span>
                  )}
                </button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
