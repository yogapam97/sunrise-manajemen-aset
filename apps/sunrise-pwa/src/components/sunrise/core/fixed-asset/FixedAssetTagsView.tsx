import { Chip, Stack } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useWorkspaceContext } from "src/auth/hooks";

export default function FixedAssetTagsView({ tags }: { tags: string[] }) {
  const { workspace } = useWorkspaceContext();
  return (
    <Stack spacing={1} direction="row" flexWrap="wrap">
      {tags.map((tag) => (
        <Chip
          key={tag}
          component={RouterLink}
          sx={{ cursor: "pointer" }}
          href={`${paths.app.fixedAsset.root(workspace?.id as string)}?tags[]=${tag}`}
          label={tag}
          size="small"
        />
      ))}
    </Stack>
  );
}
