//
import type { UploadProps } from "src/components/upload";

import { useDropzone } from "react-dropzone";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// @mui
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";
import { RejectionFiles, MultiFilePreview, SingleFilePreview } from "src/components/upload";

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = !!files && multiple && !!files.length;

  // const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Button
      color="inherit"
      variant="outlined"
      size="small"
      startIcon={<Iconify icon="mdi:image-plus-outline" />}
      fullWidth
    >
      Add Images
    </Button>
  );

  const renderSinglePreview = (
    <SingleFilePreview imgUrl={typeof file === "string" ? file : file?.preview} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: "absolute",
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        "&:hover": {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Box sx={{ my: 3 }}>
        <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        {onRemoveAll && (
          <Button
            sx={{ mt: 1 }}
            color="error"
            fullWidth
            variant="text"
            size="small"
            onClick={onRemoveAll}
          >
            Remove All
          </Button>
        )}
      </Stack>
    </>
  );

  return (
    <Box sx={{ width: 1, position: "relative", ...sx }}>
      <Box {...getRootProps()}>
        <input {...getInputProps()} />
        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box>
  );
}
