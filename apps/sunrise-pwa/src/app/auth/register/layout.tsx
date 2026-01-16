"use client";

// components
import AuthClassicLayout from "src/layouts/auth/classic";

// auth
import { GuestGuard } from "src/auth/guard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthClassicLayout title="Manage the job more effectively with Minimal">
        {children}
      </AuthClassicLayout>
    </GuestGuard>
  );
}
