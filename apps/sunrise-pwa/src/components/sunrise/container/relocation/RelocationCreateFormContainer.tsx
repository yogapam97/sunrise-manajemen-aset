import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "src/components/loading-screen";

import { useCreateRelocation } from "../../hook/useRelocations";
import { useGetFixedAssetById } from "../../hook/useFixedAssets";
import RelocationForm from "../../core/relocation/RelocationForm";

type RelocationCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function RelocationCreateFormContainer({
  workspaceId,
  onSuccess,
}: RelocationCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const searchParams = useSearchParams();
  const fixedAssetId = searchParams.get("fixed-asset-id") || "";
  const { data: fixedAssetData, isLoading: fixedAssetDataLoading } = useGetFixedAssetById(
    workspaceId,
    fixedAssetId
  );

  const relocationCreateMutation = useCreateRelocation({
    onSuccess: () => {
      enqueueSnackbar("Relocation saved", {
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

  const handleSubmit = (relocationPayload: any) => {
    setSubmitErrors([]);
    relocationCreateMutation.mutate(relocationPayload);
  };

  if (fixedAssetId && fixedAssetDataLoading)
    return <LoadingScreen message="Loading Fixed Asset ..." />;

  return (
    <RelocationForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      defaultRelocation={{ fixed_asset: fixedAssetData?.data }}
      isLoading={relocationCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
