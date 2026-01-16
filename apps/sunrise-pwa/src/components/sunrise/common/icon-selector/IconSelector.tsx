import { useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Divider,
  TextField,
  ButtonBase,
  Typography,
  InputAdornment,
} from "@mui/material";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

const icons = [
  { icon: "codicon:tools", label: "Tools" },
  { icon: "mdi:building", label: "Building" },
  { icon: "teenyicons:computer-outline", label: "Computer" },
  { icon: "mdi:laptop", label: "Laptop" },
  { icon: "mdi:server", label: "Server" },
  { icon: "fluent:certificate-32-regular", label: "License" },
  { icon: "mdi:printer", label: "Printer" },
  { icon: "mdi:scanner", label: "Scanner" },
  { icon: "solar:chair-outline", label: "Chair" },
  { icon: "material-symbols:table-bar-outline", label: "Table" },
  { icon: "fluent:toolbox-20-regular", label: "Toolbox" },
  { icon: "mdi:wrench-outline", label: "Wrench" },
  { icon: "mdi:gear-outline", label: "Gear" },
  { icon: "carbon:cics-program", label: "Software" },
  { icon: "mdi:phone", label: "Phone" },
  { icon: "mdi:construction", label: "Project" },
  { icon: "icon-park-outline:medical-box", label: "Medical" },
  { icon: "mdi:car", label: "Car" },
  { icon: "mdi:sail-boat", label: "Boat" },
  { icon: "mdi:flight", label: "Airplane" },
  { icon: "mdi:train", label: "Train" },
  { icon: "mdi:subway", label: "Subway" },
  { icon: "mdi:garage", label: "Garage" },
  { icon: "mdi:warehouse", label: "Warehouse" },
  { icon: "mdi:lightbulb", label: "Lighting" },
  { icon: "mdi:power", label: "Power" },
  { icon: "mdi:air-conditioner", label: "Air Conditioner" },
  { icon: "mdi:chair", label: "Furniture" },
  { icon: "mdi:desk", label: "Desk" },
  { icon: "mdi:storage", label: "Storage Unit" },
  { icon: "mdi:work", label: "Machinery" },
  { icon: "mdi:school", label: "Educational Equipment" },
  { icon: "mdi:camera", label: "Camera Equipment" },
  { icon: "mdi:bullhorn", label: "Audio Equipment" },
  { icon: "mdi:videocam", label: "Video Equipment" },
  { icon: "mdi:satellite", label: "Satellite Dish" },
  { icon: "mdi:wifi", label: "Network Equipment" },
  { icon: "mdi:lock", label: "Security System" },
  { icon: "mdi:place", label: "Land" },
  { icon: "mdi:office-building", label: "Office Building" },
  { icon: "mdi:store", label: "Retail Space" },
  { icon: "mdi:restaurant", label: "Restaurant" },
  { icon: "mdi:gavel", label: "Lease" },
  { icon: "mdi:info", label: "Info" },
];

type IconSelectorProps = {
  value: string;
  onChange: (icon: string) => void;
};

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [availabelIcons, setAvailableIcons] = useState(icons);

  const handleSearchIcon = (e: any) => {
    const search = e.target.value.toLowerCase();
    const filteredIcons = icons.filter((icon) => icon.label.toLowerCase().includes(search));
    setAvailableIcons(filteredIcons);
  };

  return (
    <Stack spacing={1}>
      <TextField
        fullWidth
        label="Search ..."
        variant="outlined"
        size="small"
        onChange={handleSearchIcon}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Iconify icon="material-symbols:search-rounded" />
            </InputAdornment>
          ),
        }}
      />
      <Divider />
      <Scrollbar sx={{ height: "250px" }}>
        <Box>
          {availabelIcons.map(({ icon, label }) => (
            <Paper
              component={ButtonBase}
              onClick={() => onChange(icon)}
              key={icon}
              sx={{
                m: 0.2,
                backgroundColor: "transparent",
                border: value === icon ? 2 : 1,
                borderColor: value === icon ? "primary" : "divider",
                width: 80,
                height: 80,
              }}
            >
              <Stack alignItems="center">
                <Iconify icon={icon} />
                <Typography variant="caption">{label}</Typography>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Scrollbar>
    </Stack>
  );
}
