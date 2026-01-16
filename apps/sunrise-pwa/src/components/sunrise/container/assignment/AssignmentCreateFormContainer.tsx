import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "src/components/loading-screen";

import { useCreateAssignment } from "../../hook/useAssignments";
import { useGetFixedAssetById } from "../../hook/useFixedAssets";
import AssignmentForm from "../../core/assignment/AssignmentForm";

type AssignmentCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function AssignmentCreateFormContainer({
  workspaceId,
  onSuccess,
}: AssignmentCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const searchParams = useSearchParams();
  const fixedAssetId = searchParams.get("fixed-asset-id") || "";
  const { data: fixedAssetData, isLoading: fixedAssetDataLoading } = useGetFixedAssetById(
    workspaceId,
    fixedAssetId
  );

  const assignmentCreateMutation = useCreateAssignment({
    onSuccess: () => {
      enqueueSnackbar("Assignment saved", {
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

  const handleSubmit = (assignmentPayload: any) => {
    setSubmitErrors([]);
    assignmentCreateMutation.mutate(assignmentPayload);
  };

  if (fixedAssetId && fixedAssetDataLoading)
    return <LoadingScreen message="Loading Fixed Asset ..." />;

  return (
    <AssignmentForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      defaultAssignment={{ fixed_asset: fixedAssetData?.data }}
      isLoading={assignmentCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
