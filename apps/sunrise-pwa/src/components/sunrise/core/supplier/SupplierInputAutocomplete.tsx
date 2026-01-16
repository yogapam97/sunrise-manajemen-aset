import type { ISupplierItem } from "src/types/supplier";

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
import { useGetAllSuppliers } from "../../hook/useSuppliers";
import { ADD_ICON, SUPPLIER_ICON } from "../icon-definitions";
import SupplierCreateFormContainer from "../../container/supplier/SupplierCreateFormContainer";

type SupplierInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: ISupplierItem;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  hideCreateNew?: boolean;
};

export default function SupplierInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  multiple,
  size,
  hideCreateNew = false,
}: SupplierInputAutocompleteProps) {
  let supplier: ISupplierItem[] = [];
  const createNewDialog = useBoolean();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useGetAllSuppliers(workspaceId, { search });

  if (isSuccess) {
    ({ data: supplier } = data);
  }

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);
  return (
    <Stack spacing={1}>
      <Autocomplete
        fullWidth
        value={defaultValue}
        onChange={onChange}
        loading={isLoading}
        options={supplier}
        size={size}
        multiple={multiple}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Select Supplier ..."
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemIcon>
              <Iconify icon={SUPPLIER_ICON} />
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
              Add New Supplier
            </Button>
          </Box>
          <CommonDialog
            title="Create New Supplier"
            open={createNewDialog.value}
            onClose={createNewDialog.onFalse}
          >
            <SupplierCreateFormContainer
              onSuccess={createNewDialog.onFalse}
              workspaceId={workspaceId}
            />
          </CommonDialog>
        </>
      )}
    </Stack>
  );
}
