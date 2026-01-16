"use client";

//
import type { WorkspaceContextType } from "src/types/workspace";

import { createContext } from "react";

// ----------------------------------------------------------------------

export const WorkspaceContext = createContext({} as WorkspaceContextType);
