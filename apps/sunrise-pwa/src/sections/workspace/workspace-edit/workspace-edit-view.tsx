"use client";

import type { IWorkspaceItem, IWorkspacePayload } from "src/types/workspace";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { updateWorkspace, getWorkspaceById } from "src/api/workspace-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import WorkspaceForm from "src/components/sunrise/core/workspace/WorkspaceForm";

type IWorkspaceResponse = {
  data: IWorkspaceItem;
};

type WorkspaceEditViewProps = {
  workspaceId: string;
};

export default function WorkspaceEditView({ workspaceId }: WorkspaceEditViewProps) {
  const { push } = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const settings = useSettingsContext();
  const queryClient = useQueryClient();
  let workspaceData: IWorkspaceItem = {} as IWorkspaceItem;

  const {
    data,
    isLoading: isLoadingWorkspace,
    isSuccess,
  } = useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
  });

  if (isSuccess) {
    ({ data: workspaceData } = data);
  }

  const workspaceMutation = useMutation(
    (workspace: IWorkspacePayload) => updateWorkspace(workspaceId, workspace),
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

  const isSubmitLoading = workspaceMutation.isLoading || isNavigating;

  if (isLoadingWorkspace) {
    return <LoadingScreen height="50vh" message="Loading Workspace ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <WorkspaceForm
        isLoading={isSubmitLoading}
        onSubmit={handleSubmit}
        workspace={workspaceData}
      />
    </Container>
  );
}
