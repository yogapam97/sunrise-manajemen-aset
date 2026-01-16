import { useState } from "react";
import { debounce } from "lodash";
import { useSnackbar } from "notistack";

import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  ListItem,
  Skeleton,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  ListItemText,
  DialogContent,
  ListItemAvatar,
  InputAdornment,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

import { useWorkspaceContext } from "src/auth/hooks";

import WorkspaceLogo from "./WorkspaceLogo";
import useChangeWorkspacePath, { useGetAllWorkspaces } from "../../hook/useWorkspaces";

const LoadingSkeleton = () => (
  <Stack spacing={1} sx={{ my: 2 }}>
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </Stack>
);

export default function WorkspaceSelection() {
  const { workspace, setWorkspace } = useWorkspaceContext();
  const changeWorkspacePath = useChangeWorkspacePath();
  const { enqueueSnackbar } = useSnackbar();
  const workspaceSelectionDialog = useBoolean();
  const [search, setSearch] = useState("");
  const { data: workspaces, isLoading: workspacesLoading } = useGetAllWorkspaces(
    search,
    workspaceSelectionDialog.value
  );
  const handleSelectionClick = () => {
    workspaceSelectionDialog.onTrue();
  };

  const handleSelectWorkspace = (workspaceItem: any) => {
    workspaceSelectionDialog.onFalse();
    setWorkspace(workspaceItem);
    changeWorkspacePath(workspaceItem.id);
    enqueueSnackbar("Workspace Changed", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);
  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleSelectionClick}
        endIcon={<Iconify icon="mdi:caret-down-outline" />}
        sx={{ p: 1 }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <WorkspaceLogo
            workspace={workspace}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 0.5,
            }}
          />
          {workspace?.name || "Select Workspace"}
        </Stack>
      </Button>
      <Dialog open={workspaceSelectionDialog.value}>
        <DialogTitle align="center" variant="subtitle2">
          Select Workspace
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 480, height: 1, overflow: "hidden", mb: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Workspace"
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify icon="material-symbols:search-rounded" />
                  </InputAdornment>
                ),
              }}
            />
            {workspacesLoading ? (
              <LoadingSkeleton />
            ) : (
              <Scrollbar sx={{ maxHeight: 480 }}>
                <Stack sx={{ my: 2 }} spacing={1}>
                  {workspaces?.data?.map((workspaceItem: any) => (
                    <Card sx={{ p: 2 }} variant="outlined">
                      <Stack spacing={1} direction="row" alignItems="center">
                        <ListItem disablePadding key={workspaceItem.id}>
                          <ListItemAvatar>
                            <WorkspaceLogo
                              workspace={workspaceItem}
                              sx={{ width: 40, height: 40, borderRadius: "10%" }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2">{workspaceItem.name}</Typography>
                            }
                          />
                        </ListItem>

                        <Button
                          disabled={workspaceItem.id === workspace?.id}
                          variant="contained"
                          size="small"
                          onClick={() => handleSelectWorkspace(workspaceItem)}
                        >
                          {workspaceItem.id === workspace?.id ? "Current" : "Open"}
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Scrollbar>
            )}
          </Box>
        </DialogContent>

        <IconButton
          aria-label="close"
          onClick={workspaceSelectionDialog.onFalse}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="solar:close-circle-outline" />
        </IconButton>
      </Dialog>
    </Box>
  );
}
