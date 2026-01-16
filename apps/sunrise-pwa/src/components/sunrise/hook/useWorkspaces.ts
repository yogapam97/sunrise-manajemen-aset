import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  joinWorkspace,
  getMyWorkspace,
  rejectWorkspace,
  deleteWorkspace,
  selectWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  getInvitedWorkspaces,
} from "src/api/workspace-api";

export const useGetAllWorkspaces = (search: string, enabled: boolean = false) =>
  useQuery({
    queryKey: ["workspaces", search],
    queryFn: () => getAllWorkspaces({ search }),
    enabled,
  });

export const useSelectWorkspace = (workspaceId: string, options?: any) =>
  useQuery({
    queryKey: ["selectedWorkspace", workspaceId],
    queryFn: () => selectWorkspace(workspaceId),
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useGetWorkspaceById = (workspaceId: string, options: any) =>
  useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useGetMyWorkspace = (workspaceId: string, options: any) =>
  useQuery({
    queryKey: ["myWorkspace", workspaceId],
    queryFn: () => getMyWorkspace(workspaceId),
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useGetAllInvitedWorkspaces = (search: string, enabled: boolean = false) =>
  useQuery({
    queryKey: ["invitedWorkspace", search],
    queryFn: () => getInvitedWorkspaces({ search }),
    enabled,
  });

export const useJoinWorkspace = (options: any) => {
  const queryClient = useQueryClient();

  return useMutation((workspaceId: string) => joinWorkspace(workspaceId), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["workspaces"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useRejectWorkspace = (options: any) => {
  const queryClient = useQueryClient();

  return useMutation((workspaceId: string) => rejectWorkspace(workspaceId), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["workspaces"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export default function useChangeWorkspacePath() {
  const router = useRouter();

  const changeWorkspaceId = (newWorkspaceId: string) => {
    if (typeof window !== "undefined") {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const match = currentPath.match(/\/app\/([^/]+)(\/.*)?/);

        if (match) {
          const currentWorkspaceId = match[1];
          const newPath = currentPath.replace(currentWorkspaceId as string, newWorkspaceId);
          router.push(newPath);
        }
      }
    }
  };

  return changeWorkspaceId;
}

export const useDeleteWorkspace = (options: any) => {
  const queryClient = useQueryClient();

  return useMutation((workspaceId: string) => deleteWorkspace(workspaceId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["workspaces"]);
      if (options.onSuccess) options.onSuccess();
    },
  });
};
