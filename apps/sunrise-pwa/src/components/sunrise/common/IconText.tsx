import type { ReactNode } from "react";
import type { TypographyProps } from "@mui/material";

import { Stack, Typography } from "@mui/material";

interface IconTextProps extends TypographyProps {
  icon: ReactNode;
  text: string | ReactNode;
}
export default function IconText({ icon, text, variant }: IconTextProps) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {icon}
      <Typography variant={variant} className="ml-2">
        {text}
      </Typography>
    </Stack>
  );
}
