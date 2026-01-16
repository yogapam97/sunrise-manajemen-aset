import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// @mui
import Typography from "@mui/material/Typography";
import { Badge, Stack, LinearProgress } from "@mui/material";

// utils
import { fNumber } from "src/utils/format-number";

import Iconify from "src/components/iconify";

// components

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  description: string;
  percent?: number;
  loading: boolean;
  total: number;
}

export default function AppWidgetSummary({
  title,
  description,
  loading,
  percent,
  total,
  sx,
  ...other
}: Props) {
  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>
        {loading ? (
          <LinearProgress />
        ) : (
          <Box sx={{ my: 2 }}>
            {percent ? (
              <Badge
                badgeContent={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="mdi:triangle-down" width={10} height={10} />
                    <Typography variant="subtitle2">{`${(percent * 100)?.toFixed(2)}%`}</Typography>
                  </Stack>
                }
                color="error"
              >
                <Typography variant="h3">{fNumber(total)}</Typography>
              </Badge>
            ) : (
              <Typography variant="h3">{fNumber(total)}</Typography>
            )}
          </Box>
        )}
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          {description}
        </Typography>
      </Box>
    </Card>
  );
}
