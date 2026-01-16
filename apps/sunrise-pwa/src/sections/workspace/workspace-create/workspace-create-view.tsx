"use client";

import type { IWorkspaceItem, IWorkspacePayload } from "src/types/workspace";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { createWorkspace } from "src/api/workspace-api";

import { useSettingsContext } from "src/components/settings";
import WorkspaceForm from "src/components/sunrise/core/workspace/WorkspaceForm";

type IWorkspaceResponse = {
  data: IWorkspaceItem;
};

export default function WorkspaceCreateView() {
  const { push } = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const settings = useSettingsContext();
  const queryClient = useQueryClient();
  const workspaceMutation = useMutation(
    (workspace: IWorkspacePayload) => createWorkspace(workspace),
    {
      onSuccess: ({ data: workspace }: IWorkspaceResponse) => {
        setIsNavigating(true);
        push(`${paths.workspace.detail(workspace.id as string)}`);
        queryClient.invalidateQueries(["workspaces"]);
      },
    }
  );

  const handleSubmit = useCallback(
    (workspacePayload: IWorkspacePayload) => {
      workspaceMutation.mutate(workspacePayload);
    },
    [workspaceMutation]
  );

  const isLoading = workspaceMutation.isLoading || isNavigating;

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <WorkspaceForm isLoading={isLoading} onSubmit={handleSubmit} />
    </Container>
  );
}
