import type { ICategoryItem } from "src/types/category";

import { Card, Stack, Typography, ListItemText, CardActionArea } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import { useWorkspaceContext } from "src/auth/hooks";

import { CATEGORY_ICON } from "../icon-definitions";

type Props = {
  category: ICategoryItem;
};

export default function CategoryItem({ category }: Props) {
  const { workspace } = useWorkspaceContext();
  const { id, name, description } = category;

  return (
    <Card>
      <CardActionArea
        component={RouterLink}
        href={paths.app.category.detail(workspace?.id as string, id as string)}
        sx={{ textDecoration: "none", height: "100%" }}
      >
        <Stack sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Iconify icon={CATEGORY_ICON} />

            <ListItemText sx={{ mb: 1 }} primary={name} />
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
