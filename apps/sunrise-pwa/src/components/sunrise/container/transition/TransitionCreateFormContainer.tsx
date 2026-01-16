import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "src/components/loading-screen";

import { useCreateTransition } from "../../hook/useTransitions";
import { useGetFixedAssetById } from "../../hook/useFixedAssets";
import TransitionForm from "../../core/transition/TransitionForm";

type TransitionCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function TransitionCreateFormContainer({
  workspaceId,
  onSuccess,
}: TransitionCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const searchParams = useSearchParams();
  const fixedAssetId = searchParams.get("fixed-asset-id") || "";
  const { data: fixedAssetData, isLoading: fixedAssetDataLoading } = useGetFixedAssetById(
    workspaceId,
    fixedAssetId
  );

  const transitionCreateMutation = useCreateTransition({
    onSuccess: () => {
      enqueueSnackbar("Transition saved", {
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

  const handleSubmit = (transitionPayload: any) => {
    setSubmitErrors([]);
    transitionCreateMutation.mutate(transitionPayload);
  };

  if (fixedAssetId && fixedAssetDataLoading)
    return <LoadingScreen message="Loading Fixed Asset ..." />;

  return (
    <TransitionForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      defaultTransition={{ fixed_asset: fixedAssetData?.data }}
      isLoading={transitionCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
