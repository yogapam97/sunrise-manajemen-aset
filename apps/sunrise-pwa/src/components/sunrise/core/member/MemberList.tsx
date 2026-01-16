// @mui
import type { IMemberItem } from "src/types/member";
//
import type { IPagination } from "src/types/pagination";

import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import { LoadingScreen } from "src/components/loading-screen";
import EmptyContent from "src/components/empty-content/empty-content";

import MemberItem from "./MemberItem";

// ----------------------------------------------------------------------

type Props = {
  members: IMemberItem[];
  pagination: IPagination;
  onRemove: (member: IMemberItem) => void;
  onResendInvitation: (member: IMemberItem) => void;
  isLoading: boolean;
};

export default function MemberList({
  members,
  pagination,
  isLoading,
  onRemove,
  onResendInvitation,
}: Props) {
  return (
    <>
      <Box
        gap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {isLoading ? (
          <LoadingScreen />
        ) : (
          members.length &&
          members.map((member: IMemberItem) => (
            <MemberItem
              key={member.id}
              member={member}
              onRemove={onRemove}
              onResendInvitation={onResendInvitation}
            />
          ))
        )}
        {members.length === 0 && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}
      </Box>

      {isLoading && (pagination.total as number) > 12 && (
        <Pagination
          count={pagination.total}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: "center",
            },
          }}
        />
      )}
    </>
  );
}
