import type { IFixedAssetItem } from "src/types/fixed-asset";

import { identicon } from "@dicebear/collection";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Avatar, ListItem, Typography, ListItemText } from "@mui/material";

import { paths } from "src/routes/paths";

import useCreateAvatar from "src/hooks/use-create-avatar";

type FixedAssetItemCardProps = {
  fixedAsset: IFixedAssetItem;
  onLoadDetail?: () => void;
};
export default function FixedAssetItemCard({ fixedAsset, onLoadDetail }: FixedAssetItemCardProps) {
  const { name, code, thumbnail } = fixedAsset;
  const { push } = useRouter();
  const pathname = usePathname();
  const [detailFixedAssetLoading, setDetailFixedAssetLoading] = useState<boolean>(false);
  const [currentPathname, setCurrentPathname] = useState<string>(pathname);

  const createThumbnail = useCreateAvatar(identicon, {
    rowColor: ["f5f5f5"],
    backgroundColor: ["000"],
    scale: 70,
  });

  const handleMoreFixedAsset = useCallback(() => {
    setDetailFixedAssetLoading(true);
    const newUrl = paths.app.fixedAsset.detail(
      fixedAsset?.workspace?.id || fixedAsset?.workspace,
      fixedAsset?.id as string
    );

    push(newUrl);
  }, [push, fixedAsset]);

  useEffect(() => {
    if (currentPathname !== pathname) {
      setDetailFixedAssetLoading(false);
      setCurrentPathname(pathname);
      if (onLoadDetail) onLoadDetail();
    }
  }, [setCurrentPathname, pathname, currentPathname, onLoadDetail]);

  return (
    <Card sx={{ p: 1 }}>
      <Stack direction="row" spacing={2}>
        <Avatar
          alt={name}
          src={thumbnail || createThumbnail(name)}
          variant="rounded"
          sx={{ width: 100, height: 100, borderRadius: 1 }}
        />
        <Stack spacing={2} sx={{ width: 340 }}>
          <ListItem disablePadding>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fixedAsset?.name}
                </Typography>
              }
              secondary={
                <Typography variant="subtitle2" color="text.disabled">
                  {code}
                </Typography>
              }
            />
          </ListItem>
          <LoadingButton
            color="primary"
            variant="outlined"
            loading={detailFixedAssetLoading}
            onClick={handleMoreFixedAsset}
            loadingIndicator="Redirecting …"
            fullWidth
            size="small"
          >
            More Detail
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );
}
