import type { FC } from "react";
import type { Currency } from "src/types/currency";

import { isEmpty } from "lodash";

import { Stack, ListItem, TextField, Typography, Autocomplete, ListItemText } from "@mui/material";

import CommonCurrencies from "src/utils/common-currencies.json";

interface CurrencyAutocompleteProps {
  error?: any;
  onChange: (value: Currency) => void;
  defaultValue: Currency | null;
  label?: string;
  [key: string]: any;
}

const CurrencyAutocomplete: FC<CurrencyAutocompleteProps> = ({
  error,
  onChange,
  label,
  defaultValue,
  ...other
}) => {
  const handleSelectedCurrency: any = (_e: any, value: Currency) => {
    if (onChange) onChange(value);
  };

  const filterOptions = (options: Currency[], { inputValue }: { inputValue: string }) => {
    const lowercasedInput = inputValue.toLowerCase();
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(lowercasedInput) ||
        option.symbol.toLowerCase().includes(lowercasedInput) ||
        option.code.toLowerCase().includes(lowercasedInput)
    );
  };

  return (
    <Stack spacing={1}>
      <Autocomplete
        options={CommonCurrencies}
        value={isEmpty(defaultValue) ? null : defaultValue}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        onChange={handleSelectedCurrency}
        getOptionLabel={(option) => `${option.symbol} ${option.name}`}
        filterOptions={filterOptions}
        renderOption={(props, value) => (
          <ListItem {...props} key={value.name}>
            <ListItemText
              primary={<Typography variant="caption">{`${value.symbol} ${value.name}`}</Typography>}
              secondary={value?.code}
            />
          </ListItem>
        )}
        renderInput={(params: any) => (
          <TextField
            fullWidth
            error={!!error?.currency}
            helperText={error?.currency?.message}
            label={label || null}
            placeholder="Please Select Currency ..."
            {...params}
            {...other}
          />
        )}
      />
      {/* {loading && <LinearProgress />} */}
    </Stack>
  );
};

export default CurrencyAutocomplete;
