"use client";

import { useContext } from "react";

//
import { WorkspaceContext } from "src/contexts/workspace/workspace-context";

// ----------------------------------------------------------------------

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);

  if (!context) throw new Error("useWorkspaceContext context must be use inside AuthProvider");

  return context;
};
