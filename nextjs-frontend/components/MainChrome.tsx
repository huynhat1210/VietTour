"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function MainChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="relative">{children}</main>
      <ChatWidget />
      <Footer />
    </>
  );
}
