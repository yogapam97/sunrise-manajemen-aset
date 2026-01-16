import type { ReactNode } from "react";
import type { ILifecycleItem } from "src/types/lifecycle";

import moment from "moment";

import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type LifecycleTableRowProps = {
  property: string;
  children: ReactNode;
};

const LifecycleTableRow = ({ property, children }: LifecycleTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type LifecycleDetailTableProps = {
  workspaceId: string;
  lifecycle: ILifecycleItem;
};
export default function LifecycleDetailTable({
  workspaceId,
  lifecycle,
}: LifecycleDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Lifecycle Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{lifecycle.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{lifecycle.code}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Color
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={lifecycle.color}
                  style={{ backgroundColor: lifecycle.color }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {lifecycle?.description ? <Iconify icon={EMPTY_ICON} /> : lifecycle?.description}
                </Typography>
              </TableCell>
            </TableRow>

            <LifecycleTableRow property="ID">
              <Typography variant="body2">{lifecycle.id}</Typography>
            </LifecycleTableRow>

            <LifecycleTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">
                  {moment(lifecycle.created_at).format("LLL")}
                </Typography>
                <Typography variant="caption">{moment(lifecycle.created_at).fromNow()}</Typography>
              </Stack>
            </LifecycleTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
