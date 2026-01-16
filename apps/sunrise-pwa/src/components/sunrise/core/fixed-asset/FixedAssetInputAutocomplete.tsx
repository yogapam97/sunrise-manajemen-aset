import type { IFixedAssetItem } from "src/types/fixed-asset";

import { useState } from "react";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";

import {
  Box,
  Stack,
  Avatar,
  Button,
  ListItem,
  TextField,
  Autocomplete,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { getAllFixedAssets } from "src/api/fixed-asset-api";

import Iconify from "src/components/iconify";

import { useThumbnail } from "../../hook/useThumbnail";

type FixedAssetInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: IFixedAssetItem | null;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
};

export default function FixedAssetInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  size,
  multiple,
  error,
  helperText,
}: FixedAssetInputAutocompleteProps) {
  let fixedAssets: IFixedAssetItem[] = [];
  const createThumbnail = useThumbnail({});
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["fixedAssets", search],
    queryFn: () => getAllFixedAssets(workspaceId, { search }),
  });

  if (isSuccess) {
    ({ data: fixedAssets } = data);
  }

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);

  return (
    <Stack spacing={1}>
      <Autocomplete
        fullWidth
        defaultValue={defaultValue}
        onChange={onChange}
        loading={isLoading}
        options={fixedAssets}
        multiple={multiple}
        size={size}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Select FixedAsset ..."
            error={error}
            helperText={helperText}
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={option.thumbnail ? option.thumbnail : createThumbnail(option.name)}
                alt={option.name}
              />
            </ListItemAvatar>
            <ListItemText primary={option.name} secondary={option?.code} />
          </ListItem>
        )}
      />
      <Box>
        <Button
          LinkComponent={RouterLink}
          href={paths.app.fixedAsset.create(workspaceId)}
          size="small"
          variant="outlined"
          endIcon={<Iconify icon="mdi:external-link" />}
        >
          Create New Fixed Asset
        </Button>
      </Box>
    </Stack>
  );
}
