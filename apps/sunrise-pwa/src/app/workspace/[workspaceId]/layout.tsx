"use client";

// auth
import { AuthGuard } from "src/auth/guard";
// components
import WorkspaceGuard from "src/auth/guard/workspace-guard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <WorkspaceGuard>{children}</WorkspaceGuard>
    </AuthGuard>
  );
}
