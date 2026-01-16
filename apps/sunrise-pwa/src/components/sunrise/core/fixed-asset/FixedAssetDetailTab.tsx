import type { SyntheticEvent } from "react";
import type { IFixedAssetItem } from "src/types/fixed-asset";

import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import { Card, Grid, Dialog, Button, DialogContent } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import CheckFormDetail from "../check/CheckFormDetail";
import FixedAssetDetailTable from "./FixedAssetDetailTable";
import FixedAssetDetailImages from "./FixedAssetDetailImages";
import OperationLogTableContainer from "../../container/operation-log/OperationLogTableContainer";
import FixedAssetDepreciationContaier from "../../container/fixed-asset/FixedAssetDepreciationContainer";

type FixedAssetDetailTabProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem;
  focusTab?: string;
  onChangeTab?: (tab: string) => void;
};

export default function FixedAssetDetailTab({
  workspaceId,
  fixedAsset,
  focusTab,
  onChangeTab,
}: FixedAssetDetailTabProps) {
  const [value, setValue] = useState("overview");
  const [filter, setFilter] = useState({ fixed_asset: [fixedAsset?.id] });
  const operationLogFullScreen = useBoolean();

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    onChangeTab?.(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    if (focusTab) {
      setValue(focusTab);
    }
  }, [focusTab]);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Overview" value="overview" />
              <Tab label="Check In/Out" value="check-in-out" />
              <Tab
                disabled={!fixedAsset?.is_calculate_depreciation}
                label="Depreciation"
                value="depreciation"
              />
              <Tab
                disabled={!fixedAsset?.images?.length}
                label={`Images (${fixedAsset.images.length})`}
                value="images"
              />
              <Tab label="Operation Log" value="operation-log" />
            </TabList>
          </Box>
        </TabContext>
        {value === "overview" && (
          <FixedAssetDetailTable workspaceId={workspaceId} fixedAsset={fixedAsset} />
        )}
        {value === "check-in-out" && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <CheckFormDetail hideDetail workspaceId={workspaceId} fixedAsset={fixedAsset} />
              </Box>
            </Grid>
          </Grid>
        )}
        {value === "depreciation" && (
          <FixedAssetDepreciationContaier
            workspaceId={workspaceId}
            fixedAssetId={fixedAsset?.id as string}
          />
        )}
        {value === "images" && <FixedAssetDetailImages images={fixedAsset.images} />}
        {value === "operation-log" && (
          <OperationLogTableContainer
            workspaceId={workspaceId}
            onFullScreen={operationLogFullScreen.onTrue}
            filter={filter}
            onFilter={(newFilter: any) =>
              setFilter({ ...newFilter, fixed_asset: [fixedAsset?.id] })
            }
            config={{
              hideColumnFixedAsset: true,
              hideSearch: true,
              hide_old: true,
              showFilterOperationGroup: true,
              showFilterOperationType: true,
              showFilterAudit: true,
              showFilterAssignment: true,
              showFilterRelocation: true,
              showFilterTransition: true,
            }}
          />
        )}
      </Card>
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
                setFilter({ ...newFilter, fixed_asset: [fixedAsset?.id] })
              }
              config={{
                hideColumnFixedAsset: true,
                hideSearch: true,
                hideFullScreen: true,
                hide_old: true,
                showFilterOperationGroup: true,
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
    </>
  );
}
