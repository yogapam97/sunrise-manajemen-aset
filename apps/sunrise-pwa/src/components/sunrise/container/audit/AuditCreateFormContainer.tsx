import { useState } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "src/components/loading-screen";

import AuditForm from "../../core/audit/AuditForm";
import { useCreateAudit } from "../../hook/useAudits";
import { useGetFixedAssetById } from "../../hook/useFixedAssets";

type AuditCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function AuditCreateFormContainer({
  workspaceId,
  onSuccess,
}: AuditCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const searchParams = useSearchParams();
  const fixedAssetId = searchParams.get("fixed-asset-id") || "";
  const { data: fixedAssetData, isLoading: fixedAssetDataLoading } = useGetFixedAssetById(
    workspaceId,
    fixedAssetId
  );

  const auditCreateMutation = useCreateAudit({
    onSuccess: () => {
      enqueueSnackbar("Audit saved", {
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

  const handleSubmit = (auditPayload: any) => {
    setSubmitErrors([]);
    auditCreateMutation.mutate(auditPayload);
  };

  if (fixedAssetId && fixedAssetDataLoading)
    return <LoadingScreen message="Loading Fixed Asset ..." />;

  return (
    <AuditForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      defaultAudit={{ fixed_asset: fixedAssetData?.data }}
      isLoading={auditCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
