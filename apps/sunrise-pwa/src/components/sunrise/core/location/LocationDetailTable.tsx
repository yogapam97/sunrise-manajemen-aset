import type { ReactNode } from "react";
import type { ILocationItem } from "src/types/location";

import moment from "moment";

import {
  Box,
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

type LocationTableRowProps = {
  property: string;
  children: ReactNode;
};

const LocationTableRow = ({ property, children }: LocationTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type LocationDetailTableProps = {
  workspaceId: string;
  location: ILocationItem;
};
export default function LocationDetailTable({ workspaceId, location }: LocationDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Location Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{location.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{location.code}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Address
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{location.address}</Typography>
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
                  {location?.description ? <Iconify icon={EMPTY_ICON} /> : location?.description}
                </Typography>
              </TableCell>
            </TableRow>

            <LocationTableRow property="ID">
              <Typography variant="body2">{location.id}</Typography>
            </LocationTableRow>

            <LocationTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">{moment(location.created_at).format("LLL")}</Typography>
                <Typography variant="caption">{moment(location.created_at).fromNow()}</Typography>
              </Stack>
            </LocationTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
