import { ListItem, TextField, Autocomplete, ListItemIcon, ListItemText } from "@mui/material";

import Iconify from "src/components/iconify";

import { AUDIT_ICON, ASSIGNMENT_ICON, RELOCATION_ICON, TRANSITION_ICON } from "../icon-definitions";

type OperationTypeInputAutocompleteProps = {
  defaultValue?: string | string[];
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
};
const operationTypes = ["AUDIT", "ASSIGNMENT", "RELOCATION", "TRANSITION"];
export default function OperationTypeInputAutocomplete({
  defaultValue,
  onChange,
  multiple,
  size,
}: OperationTypeInputAutocompleteProps) {
  return (
    <Autocomplete
      fullWidth
      value={defaultValue}
      onChange={onChange}
      options={operationTypes}
      size={size}
      multiple={multiple}
      isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" placeholder="Select Operation Type ..." />
      )}
      renderOption={(props, option) => {
        let icon = ASSIGNMENT_ICON;
        if (option === "AUDIT") icon = AUDIT_ICON;
        if (option === "RELOCATION") icon = RELOCATION_ICON;
        if (option === "TRANSITION") icon = TRANSITION_ICON;
        return (
          <ListItem {...props}>
            <ListItemIcon>
              <Iconify icon={icon} />
            </ListItemIcon>
            <ListItemText primary={option} />
          </ListItem>
        );
      }}
    />
  );
}
