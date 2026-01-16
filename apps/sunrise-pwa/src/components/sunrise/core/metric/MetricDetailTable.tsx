import type { ReactNode } from "react";
import type { IMetricItem } from "src/types/metric";

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

import MetricTypeView from "./MetricTypeView";
import MetricLabelView from "./MetricLabelView";

type MetricTableRowProps = {
  property: string;
  children: ReactNode;
};

const MetricTableRow = ({ property, children }: MetricTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type MetricDetailTableProps = {
  workspaceId: string;
  metric: IMetricItem;
};
export default function MetricDetailTable({ workspaceId, metric }: MetricDetailTableProps) {
  const { name, type, description } = metric;
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Metric Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Type
                </Typography>
              </TableCell>
              <TableCell>
                <MetricTypeView type={type} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Label
                </Typography>
              </TableCell>
              <TableCell>
                <MetricLabelView metric={metric} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {description || "-"}
                </Typography>
              </TableCell>
            </TableRow>

            <MetricTableRow property="ID">
              <Typography variant="body2">{metric?.id}</Typography>
            </MetricTableRow>

            <MetricTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">{moment(metric?.created_at).format("LLL")}</Typography>
                <Typography variant="caption">{moment(metric?.created_at).fromNow()}</Typography>
              </Stack>
            </MetricTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
