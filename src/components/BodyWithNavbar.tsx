"use client";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BodyWithNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  useEffect(() => {
    setShowNavbar(!(pathname === "/login" || pathname === "/register"));
  }, [pathname]);
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
} 