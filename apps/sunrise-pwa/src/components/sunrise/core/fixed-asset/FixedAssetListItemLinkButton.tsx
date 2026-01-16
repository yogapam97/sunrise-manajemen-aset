import type { IFixedAssetItem } from "src/types/fixed-asset";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";
import { useThumbnail } from "../../hook/useThumbnail";
import ListItemLinkButton from "../../common/ListItemLinkButton";

type FixedAssetListItemLinkButtonProps = {
  fixedAsset: IFixedAssetItem;
};

export default function FixedAssetListItemLinkButton({
  fixedAsset,
}: FixedAssetListItemLinkButtonProps) {
  const createThumbnail = useThumbnail({
    scale: 50,
  });
  if (!fixedAsset) return <Iconify icon={EMPTY_ICON} />;

  const { id, name, code, workspace, thumbnail } = fixedAsset;
  const thisThumbnail = thumbnail || createThumbnail(name);
  return (
    <ListItemLinkButton
      primary={name}
      secondary={code}
      href={paths.app.fixedAsset.detail(workspace?.id || workspace, id)}
      avatar={thisThumbnail}
      avatarSx={{
        borderRadius: 0.5,
      }}
    />
  );
}
