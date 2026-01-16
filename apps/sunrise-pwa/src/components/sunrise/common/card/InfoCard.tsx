import type { ReactNode } from "react";

import { Box, Grid, Stack, Typography } from "@mui/material";

type InfoCardProps = {
  title?: string;
  content?: ReactNode;
  info?: ReactNode;
};
export default function InfoCard({ title, content, info }: InfoCardProps) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 1 }}>
          {info}
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Stack>
          <Typography variant="subtitle2">{title}</Typography>
          <Box>{content}</Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
