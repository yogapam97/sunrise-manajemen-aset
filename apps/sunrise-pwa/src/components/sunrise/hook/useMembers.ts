import type { IMemberPayload } from "src/types/member";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createMember,
  deleteMember,
  updateMember,
  getAllMembers,
  getMemberById,
  resetPasswordMember,
  resendInvitationMember,
} from "src/api/member-api";

export const useGetAllMembers = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["members", search, limit, page, sort],
    queryFn: () => getAllMembers(workspaceId, { search, limit, page, sort }),
  });
};

export const useGetMemberById = (memberId: string) =>
  useQuery({
    queryKey: ["members", memberId],
    queryFn: () => getMemberById(memberId),
  });

export const useInviteMember = (workspaceId: string, options: any) => {
  const queryClient = useQueryClient();
  return useMutation((member: IMemberPayload) => createMember(workspaceId, member), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["members"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useUpdateMember = (memberId: string, options: any) => {
  const queryClient = useQueryClient();
  return useMutation((member: IMemberPayload) => updateMember(memberId, member), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["members"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useResetPasswordMember = (workspaceId: string, options: any) =>
  useMutation((memberId: string) => resetPasswordMember(workspaceId, memberId), {
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useResendInvitationMember = (workspaceId: string, options: any) =>
  useMutation((memberId: string) => resendInvitationMember(workspaceId, memberId), {
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation((memberId: string) => deleteMember(memberId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
    },
  });
};
