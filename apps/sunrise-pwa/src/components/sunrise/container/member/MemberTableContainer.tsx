import { useSnackbar } from "notistack";
import { useState, useCallback } from "react";

import MemberListTable from "../../core/member/MemberListTable";
import {
  useDeleteMember,
  useGetAllMembers,
  useResetPasswordMember,
  useResendInvitationMember,
} from "../../hook/useMembers";

type MemberTableContainerProps = {
  workspaceId: string;
};
export default function MemberTableContainer({ workspaceId }: MemberTableContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: membersData, isLoading } = useGetAllMembers(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  const resetPassowrdMutation = useResetPasswordMember(workspaceId, {
    onSuccess: () => {
      enqueueSnackbar("Password reset send", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, {
        variant: "error",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    },
  });

  const resendInvitationMutation = useResendInvitationMember(workspaceId, {
    onSuccess: () => {
      enqueueSnackbar("Invitation resend", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, {
        variant: "error",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    },
  });
  const deleteMutation = useDeleteMember();

  const handleResendInvitation = useCallback(
    (memberId: string) => {
      resendInvitationMutation.mutate(memberId);
    },
    [resendInvitationMutation]
  );

  const handleResetPassword = useCallback(
    (memberId: string) => {
      resetPassowrdMutation.mutate(memberId);
    },
    [resetPassowrdMutation]
  );

  const handleDeleteMember = useCallback(
    (memberId: string) => {
      deleteMutation.mutate(memberId);
    },
    [deleteMutation]
  );

  return (
    <MemberListTable
      workspaceId={workspaceId}
      members={membersData?.data}
      pagination={membersData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteMember}
      onSearch={setSearch}
      onLimitChange={(newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
      }}
      onPageChange={setPage}
      onSortChange={setSort}
      onResendInvitation={handleResendInvitation}
      onResetPassword={handleResetPassword}
    />
  );
}
