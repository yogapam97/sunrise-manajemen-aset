import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "src/components/loading-screen";

import { useGetFixedAssetById } from "../../hook/useFixedAssets";
import { useCreateMaintenance } from "../../hook/useMaintenances";
import MaintenanceForm from "../../core/maintenance/MaintenanceForm";

type MaintenanceCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function MaintenanceCreateFormContainer({
  workspaceId,
  onSuccess,
}: MaintenanceCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const searchParams = useSearchParams();
  const fixedAssetId = searchParams.get("fixed-asset-id") || "";
  const { data: fixedAssetData, isLoading: fixedAssetDataLoading } = useGetFixedAssetById(
    workspaceId,
    fixedAssetId
  );

  const maintenanceCreateMutation = useCreateMaintenance({
    onSuccess: () => {
      enqueueSnackbar("Maintenance saved", {
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

  const handleSubmit = (maintenancePayload: any) => {
    setSubmitErrors([]);
    maintenanceCreateMutation.mutate(maintenancePayload);
  };

  if (fixedAssetId && fixedAssetDataLoading)
    return <LoadingScreen message="Loading Fixed Asset ..." />;

  return (
    <MaintenanceForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      defaultMaintenance={{ fixed_asset: fixedAssetData?.data }}
      isLoading={maintenanceCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
