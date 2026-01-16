import type { ReactNode } from "react";
import type { ISupplierItem } from "src/types/supplier";

import moment from "moment";
import nProgress from "nprogress";

import {
  Box,
  Link,
  Paper,
  Stack,
  Table,
  TableRow,
  ListItem,
  TableBody,
  TableCell,
  Typography,
  ListItemIcon,
  ListItemText,
  TableContainer,
} from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type SupplierTableRowProps = {
  property: string;
  children: ReactNode;
};

const SupplierTableRow = ({ property, children }: SupplierTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type SupplierDetailTableProps = {
  workspaceId: string;
  supplier: ISupplierItem;
};
export default function SupplierDetailTable({ workspaceId, supplier }: SupplierDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Supplier Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{supplier.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{supplier.code}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                {supplier.email ? (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Iconify icon="mdi:email-outline" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href={`mailto:${supplier.email}`}
                          color="inherit"
                          underline="hover"
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            nProgress.done();
                          }}
                        >
                          {supplier.email}
                        </Link>
                      }
                    />
                  </ListItem>
                ) : (
                  <Iconify icon={EMPTY_ICON} />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Phone
                </Typography>
              </TableCell>
              <TableCell>
                {supplier.phone ? (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Iconify icon="mdi:phone-outline" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href={`tel:${supplier.phone}`}
                          color="inherit"
                          underline="hover"
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            nProgress.done();
                          }}
                        >
                          {supplier.phone}
                        </Link>
                      }
                    />
                  </ListItem>
                ) : (
                  <Iconify icon={EMPTY_ICON} />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Website
                </Typography>
              </TableCell>
              <TableCell>
                {supplier.url ? (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Iconify icon="mdi:open-in-new" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href={supplier.url}
                          color="inherit"
                          underline="hover"
                          target="_blank"
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            nProgress.done();
                          }}
                        >
                          {supplier.url}
                        </Link>
                      }
                    />
                  </ListItem>
                ) : (
                  <Iconify icon={EMPTY_ICON} />
                )}
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
                  {supplier?.description ? <Iconify icon={EMPTY_ICON} /> : supplier?.description}
                </Typography>
              </TableCell>
            </TableRow>

            <SupplierTableRow property="ID">
              <Typography variant="body2">{supplier.id}</Typography>
            </SupplierTableRow>

            <SupplierTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">{moment(supplier.created_at).format("LLL")}</Typography>
                <Typography variant="caption">{moment(supplier.created_at).fromNow()}</Typography>
              </Stack>
            </SupplierTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
