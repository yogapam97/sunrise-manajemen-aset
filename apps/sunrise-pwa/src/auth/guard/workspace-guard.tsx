// routes

//
import type { IWorkspaceItem } from "src/types/workspace";

import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useGetMyWorkspace } from "src/components/sunrise/hook/useWorkspaces";

import { useWorkspaceContext } from "../hooks";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function WorkspaceGuard({ children }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const { setWorkspace, setMember } = useWorkspaceContext();
  const currentWorkspace = sessionStorage.getItem("workspace");
  const workspace: IWorkspaceItem = JSON.parse(currentWorkspace as string);
  const {
    data: workspaceData,
    isSuccess,
    isError,
  } = useGetMyWorkspace(workspace?.id as string, {});

  useEffect(() => {
    if (isSuccess) {
      if (!isEmpty(workspaceData?.data)) {
        setWorkspace(workspaceData?.data?.workspace);
        setMember(workspaceData?.data?.member);
      } else {
        push(paths.workspace.root);
        enqueueSnackbar("Invalid workspace, contact your workspace owner", {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
        });
      }
    }
    if (isError) {
      push(paths.workspace.root);
      enqueueSnackbar("Invalid workspace, contact your workspace owner", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
      });
    }
  }, [isSuccess, isError, workspaceData, push, setWorkspace, enqueueSnackbar, setMember]);

  return <>{children}</>;
}
