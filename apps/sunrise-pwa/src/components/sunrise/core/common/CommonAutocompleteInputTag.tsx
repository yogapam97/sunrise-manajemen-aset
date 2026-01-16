import type { FilterOptionsState } from "@mui/material";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import React, { useState } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions<string>();

const filterOptions = (options: string[], params: FilterOptionsState<string>) => {
  const filtered = filter(options, params);
  const { inputValue } = params;
  // Suggest the creation of a new value
  if (inputValue !== "" && !options.includes(inputValue.trim())) {
    filtered.push(`Add "${inputValue}"`);
  }
  return filtered;
};

interface CommonAutocompleteInputTagProps {
  defaultValue?: string[];
  size?: "small" | "medium";
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  hideHelperText?: boolean;
}

const CommonAutocompleteInputTag: React.FC<CommonAutocompleteInputTagProps> = ({
  defaultValue = [],
  onChange,
  size = "medium",
  placeholder = "Add a tag",
  hideHelperText = false,
}) => {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [currentInputValue, setCurrentInputValue] = useState<string>("");

  const handleAddTag = (newTag: string) => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const updatedTags = [...tags, trimmedTag];
      setTags(updatedTags);
      if (onChange) {
        onChange(updatedTags);
      }
    }
    setCurrentInputValue("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.endsWith(" ")) {
      handleAddTag(value);
    } else {
      setCurrentInputValue(value);
    }
  };

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    if (newValue.length === 0) {
      setTags([]);
      if (onChange) {
        onChange([]);
      }
      return;
    }

    const newTags = newValue.filter((newTag) => !tags.includes(newTag));

    const updatedTags = [...tags, ...newTags];
    setTags(updatedTags);
    if (onChange) {
      onChange(updatedTags);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => () => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
    if (onChange) {
      onChange(updatedTags);
    }
  };

  return (
    <Box>
      <Autocomplete
        multiple
        freeSolo
        value={tags}
        size={size}
        onChange={handleSelect}
        inputValue={currentInputValue}
        onInputChange={(event, newInputValue) => setCurrentInputValue(newInputValue)}
        filterOptions={filterOptions}
        options={[]}
        getOptionLabel={(option) => option}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              size="small"
              label={option}
              {...getTagProps({ index })}
              key={index}
              onDelete={handleDeleteTag(option)}
            />
          ))
        }
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField {...params} placeholder={placeholder} onChange={handleInputChange} />
        )}
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            key={option}
            onClick={() => handleAddTag(option.startsWith('Add "') ? option.slice(5, -1) : option)}
          >
            {option}
          </MenuItem>
        )}
      />
      {!hideHelperText && (
        <FormHelperText>Type and press space or enter to create a tag.</FormHelperText>
      )}
    </Box>
  );
};

export default CommonAutocompleteInputTag;
