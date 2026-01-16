"use client";

// components
import { LoadingScreen } from "src/components/loading-screen";

//
import { WorkspaceContext } from "./workspace-context";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function WorkspaceConsumer({ children }: Props) {
  return (
    <WorkspaceContext.Consumer>
      {(workspace) =>
        workspace.loading ? <LoadingScreen message="Preparing Something Great! ..." /> : children
      }
    </WorkspaceContext.Consumer>
  );
}
