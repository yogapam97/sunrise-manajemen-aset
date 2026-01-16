import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";

//
import { fileData, DownloadButton } from "src/components/file-thumbnail";

// ----------------------------------------------------------------------

type FileIconProps = {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: VoidFunction;
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
};

export default function StageholderFileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  sx,
  imgSx,
}: FileIconProps) {
  const { preview = "" } = fileData(file);

  const renderContent = (
    <Box
      component="img"
      src={preview}
      sx={{
        width: 1,
        height: 1,
        flexShrink: 0,
        objectFit: "cover",
        ...imgSx,
      }}
    />
  );

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
