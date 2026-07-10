import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export const metadata: Metadata = {
  title: "NexCart",
  description:
    "Modern ecommerce platform for customers, sellers, riders and admins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Providers>{children}</Providers>
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}