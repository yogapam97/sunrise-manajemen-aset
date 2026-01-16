import type { ILocationItem } from "src/types/location";

import { useState } from "react";
import { debounce } from "lodash";

import {
  Box,
  Stack,
  Button,
  ListItem,
  TextField,
  Autocomplete,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import CommonDialog from "../common/CommonDialog";
import { useGetAllLocations } from "../../hook/useLocations";
import { ADD_ICON, LOCATION_ICON } from "../icon-definitions";
import LocationCreateFormContainer from "../../container/location/LocationCreateFormContainer";

type LocationInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: ILocationItem;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  hideCreateNew?: boolean;
};

export default function LocationInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  size,
  multiple,
  error,
  helperText,
  disabled,
  placeholder,
  hideCreateNew = false,
}: LocationInputAutocompleteProps) {
  let locations: ILocationItem[] = [];
  const createNewDialog = useBoolean();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useGetAllLocations(workspaceId, { search });

  if (isSuccess) {
    ({ data: locations } = data);
  }

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);

  return (
    <Stack spacing={1} sx={{ width: 1 }}>
      <Autocomplete
        fullWidth
        value={defaultValue}
        onChange={onChange}
        loading={isLoading}
        options={locations}
        multiple={multiple}
        disabled={disabled}
        size={size}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder || "Select Location ..."}
            error={error}
            helperText={helperText}
            disabled={disabled}
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemIcon>
              <Iconify icon={LOCATION_ICON} />
            </ListItemIcon>
            <ListItemText primary={option.name} secondary={option?.code} />
          </ListItem>
        )}
      />
      {!hideCreateNew && (
        <>
          <Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon={ADD_ICON} />}
              onClick={createNewDialog.onTrue}
            >
              Add New Location
            </Button>
          </Box>
          <CommonDialog
            title="Create New Location"
            open={createNewDialog.value}
            onClose={createNewDialog.onFalse}
          >
            <LocationCreateFormContainer
              onSuccess={createNewDialog.onFalse}
              workspaceId={workspaceId}
            />
          </CommonDialog>
        </>
      )}
    </Stack>
  );
}
