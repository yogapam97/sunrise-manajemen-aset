import { useState } from "react";
import { useSnackbar } from "notistack";

import MetricForm from "../../core/metric/MetricForm";
import { useCreateMetric } from "../../hook/useMetrics";

type MetricCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function MetricCreateFormContainer({
  workspaceId,
  onSuccess,
}: MetricCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const metricCreateMutation = useCreateMetric({
    onSuccess: () => {
      enqueueSnackbar("Metric saved", {
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

  const handleSubmit = (metricPayload: any) => {
    setSubmitErrors([]);
    metricCreateMutation.mutate(metricPayload);
  };

  return (
    <MetricForm
      submitErrors={submitErrors}
      isLoading={metricCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
