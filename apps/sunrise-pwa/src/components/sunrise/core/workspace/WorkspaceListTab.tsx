import type { SyntheticEvent } from "react";

import { debounce } from "lodash";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Stack, TextField, InputAdornment } from "@mui/material";

import Iconify from "src/components/iconify";

import WorkspaceList from "./WorkspaceList";

type WorkspaceListTabProps = {
  myWorkspaceData: any;
  myWorkspaceIsLoading: any;
  myWorkspaceIsSuccess: any;
  invitedData: any;
  invitedIsLoading: any;
  invitedIsSuccess: any;
  onSearch: (search: string) => void;
  search: string;
  onChangeTab: (tab: string) => void;
  tab: string;
  onJoinWorkspace: (workspaceId: string) => void;
  onRejectWorkspace: (workspaceId: string) => void;
};

export default function WorkspaceListTab({
  myWorkspaceData,
  myWorkspaceIsLoading,
  myWorkspaceIsSuccess,
  invitedData,
  invitedIsLoading,
  invitedIsSuccess,
  onSearch,
  search,
  onChangeTab,
  tab,
  onJoinWorkspace,
  onRejectWorkspace,
}: WorkspaceListTabProps) {
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    onChangeTab(newValue);
  };

  // Debounce setSearchQuery directly
  const handleSearchDebounce = debounce((searchValue: string) => {
    onSearch(searchValue);
  }, 500);

  const renderToolbar = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
    >
      <TextField
        placeholder="Search ..."
        onChange={(e) => handleSearchDebounce(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <Iconify icon="material-symbols:search-rounded" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );

  return (
    <Box>
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderToolbar}
      </Stack>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab
              label={`My Workspace (${myWorkspaceData?.pagination?.total || 0})`}
              value="myWorkspace"
            />
            <Tab
              label={`Invited (${invitedData?.pagination?.total || 0})`}
              value="invitedWorkspace"
            />
          </TabList>
        </Box>
      </TabContext>

      <Box sx={{ mt: 2 }}>
        {tab === "myWorkspace" && myWorkspaceIsSuccess && (
          <WorkspaceList
            isLoading={myWorkspaceIsLoading}
            workspaces={myWorkspaceData.data}
            pagination={myWorkspaceData.pagination}
            onJoinWorkspace={() => {}}
            onRejectWorkspace={() => {}}
          />
        )}
        {tab === "invitedWorkspace" && invitedIsSuccess && (
          <WorkspaceList
            isLoading={invitedIsLoading}
            workspaces={invitedData.data}
            pagination={invitedData.pagination}
            onJoinWorkspace={onJoinWorkspace}
            onRejectWorkspace={onRejectWorkspace}
          />
        )}
      </Box>
    </Box>
  );
}
