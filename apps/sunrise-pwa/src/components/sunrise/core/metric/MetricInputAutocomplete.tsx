import type { IMetricItem } from "src/types/metric";

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
import { useGetAllMetrics } from "../../hook/useMetrics";
import { ADD_ICON, NUMERICAL_ICON, CATEGORICAL_ICON } from "../icon-definitions";
import MetricCreateFormContainer from "../../container/metric/MetricCreateFormContainer";

type MetricInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: IMetricItem;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  hideCreateNew?: boolean;
};

export default function MetricInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  multiple,
  error,
  helperText,
  size,
  placeholder,
  hideCreateNew = false,
}: MetricInputAutocompleteProps) {
  let metric: IMetricItem[] = [];
  const createNewDialog = useBoolean();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useGetAllMetrics(workspaceId, { search });

  if (isSuccess) {
    ({ data: metric } = data);
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
        options={metric}
        size={size}
        multiple={multiple}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            error={error}
            helperText={helperText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder || "Select Metric ..."}
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemIcon>
              {option.type === "categorical" && <Iconify icon={CATEGORICAL_ICON} />}
              {option.type === "numerical" && <Iconify icon={NUMERICAL_ICON} />}
            </ListItemIcon>
            <ListItemText primary={option.name} />
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
              Add New Metric
            </Button>
          </Box>
          <CommonDialog
            title="Create New Metric"
            open={createNewDialog.value}
            onClose={createNewDialog.onFalse}
          >
            <MetricCreateFormContainer
              onSuccess={createNewDialog.onFalse}
              workspaceId={workspaceId}
            />
          </CommonDialog>
        </>
      )}
    </Stack>
  );
}
