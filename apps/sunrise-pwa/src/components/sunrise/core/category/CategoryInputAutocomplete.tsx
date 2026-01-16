import type { ICategoryItem } from "src/types/category";

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

import Iconify from "src/components/iconify/iconify";

import CommonDialog from "../common/CommonDialog";
import { ADD_ICON, CATEGORY_ICON } from "../icon-definitions";
import { useGetAllCategories } from "../../hook/useCategories";
import CategoryCreateFormContainer from "../../container/category/CategoryCreateFormContainer";

type CategoryInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: ICategoryItem | ICategoryItem[];
  size?: "small" | "medium";
  onChange?: (e: any, value: any) => void;
  multiple?: boolean;
  hideCreateNew?: boolean;
};

export default function CategoryInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  size = "medium",
  multiple,
  hideCreateNew = false,
}: CategoryInputAutocompleteProps) {
  let categories: ICategoryItem[] = [];
  const createNewDialog = useBoolean();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useGetAllCategories(workspaceId, { search });

  if (isSuccess) {
    ({ data: categories } = data);
  }

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);

  return (
    <Stack spacing={1}>
      <Autocomplete
        fullWidth
        value={defaultValue}
        options={categories}
        multiple={multiple}
        onChange={onChange}
        loading={isLoading}
        size={size}
        isOptionEqualToValue={(option: any, value) => option?.id === value?.id}
        getOptionLabel={(option: ICategoryItem) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Select Category ..."
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemIcon>
              <Iconify icon={option.icon || CATEGORY_ICON} />
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
              Add New Category
            </Button>
          </Box>
          <CommonDialog
            title="Create New Category"
            open={createNewDialog.value}
            onClose={createNewDialog.onFalse}
          >
            <CategoryCreateFormContainer
              onSuccess={createNewDialog.onFalse}
              workspaceId={workspaceId}
            />
          </CommonDialog>
        </>
      )}
    </Stack>
  );
}
