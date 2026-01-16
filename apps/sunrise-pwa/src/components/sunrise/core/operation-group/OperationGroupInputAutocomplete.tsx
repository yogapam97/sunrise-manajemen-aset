import type { IOperationGroupItem } from "src/types/operation-group";

import { useState } from "react";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { ListItem, TextField, Autocomplete, ListItemIcon } from "@mui/material";

import { getAllOperationGroups } from "src/api/operation-group-api";

import Iconify from "src/components/iconify";

import { OPERATION_GROUP_ICON } from "../icon-definitions";

type OperationGroupInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: IOperationGroupItem;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  placeholder?: string;
};

export default function OperationGroupInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  multiple,
  size,
  placeholder,
}: OperationGroupInputAutocompleteProps) {
  let operationGroup: IOperationGroupItem[] = [];
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["operationGroup", search],
    queryFn: () => getAllOperationGroups(workspaceId, { search }),
  });

  if (isSuccess) {
    ({ data: operationGroup } = data);
  }

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);
  return (
    <Autocomplete
      fullWidth
      value={defaultValue}
      onChange={onChange}
      loading={isLoading}
      options={operationGroup}
      size={size}
      multiple={multiple}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder || "Select Operation Group ..."}
        />
      )}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.id}>
          <ListItemIcon>
            <Iconify icon={OPERATION_GROUP_ICON} />
          </ListItemIcon>
        </ListItem>
      )}
    />
  );
}
