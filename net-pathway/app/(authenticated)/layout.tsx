"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import ProtectedLayout from "@/components/ProtectedLayout";

// This layout applies to all authenticated routes
export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ProtectedLayout>{children}</ProtectedLayout>
      <Toaster position="top-right" />
    </>
  );
}
