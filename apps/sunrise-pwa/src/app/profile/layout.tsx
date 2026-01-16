"use client";

import WorkspaceLayout from "src/layouts/workspace/layout";

// auth
import { AuthGuard } from "src/auth/guard";
// components

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </AuthGuard>
  );
}
