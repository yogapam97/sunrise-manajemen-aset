import _ from "lodash";
import { identicon } from "@dicebear/collection";

import {
  Avatar,
  Tooltip,
  ListItem,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import useCreateAvatar from "src/hooks/use-create-avatar";

type FixedAssetListItemTextProps = {
  fixedAsset: any;
};

export default function FixedAssetListItemText({ fixedAsset }: FixedAssetListItemTextProps) {
  const createThumbnail = useCreateAvatar(identicon, {
    rowColor: ["f5f5f5"],
    backgroundColor: ["000"],
    scale: 70,
  });

  const extractWorkspace = (workspace: any) => {
    if (typeof workspace === "string") {
      return workspace;
    }
    return workspace?.id;
  };

  return (
    <Tooltip
      title={_.size(fixedAsset?.name) > 20 ? fixedAsset?.name : ""}
      placement="bottom-start"
      arrow
    >
      <ListItem sx={{ maxWidth: 300 }} disablePadding>
        <ListItemButton
          LinkComponent={RouterLink}
          href={paths.app.fixedAsset.detail(
            extractWorkspace(fixedAsset.workspace),
            fixedAsset?.id as string
          )}
        >
          <ListItemAvatar>
            <Avatar
              alt={fixedAsset?.name}
              src={fixedAsset?.thumbnail || createThumbnail(fixedAsset?.name as string)}
              variant="rounded"
              sx={{ borderRadius: 0.5 }}
            />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="subtitle2"
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
              <Typography
                noWrap
                variant="body2"
                color="text.disabled"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {fixedAsset?.code}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
}
