import type { Area } from "react-easy-crop";

import Cropper from "react-easy-crop";
import React, { useState, useCallback } from "react";

import {
  Box,
  Stack,
  Dialog,
  Button,
  Slider,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { getCroppedImg } from "src/utils/crop-image";

import Iconify from "src/components/iconify";

import { CROP_ICON, ZOOM_ICON } from "../icon-definitions";

type CommonCropDialogProps = {
  open: any;
  title?: string;
  src: string | undefined;
  cropShape?: "rect" | "round";
  onCrop: (crop: any) => void;
  onClose: VoidFunction;
};

export default function CommonCropDialog({
  open,
  onClose,
  src,
  title,
  onCrop,
  cropShape = "rect",
}: CommonCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixelsResult: any) => {
    setCroppedAreaPixels(croppedAreaPixelsResult);
  }, []);

  const handleApplyCrop = useCallback(async () => {
    try {
      if (src && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(src, croppedAreaPixels);
        onCrop(croppedImage);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, onCrop, onClose, src]);

  return (
    <Dialog fullWidth open={open} scroll="body" onClose={onClose}>
      <DialogTitle align="center" variant="subtitle2">
        {title || ""}
      </DialogTitle>
      <DialogContent sx={{ alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ height: 500, position: "relative" }}>
          <Cropper
            image={src || ""}
            crop={crop}
            cropShape={cropShape}
            cropSize={{ width: 400, height: 400 }}
            zoom={zoom}
            zoomWithScroll
            onZoomChange={setZoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
          />
        </Box>
      </DialogContent>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme: any) => theme.palette.grey[500],
        }}
      >
        <Iconify icon="solar:close-circle-outline" />
      </IconButton>
      <Stack spacing={1} sx={{ p: 2 }} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon={ZOOM_ICON} />
          <Typography variant="subtitle2">Zoom</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Slider
            min={1}
            max={3}
            defaultValue={1.5}
            step={0.1}
            value={zoom}
            onChange={(e, value) => setZoom(value as number)}
            sx={{ width: 250, height: 5 }}
          />
        </Stack>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyCrop}
            startIcon={<Iconify icon={CROP_ICON} />}
          >
            Apply Crop
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
}
