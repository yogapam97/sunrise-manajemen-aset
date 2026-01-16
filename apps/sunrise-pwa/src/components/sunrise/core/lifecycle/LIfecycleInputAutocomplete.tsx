import type { ILifecycleItem } from "src/types/lifecycle";

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
  ListItemSecondaryAction,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import CommonDialog from "../common/CommonDialog";
import { useGetAllLifecycles } from "../../hook/useLifecycles";
import { ADD_ICON, MAINTENANCE_ICON } from "../icon-definitions";
import LifecycleCreateFormContainer from "../../container/lifecycle/LifecycleCreateFormContainer";

type LifecycleInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: ILifecycleItem;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  hideCreateNew?: boolean;
  maintenanceCycle?: boolean;
};

export default function LifecycleInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  size,
  multiple,
  error,
  helperText,
  placeholder,
  hideCreateNew = false,
  maintenanceCycle,
}: LifecycleInputAutocompleteProps) {
  let lifecycle: ILifecycleItem[] = [];
  const createNewDialog = useBoolean();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useGetAllLifecycles(workspaceId, {
    search,
    is_maintenance_cycle: maintenanceCycle,
  });

  if (isSuccess) {
    ({ data: lifecycle } = data);
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
        options={lifecycle}
        multiple={multiple}
        size={size}
        isOptionEqualToValue={(option: any, value) => option.id === value.id}
        getOptionLabel={(option: any) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder || "Select Lifecycle ..."}
            error={error}
            helperText={helperText}
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemIcon>
              <Iconify icon="material-symbols:circle" sx={{ color: option?.color }} />
            </ListItemIcon>
            <ListItemText primary={option.name} secondary={option?.code} />
            {option?.is_maintenance_cycle && (
              <ListItemSecondaryAction>
                <Iconify icon={MAINTENANCE_ICON} />
              </ListItemSecondaryAction>
            )}
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
              Add New Lifecycle
            </Button>
          </Box>
          <CommonDialog
            title="Create New Lifecycle"
            open={createNewDialog.value}
            onClose={createNewDialog.onFalse}
          >
            <LifecycleCreateFormContainer
              onSuccess={createNewDialog.onFalse}
              workspaceId={workspaceId}
            />
          </CommonDialog>
        </>
      )}
    </Stack>
  );
}
