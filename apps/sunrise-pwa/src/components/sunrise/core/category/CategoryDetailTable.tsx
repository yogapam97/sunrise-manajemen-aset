import type { ReactNode } from "react";
import type { ICategoryItem } from "src/types/category";

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

type CategoryTableRowProps = {
  property: string;
  children: ReactNode;
};

const CategoryTableRow = ({ property, children }: CategoryTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type CategoryDetailTableProps = {
  workspaceId: string;
  category: ICategoryItem;
};
export default function CategoryDetailTable({ workspaceId, category }: CategoryDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Category Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{category.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{category.code}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Icon
                </Typography>
              </TableCell>
              <TableCell>
                <Iconify icon={category.icon || EMPTY_ICON} />
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
                  {category?.description ? <Iconify icon={EMPTY_ICON} /> : category?.description}
                </Typography>
              </TableCell>
            </TableRow>

            <CategoryTableRow property="ID">
              <Typography variant="body2">{category.id}</Typography>
            </CategoryTableRow>

            <CategoryTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">{moment(category.created_at).format("LLL")}</Typography>
                <Typography variant="caption">{moment(category.created_at).fromNow()}</Typography>
              </Stack>
            </CategoryTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
