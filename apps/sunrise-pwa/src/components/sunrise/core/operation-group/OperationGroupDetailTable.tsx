import type { ReactNode } from "react";
import type { IOperationGroupItem } from "src/types/operation-group";

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

type OperationGroupTableRowProps = {
  property: string;
  children: ReactNode;
};

const OperationGroupTableRow = ({ property, children }: OperationGroupTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type OperationGroupDetailTableProps = {
  workspaceId: string;
  operationGroup: IOperationGroupItem;
};
export default function OperationGroupDetailTable({
  workspaceId,
  operationGroup,
}: OperationGroupDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  OperationGroup Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{operationGroup?.name}</Typography>
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
                  {operationGroup?.description ? (
                    <Iconify icon={EMPTY_ICON} />
                  ) : (
                    operationGroup?.description
                  )}
                </Typography>
              </TableCell>
            </TableRow>

            <OperationGroupTableRow property="ID">
              <Typography variant="body2">{operationGroup?.id}</Typography>
            </OperationGroupTableRow>

            <OperationGroupTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">
                  {moment(operationGroup?.created_at).format("LLL")}
                </Typography>
                <Typography variant="caption">
                  {moment(operationGroup?.created_at).fromNow()}
                </Typography>
              </Stack>
            </OperationGroupTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
