import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Card } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { LoadingScreen } from "src/components/loading-screen";

import { useGetMetricById } from "../../hook/useMetrics";
import MetricDetailTable from "../../core/metric/MetricDetailTable";
import OperationLogTableContainer from "../operation-log/OperationLogTableContainer";

type MetricDetailContainerProps = {
  workspaceId: string;
  metricId: string;
};
export default function MetricDetailContainer({
  workspaceId,
  metricId,
}: MetricDetailContainerProps) {
  const [tabValue, setTabValue] = useState(useSearchParams().get("tab") || "detail");
  const [filter, setFilter] = useState({ operation_group: [metricId] });
  const operationLogFullScreen = useBoolean();

  const { data: metricData, isLoading: metricLoading } = useGetMetricById(metricId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  if (metricLoading) {
    return <LoadingScreen message="Loading Metric ..." />;
  }

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Detail" value="detail" />
            {/* <Tab label="Operation Log" value="operation-log" /> */}
          </TabList>
        </Box>
      </TabContext>
      <Box sx={{ mt: 1 }}>
        {tabValue === "detail" && (
          <Card>
            <MetricDetailTable workspaceId={workspaceId} metric={metricData?.data} />
          </Card>
        )}
        {tabValue === "operation-log" && (
          <OperationLogTableContainer
            workspaceId={workspaceId}
            filter={filter}
            onFilter={(newFilter: any) => setFilter({ ...newFilter, operation_group: [metricId] })}
            config={{ hideFilterMetric: true }}
            onFullScreen={operationLogFullScreen.onTrue}
          />
        )}
      </Box>
    </Box>
  );
}
