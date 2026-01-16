import type { FC } from "react";
import type { Timezone } from "timezones.json";

import { isEmpty } from "lodash";
import { useCallback } from "react";
import timezones from "timezones.json";

import { Stack, ListItem, TextField, Typography, Autocomplete, ListItemText } from "@mui/material";

interface TimezoneAutocomplete {
  error?: any;
  onChange: (timezone: Timezone) => void;
  noLabel: boolean;
  defaultValue?: Timezone | null;
  [key: string]: any;
}

const TimeZoneAutocomplete: FC<TimezoneAutocomplete> = ({
  error,
  onChange,
  noLabel,
  defaultValue,
  ...other
}) => {
  const handleSelectedTimezone: any = useCallback(
    (_e: any, value: Timezone) => {
      if (onChange) onChange(value);
    },
    [onChange]
  );

  return (
    <Stack spacing={1}>
      <Autocomplete
        options={timezones}
        value={isEmpty(defaultValue) ? null : defaultValue}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={handleSelectedTimezone}
        getOptionLabel={(plotOption) => plotOption.text}
        renderOption={(props, value) => (
          <ListItem {...props} key={value.text}>
            <ListItemText primary={<Typography variant="caption">{value.text}</Typography>} />
          </ListItem>
        )}
        renderInput={(params: any) => (
          <TextField
            fullWidth
            error={!!error?.time_zone}
            helperText={error?.time_zone?.message}
            label={noLabel ? null : "Time Zone"}
            placeholder="Please Select Time Zone ..."
            {...params}
            {...other}
          />
        )}
      />
    </Stack>
  );
};

export default TimeZoneAutocomplete;
