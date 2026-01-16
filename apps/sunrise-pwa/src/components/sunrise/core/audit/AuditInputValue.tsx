import type { IMetricItem } from "src/types/metric";

import { Box, Chip, TextField, Autocomplete } from "@mui/material";

type AuditInputValueProps = {
  metric: IMetricItem;
  value: any;
  onChange: (event: any, value: any) => void;
  error?: boolean;
  helperText?: string;
};
export default function AuditInputValue({
  metric,
  onChange,
  value,
  error,
  helperText,
}: AuditInputValueProps) {
  const { type, labels } = metric;
  if (type === "numerical") {
    return (
      <TextField
        variant="outlined"
        value={value}
        type="number"
        error={error}
        helperText={helperText}
        onChange={(e) => onChange(e, e.target.value)}
      />
    );
  }
  if (type === "categorical") {
    if (!value) {
      return (
        <Autocomplete
          fullWidth
          onChange={onChange}
          options={labels}
          isOptionEqualToValue={(option, optionValue) => option.label === optionValue.label}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select Label ..."
              error={error}
              helperText={helperText}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              <Chip
                label={option.label}
                size="small"
                sx={{
                  backgroundColor: option.color,
                  color: (theme) => theme.palette.getContrastText(option.color),
                }}
              />
            </li>
          )}
        />
      );
    }
    return (
      <Box>
        <Chip
          key={value.label}
          label={value.label}
          size="small"
          sx={{
            backgroundColor: value.color,
            color: (theme) => theme.palette.getContrastText(value.color),
            "&:hover": {
              backgroundColor: value.color,
            },
          }}
          onDelete={() => onChange(null, null)}
        />
      </Box>
    );
  }
}
