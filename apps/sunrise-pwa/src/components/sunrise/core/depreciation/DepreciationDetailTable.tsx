import moment from "moment";

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

type DepreciationDetailTableProps = {
  depreciation: any;
};
export default function DepreciationDetailTable({ depreciation }: DepreciationDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Active Start Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {moment(depreciation?.active_start_date).format("LL")}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Active End Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {moment(depreciation?.active_end_date).format("LL")}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Purchase Cost
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{depreciation?.purchase_cost}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Daily Loss
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {depreciation?.depreciation_rate.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Total Loss
                </Typography>
              </TableCell>
              <TableCell>{depreciation?.depreciation_purchase_cost.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Current Value
                </Typography>
              </TableCell>
              <TableCell>{depreciation?.current_purchase_cost.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
