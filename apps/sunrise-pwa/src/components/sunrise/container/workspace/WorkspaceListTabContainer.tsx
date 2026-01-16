import { useState } from "react";
import nProgress from "nprogress";
import { useSnackbar } from "notistack";
import { useRouter, useSearchParams } from "next/navigation";

import { paths } from "src/routes/paths";

import WorkspaceListTab from "../../core/workspace/WorkspaceListTab";
import {
  useJoinWorkspace,
  useRejectWorkspace,
  useGetAllWorkspaces,
  useGetAllInvitedWorkspaces,
} from "../../hook/useWorkspaces";

export default function WorkspaceListTabContainer() {
  const [workspaceTab, setWorkspaceTab] = useState(useSearchParams().get("tab") || "myWorkspace");
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const { push } = useRouter();

  const {
    data: myWorkspaceData,
    isLoading: myWorkspaceIsLoading,
    isSuccess: myWorkspaceIsSuccess,
    refetch: refetchMyWorkspace,
  } = useGetAllWorkspaces(search, workspaceTab === "myWorkspace");

  const {
    data: invitedData,
    isLoading: invitedIsLoading,
    isSuccess: invitedIsSuccess,
    refetch: refetchInvited,
  } = useGetAllInvitedWorkspaces(search, true);

  const joinWorkspaceMutation = useJoinWorkspace({
    onSuccess: (response: any) => {
      const { workspaceId } = response;
      refetchMyWorkspace();
      nProgress.start();
      push(paths.workspace.detail(workspaceId));
      enqueueSnackbar("Workspace joined successfully", { variant: "success" });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar("Failed to join workspace", { variant: "error" });
    },
  });

  const rejectWorkspaceMutation = useRejectWorkspace({
    onSuccess: () => {
      refetchInvited();
      enqueueSnackbar("Workspace rejected", { variant: "success" });
    },
    onError: (error: any) => {
      enqueueSnackbar("Failed to reject workspace", { variant: "error" });
    },
  });

  const handleJoinWorkspace = (workspaceId: string) => {
    joinWorkspaceMutation.mutate(workspaceId);
  };
  const handleRejectWorkspace = (workspaceId: string) => {
    rejectWorkspaceMutation.mutate(workspaceId);
  };

  return (
    <WorkspaceListTab
      myWorkspaceIsLoading={myWorkspaceIsLoading}
      myWorkspaceData={myWorkspaceData}
      myWorkspaceIsSuccess={myWorkspaceIsSuccess}
      invitedData={invitedData}
      invitedIsLoading={invitedIsLoading}
      invitedIsSuccess={invitedIsSuccess}
      onSearch={setSearch}
      search={search}
      onChangeTab={setWorkspaceTab}
      tab={workspaceTab}
      onJoinWorkspace={handleJoinWorkspace}
      onRejectWorkspace={handleRejectWorkspace}
    />
  );
}
