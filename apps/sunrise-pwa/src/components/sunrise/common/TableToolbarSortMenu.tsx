import { useState } from "react";

import { Button, MenuItem, Typography } from "@mui/material";

import Iconify from "src/components/iconify";
import CustomPopover from "src/components/custom-popover/custom-popover";

type TableToolbarSortMenuProps = {
  sortOptions: any[];
  selectedSort?: string;
  onSelectedSort?: (sort: string) => void;
};
export default function TableToolbarSortMenu({
  sortOptions,
  selectedSort,
  onSelectedSort,
}: TableToolbarSortMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClickSort = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickSelectedSort = (value: string) => {
    if (onSelectedSort) {
      onSelectedSort(value);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        size="small"
        startIcon={<Iconify icon="solar:sort-outline" />}
        onClick={handleClickSort}
      >
        Sort
      </Button>
      <CustomPopover
        anchorEl={anchorEl}
        open={anchorEl}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => setAnchorEl(null)}
        arrow="top-left"
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            selected={option.value === selectedSort}
            onClick={() => handleClickSelectedSort(option.value)}
          >
            <Iconify icon={option.icon} />
            <Typography variant="body2">{option.label}</Typography>
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
