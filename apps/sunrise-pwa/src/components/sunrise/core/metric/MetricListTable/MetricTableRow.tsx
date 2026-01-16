// @mui
// types
import type { IMetricItem } from "src/types/metric";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// utils
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import MetricTypeView from "../MetricTypeView";
import MetricLabelView from "../MetricLabelView";
import { METRIC_ICON } from "../../icon-definitions";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IMetricItem;
  onDeleteRow: VoidFunction;
};

export default function MetricTableRow({ workspaceId, row, onDeleteRow }: Props) {
  const { id, name, type, description } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <IconButton color={popover.open ? "primary" : "default"} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Button
            LinkComponent={RouterLink}
            href={paths.app.metric.detail(workspaceId, id as string)}
            variant="outlined"
            startIcon={<Iconify icon={METRIC_ICON} />}
          >
            {name}
          </Button>
        </TableCell>
        <TableCell>
          <MetricTypeView type={type} />
        </TableCell>
        <TableCell>
          <MetricLabelView metric={row} />
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description || "-"}
          </Typography>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem component={RouterLink} href={paths.app.metric.edit(workspaceId, id as string)}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this metric?
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
