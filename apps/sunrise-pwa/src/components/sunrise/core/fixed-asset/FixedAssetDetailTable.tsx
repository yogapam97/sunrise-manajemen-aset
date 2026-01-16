import type { ReactNode } from "react";
import type { IFixedAssetItem } from "src/types/fixed-asset";

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
import FixedAssetTagsView from "./FixedAssetTagsView";
import FixedAssetTypeColumn from "./FixedAssetTypeColumn";
import CurrencyDisplay from "../../common/CurrencyDisplay";
import FixedAssetWarrantyView from "./FixedAssetWarrantyView";
import MemberListItemLinkButton from "../member/MemberListItemLinkButton";
import SupplierListItemLinkButton from "../supplier/SupplierListItemLinkButto";
import LocationListItemLinkButton from "../location/LocationListItemLinkButton";
import CategoryListItemLinkButton from "../category/CategoryListItemLinkButton";
import LifecycleListItemLinkButton from "../lifecycle/LifecycleListItemLinkButton";

type FixedAssetTableRowProps = {
  property: string;
  children: ReactNode;
};

const FixedAssetTableRow = ({ property, children }: FixedAssetTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {property}
      </Typography>
    </TableCell>
    <TableCell>{children}</TableCell>
  </TableRow>
);
type FixedAssetDetailTableProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem;
};
export default function FixedAssetDetailTable({
  workspaceId,
  fixedAsset,
}: FixedAssetDetailTableProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <FixedAssetTableRow property="ID">
              <Typography variant="body2">{fixedAsset.id}</Typography>
            </FixedAssetTableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{fixedAsset.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {fixedAsset?.code ? (
                    <Typography variant="body2">{fixedAsset?.code}</Typography>
                  ) : (
                    <Iconify icon={EMPTY_ICON} />
                  )}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  S/N
                </Typography>
              </TableCell>
              <TableCell>
                {fixedAsset?.serial_number ? (
                  <Typography variant="body2">{fixedAsset?.serial_number}</Typography>
                ) : (
                  <Iconify icon={EMPTY_ICON} />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Tags
                </Typography>
              </TableCell>
              <TableCell>
                <FixedAssetTagsView tags={fixedAsset.tags || []} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Type
                </Typography>
              </TableCell>
              <TableCell>
                <FixedAssetTypeColumn type={fixedAsset?.type} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Purchase Cost
                </Typography>
              </TableCell>
              <TableCell>
                <CurrencyDisplay
                  value={fixedAsset?.purchase_cost}
                  color={Number(fixedAsset?.purchase_cost) > 0 ? "inherit" : "text.disabled"}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Purchase Date
                </Typography>
              </TableCell>
              <TableCell>
                {fixedAsset.purchase_date ? (
                  moment(fixedAsset?.purchase_date).format("LL")
                ) : (
                  <Iconify icon={EMPTY_ICON} />
                )}
              </TableCell>
            </TableRow>
            <FixedAssetTableRow property="Default Location">
              <LocationListItemLinkButton location={fixedAsset.location} />
            </FixedAssetTableRow>

            <FixedAssetTableRow property="Default Assignee">
              <MemberListItemLinkButton member={fixedAsset.assignee} />
            </FixedAssetTableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {fixedAsset?.description ? fixedAsset?.description : "-"}
                </Typography>
              </TableCell>
            </TableRow>

            <FixedAssetTableRow property="Category">
              <CategoryListItemLinkButton category={fixedAsset.category} />
            </FixedAssetTableRow>
            <FixedAssetTableRow property="Lifecycle">
              <LifecycleListItemLinkButton label lifecycle={fixedAsset.lifecycle} />
            </FixedAssetTableRow>
            <FixedAssetTableRow property="Supplier">
              <SupplierListItemLinkButton supplier={fixedAsset.supplier} />
            </FixedAssetTableRow>

            <FixedAssetTableRow property="Warranty Expire Date">
              <FixedAssetWarrantyView
                warranty_expire_date={fixedAsset?.warranty_expire_date || null}
              />
            </FixedAssetTableRow>

            <FixedAssetTableRow property="Created Date">
              <Stack>
                <Typography variant="body2">
                  {moment(fixedAsset.created_at).format("LLL")}
                </Typography>
                <Typography variant="caption">{moment(fixedAsset.created_at).fromNow()}</Typography>
              </Stack>
            </FixedAssetTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
