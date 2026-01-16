import type { IWorkspaceItem } from "src/types/workspace";

import axios from "src/utils/axios";

export const setActiveWorkspace = (workspace: IWorkspaceItem | null) => {
  if (workspace && workspace.id) {
    sessionStorage.setItem("workspace", JSON.stringify(workspace));

    axios.defaults.headers.common["X-Workspace-Id"] = workspace.id;
  } else {
    sessionStorage.removeItem("workspace");

    delete axios.defaults.headers.common["X-Workspace-Id"];
  }
};
