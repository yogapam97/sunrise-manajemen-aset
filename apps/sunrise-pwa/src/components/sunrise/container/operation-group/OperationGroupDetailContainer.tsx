import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Card, Dialog, Button, DialogContent } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { LoadingScreen } from "src/components/loading-screen";

import { useGetOperationGroupById } from "../../hook/useOperationGroups";
import OperationLogTableContainer from "../operation-log/OperationLogTableContainer";
import OperationGroupDetailTable from "../../core/operation-group/OperationGroupDetailTable";

type OperationGroupDetailContainerProps = {
  workspaceId: string;
  operationGroupId: string;
};
export default function OperationGroupDetailContainer({
  workspaceId,
  operationGroupId,
}: OperationGroupDetailContainerProps) {
  const [tabValue, setTabValue] = useState(useSearchParams().get("tab") || "detail");
  const [filter, setFilter] = useState({ operation_group: [operationGroupId] });
  const operationLogFullScreen = useBoolean();

  const { data: operationGroupData, isLoading: operationGroupLoading } =
    useGetOperationGroupById(operationGroupId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  if (operationGroupLoading) {
    <LoadingScreen message="Loading operation group ..." />;
  }

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Detail" value="detail" />
            <Tab label="Operation Log" value="operation-log" />
          </TabList>
        </Box>
      </TabContext>
      <Box sx={{ mt: 1 }}>
        {tabValue === "detail" && (
          <Card>
            <OperationGroupDetailTable
              workspaceId={workspaceId}
              operationGroup={operationGroupData?.data}
            />
          </Card>
        )}
        {tabValue === "operation-log" && (
          <OperationLogTableContainer
            workspaceId={workspaceId}
            filter={filter}
            onFilter={(newFilter: any) =>
              setFilter({ ...newFilter, operation_group: [operationGroupId] })
            }
            config={{
              showFilterOperationType: true,
              showFilterAudit: true,
              showFilterAssignment: true,
              showFilterRelocation: true,
              showFilterTransition: true,
            }}
            onFullScreen={operationLogFullScreen.onTrue}
          />
        )}
      </Box>
      <Dialog
        fullScreen
        open={operationLogFullScreen.value}
        onClose={operationLogFullScreen.onFalse}
      >
        <DialogContent sx={{ p: 2 }}>
          <Card sx={{ p: 2 }}>
            <OperationLogTableContainer
              workspaceId={workspaceId}
              filter={filter}
              onFilter={(newFilter: any) =>
                setFilter({ ...newFilter, operation_group: [operationGroupId] })
              }
              config={{
                hideFullScreen: true,
                showFilterOperationType: true,
                showFilterAudit: true,
                showFilterAssignment: true,
                showFilterRelocation: true,
                showFilterTransition: true,
              }}
            />
          </Card>
        </DialogContent>
        <Button
          aria-label="close"
          onClick={operationLogFullScreen.onFalse}
          variant="outlined"
          sx={{
            position: "absolute",
            right: 20,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
          startIcon={<Iconify icon="solar:close-circle-outline" />}
        >
          Close
        </Button>
      </Dialog>
    </Box>
  );
}
