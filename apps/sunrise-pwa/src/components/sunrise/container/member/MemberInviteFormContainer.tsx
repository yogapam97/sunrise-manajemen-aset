import { useState } from "react";
import { useSnackbar } from "notistack";

import MemberForm from "../../core/member/MemberForm";
import { useInviteMember } from "../../hook/useMembers";

type MemberInviteFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function MemberInviteFormContainer({
  workspaceId,
  onSuccess,
}: MemberInviteFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const memberInviteMutation = useInviteMember(workspaceId, {
    onSuccess: () => {
      enqueueSnackbar("Member invited", {
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

  return (
    <MemberForm
      submitErrors={submitErrors}
      loading={memberInviteMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
