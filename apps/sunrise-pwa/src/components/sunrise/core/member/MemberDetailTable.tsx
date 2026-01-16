import type { ReactNode } from "react";
import type { IMemberItem } from "src/types/member";

import {
  Box,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from "@mui/material";

import MemberInvitationStatusChip from "./MemberInvitationStatusChip";

type MemberTableRowProps = {
  property: string;
  children: ReactNode;
};

const MemberTableRow = ({ property, children }: MemberTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type MemberDetailTableProps = {
  workspaceId: string;
  member: IMemberItem;
};
export default function MemberDetailTable({ workspaceId, member }: MemberDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{member?.code}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Invitation Status
                </Typography>
              </TableCell>
              <TableCell>
                <MemberInvitationStatusChip status={member?.invitation_status} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Role
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{member?.role}</Typography>
              </TableCell>
            </TableRow>

            <MemberTableRow property="ID">
              <Typography variant="body2">{member.id}</Typography>
            </MemberTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
