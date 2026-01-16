// types
import type { IWorkspaceItem } from "src/types/workspace";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

// @mui
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";

import { useRouter } from "src/routes/hooks";

// components
import Iconify from "src/components/iconify";
import SearchNotFound from "src/components/search-not-found";

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: IWorkspaceItem[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
};

export default function WorkspaceSearch({ query, results, onSearch, hrefItem }: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(hrefItem(id));
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: "unset" }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, workspace, { inputValue }) => {
        const matches = match(workspace.name, inputValue);
        const parts = parse(workspace.name, matches);

        return (
          <Box
            component="li"
            {...props}
            onClick={() => handleClick(workspace.id ?? "")}
            key={workspace.id}
          >
            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? "primary" : "textPrimary"}
                  sx={{
                    typography: "body2",
                    fontWeight: part.highlight ? "fontWeightSemiBold" : "fontWeightMedium",
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}
