"use client";

// components
import DashboardLayout from "src/layouts/dashboard";

// auth
import { AuthGuard } from "src/auth/guard";
import WorkspaceGuard from "src/auth/guard/workspace-guard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <WorkspaceGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </WorkspaceGuard>
    </AuthGuard>
  );
}
