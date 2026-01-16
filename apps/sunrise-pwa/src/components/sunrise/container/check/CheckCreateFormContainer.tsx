import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "src/components/loading-screen";

import CheckForm from "../../core/check/CheckForm";
import { useCreateCheck } from "../../hook/useChecks";
import { useGetFixedAssetById } from "../../hook/useFixedAssets";

type CheckCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function CheckCreateFormContainer({
  workspaceId,
  onSuccess,
}: CheckCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const searchParams = useSearchParams();
  const fixedAssetId = searchParams.get("fixed-asset-id") || "";
  const { data: fixedAssetData, isLoading: fixedAssetDataLoading } = useGetFixedAssetById(
    workspaceId,
    fixedAssetId
  );

  const checkCreateMutation = useCreateCheck({
    onSuccess: () => {
      enqueueSnackbar("Check saved", {
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

  const handleSubmit = (checkPayload: any) => {
    setSubmitErrors([]);
    checkCreateMutation.mutate(checkPayload);
  };

  if (fixedAssetId && fixedAssetDataLoading)
    return <LoadingScreen message="Loading Fixed Asset ..." />;

  return (
    <CheckForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      defaultCheck={{ fixed_asset: fixedAssetData?.data }}
      isLoading={checkCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
