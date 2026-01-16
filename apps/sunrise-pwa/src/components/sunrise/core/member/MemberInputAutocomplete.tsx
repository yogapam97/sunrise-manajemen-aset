import type { IMemberItem } from "src/types/member";

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
  Typography,
  Autocomplete,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { getAllMembers } from "src/api/member-api";

import Iconify from "src/components/iconify";

import { useAvatar } from "../../hook/useAvatar";
import CommonDialog from "../common/CommonDialog";
import { ADD_ICON, VERIFIED_ICON } from "../icon-definitions";
import MemberInviteFormContainer from "../../container/member/MemberInviteFormContainer";

type MemberInputAutocompleteProps = {
  workspaceId: string;
  defaultValue?: IMemberItem;
  onChange?: (event: any, value: any) => void;
  multiple?: boolean;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  hideInvite?: boolean;
};

const RenderMemberOption = ({ option }: { option: IMemberItem }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {(option?.user?.name && (
      <Typography
        variant="subtitle2"
        noWrap
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {option?.user?.name}
      </Typography>
    )) || (
      <Typography
        variant="subtitle2"
        color="text.disabled"
        noWrap
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {option?.email}
      </Typography>
    )}
    {option?.user?.email_verified && (
      <Iconify icon={VERIFIED_ICON} sx={{ width: 15, height: 15 }} color="info.main" />
    )}
  </Stack>
);

export default function MemberInputAutocomplete({
  workspaceId,
  defaultValue,
  onChange,
  multiple,
  size,
  error,
  helperText,
  placeholder,
  hideInvite = false,
}: MemberInputAutocompleteProps) {
  const createAvatar = useAvatar({
    scale: 70,
  });
  let members: IMemberItem[] = [];
  const createNewDialog = useBoolean();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["members", search],
    queryFn: () => getAllMembers(workspaceId, { search }),
  });

  if (isSuccess) {
    ({ data: members } = data);
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
        options={members}
        size={size}
        multiple={multiple}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option?.user?.name || option.email}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder || "Select Member ..."}
            error={error}
            helperText={helperText}
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemAvatar>
              <Avatar
                src={option?.user?.avatar || createAvatar(option?.user?.name || option.email)}
              />
            </ListItemAvatar>
            <ListItemText
              primary={<RenderMemberOption option={option} />}
              secondary={option?.code}
            />
          </ListItem>
        )}
      />

      {!hideInvite && (
        <>
          <Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon={ADD_ICON} />}
              onClick={createNewDialog.onTrue}
            >
              Invite New Member
            </Button>
          </Box>
          <CommonDialog
            title="Invite New Member"
            open={createNewDialog.value}
            onClose={createNewDialog.onFalse}
          >
            <MemberInviteFormContainer
              onSuccess={createNewDialog.onFalse}
              workspaceId={workspaceId}
            />
          </CommonDialog>
        </>
      )}
    </Stack>
  );
}
