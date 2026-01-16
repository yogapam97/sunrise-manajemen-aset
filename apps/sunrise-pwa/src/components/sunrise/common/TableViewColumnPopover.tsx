import type { MouseEvent } from "react";

import { useState } from "react";

import { Button, Switch, Popover, FormGroup, Typography, FormControlLabel } from "@mui/material";

import Iconify from "src/components/iconify";

type TableViewColumnPopoverProps = {
  columns: any[];
  onChangeColumns: (columns: any[]) => void;
};

export default function TableViewColumnPopover({
  columns,
  onChangeColumns,
}: TableViewColumnPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSwitchChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedColumns = [...columns];
    updatedColumns[index].show = event.target.checked;
    onChangeColumns(updatedColumns);
  };
  return (
    <>
      <Button
        variant="contained"
        size="small"
        startIcon={<Iconify icon="mdi:view-column-outline" />}
        onClick={handleClick}
      >
        View Column
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <FormGroup>
          {columns.map(
            (column: any, index: number) =>
              !column.alwaysShow && (
                <FormControlLabel
                  key={index}
                  control={<Switch checked={column?.show} onChange={handleSwitchChange(index)} />}
                  label={<Typography variant="subtitle2">{column?.label}</Typography>}
                />
              )
          )}
        </FormGroup>
      </Popover>
    </>
  );
}
