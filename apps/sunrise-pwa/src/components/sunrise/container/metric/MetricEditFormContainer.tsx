import { useState } from "react";
import { useSnackbar } from "notistack";

import { LoadingScreen } from "src/components/loading-screen";

import MetricForm from "../../core/metric/MetricForm";
import { useUpdateMetric, useGetMetricById } from "../../hook/useMetrics";

type MetricEditFormContainerProps = {
  workspaceId: string;
  metricId: string;
  onSuccess?: () => void;
};
export default function MetricEditFormContainer({
  workspaceId,
  metricId,
  onSuccess,
}: MetricEditFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const { data: metric, isLoading: metricLoading } = useGetMetricById(metricId);

  const metricEditMutation = useUpdateMetric(metricId, {
    onSuccess: () => {
      enqueueSnackbar("Metric updated", {
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
    metricEditMutation.mutate(metricPayload);
  };

  if (metricLoading) {
    return <LoadingScreen height="50vh" message="Loading Metric ..." />;
  }
  return (
    <MetricForm
      submitErrors={submitErrors}
      isLoading={metricEditMutation.isLoading}
      onSubmit={handleSubmit}
      defaultMetric={metric?.data}
    />
  );
}
