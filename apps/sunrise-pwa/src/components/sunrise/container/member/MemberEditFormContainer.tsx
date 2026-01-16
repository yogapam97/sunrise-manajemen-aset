import { useState } from "react";
import { useSnackbar } from "notistack";

import { LoadingScreen } from "src/components/loading-screen";

import MemberForm from "../../core/member/MemberForm";
import { useUpdateMember, useGetMemberById } from "../../hook/useMembers";

type MemberEditFormContainerProps = {
  workspaceId: string;
  memberId: string;
  onSuccess?: () => void;
};
export default function MemberEditFormContainer({
  workspaceId,
  memberId,
  onSuccess,
}: MemberEditFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const { data: member, isLoading: memberLoading } = useGetMemberById(memberId);

  const memberInviteMutation = useUpdateMember(memberId, {
    onSuccess: () => {
      enqueueSnackbar("Member updated", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });

  const handleSubmit = (memberPayload: any) => {
    setSubmitErrors([]);
    memberInviteMutation.mutate(memberPayload);
  };

  if (memberLoading) {
    return <LoadingScreen height="50vh" message="Loading Member ..." />;
  }
  return (
    <MemberForm
      submitErrors={submitErrors}
      loading={memberInviteMutation.isLoading}
      onSubmit={handleSubmit}
      defaultMember={member?.data}
    />
  );
}
