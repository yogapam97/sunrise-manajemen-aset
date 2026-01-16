import type { IFixedAssetItem } from "src/types/fixed-asset";

import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";

import {
  Box,
  Stack,
  Button,
  Dialog,
  Select,
  Divider,
  MenuItem,
  ListItem,
  IconButton,
  Typography,
  InputLabel,
  DialogTitle,
  FormControl,
  ListItemIcon,
  ListItemText,
  DialogActions,
  DialogContent,
  LinearProgress,
} from "@mui/material";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

import { useWorkspaceContext } from "src/auth/hooks";

import { useFindFixedAsset } from "../../hook/useFixedAssets";
import FixedAssetItemCard from "../fixed-asset/FixedAssetItemCard";
import FixedAssetDetailTable from "../fixed-asset/FixedAssetDetailTable";

const DeviceSelection = ({ devices, onSelectDevice, selectedDevice }: any) => (
  <FormControl sx={{ width: "100%" }} fullWidth>
    <InputLabel id="camera-selection">Select Device</InputLabel>
    <Select
      labelId="camera-selection"
      variant="outlined"
      value={selectedDevice}
      label="Select Device"
      onChange={(e) => onSelectDevice(e)}
    >
      {devices.map((device: any, index: number) => (
        <MenuItem key={index} value={device.deviceId}>
          {device.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default function ScanFixedAssetButton() {
  const { workspace } = useWorkspaceContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fixedAssetItem, setFixedAssetItem] = useState<IFixedAssetItem | null>(null);
  const [selectedDevice, setSelectedDevice] = useState("");

  const devices = useDevices();
  const findFixedAssetMutation = useFindFixedAsset(workspace?.id as string, {
    onSuccess: (response) => {
      const { data } = response;
      setFixedAssetItem(data);
    },
  });

  const handleClickScanFixedAsset = () => {
    setIsDialogOpen(true);
  };
  const handleCloseScanFixedAsset = useCallback(() => {
    setFixedAssetItem(null);
    setIsDialogOpen(false);
  }, []);

  const handleScanFixedAsset = (result: any) => {
    if (result.length) {
      const { rawValue } = result[0];
      findFixedAssetMutation.mutate(rawValue);
    }
  };

  const handleSelectDevice = (e: any) => {
    setSelectedDevice(e.target.value);
  };

  const handleRefreshPage = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop()); // Stop the stream to release the camera
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error enabling the camera:", err);
        window.location.reload();
      });
  };

  useEffect(() => {
    if (!devices[0]?.deviceId) {
      setSelectedDevice("");
    } else {
      setSelectedDevice(devices[0]?.deviceId);
    }
  }, [devices]);

  return (
    <>
      <IconButton onClick={handleClickScanFixedAsset}>
        <Iconify icon="mdi:qrcode-scan" />
      </IconButton>

      <Dialog open={isDialogOpen}>
        <DialogTitle sx={{ textAlign: "center", pb: 0 }} variant="subtitle2">
          {_.isEmpty(fixedAssetItem) ? "Put your qr code on the camera" : "Fixed Asset Found"}
        </DialogTitle>
        <DialogContent>
          <Stack sx={{ p: 2, width: 480 }}>
            {findFixedAssetMutation.isLoading && (
              <Stack spacing={1}>
                <Typography variant="subtitle1" color="text.disabled">
                  Searching fixed asset ...
                </Typography>
                <LinearProgress />
              </Stack>
            )}
            {!_.isEmpty(fixedAssetItem) && (
              <Stack sx={{ width: 480 }} spacing={1}>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFixedAssetItem(null)}
                    startIcon={<Iconify icon="eva:chevron-left-outline" />}
                  >
                    Scan Again
                  </Button>
                </Box>
                <FixedAssetItemCard
                  fixedAsset={fixedAssetItem}
                  onLoadDetail={() => handleCloseScanFixedAsset()}
                />
                <Scrollbar sx={{ maxHeight: 320 }}>
                  <FixedAssetDetailTable
                    workspaceId={workspace?.id as string}
                    fixedAsset={fixedAssetItem}
                  />
                </Scrollbar>
              </Stack>
            )}
            {!selectedDevice && (
              <Stack sx={{ height: 320 }} justifyContent="center">
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon="mdi:camera-off-outline" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" color="error">
                        Camera is not available
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2" color="text.disabled">
                        Please enable camera or connect your device. <br /> You can refresh the page
                        after you finish enabled your camera or connected your defice
                      </Typography>
                    }
                  />
                </ListItem>
                <Button onClick={handleRefreshPage}>Refresh Page</Button>
              </Stack>
            )}
            {!findFixedAssetMutation.isLoading &&
              _.isEmpty(fixedAssetItem) &&
              isDialogOpen &&
              selectedDevice && (
                <Stack spacing={2}>
                  <DeviceSelection
                    devices={devices}
                    onSelectDevice={handleSelectDevice}
                    selectedDevice={selectedDevice}
                  />
                  <Box sx={{ width: 480, borderRadius: "10px", overflow: "hidden" }}>
                    <Scanner
                      onScan={handleScanFixedAsset}
                      constraints={{
                        deviceId: selectedDevice,
                      }}
                    />
                  </Box>
                </Stack>
              )}
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{
            p: 1.5,
          }}
        >
          <Button
            disabled={findFixedAssetMutation.isLoading}
            fullWidth
            color="inherit"
            variant="contained"
            onClick={handleCloseScanFixedAsset}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
