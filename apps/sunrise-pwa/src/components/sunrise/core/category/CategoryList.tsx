// @mui
//
import type { IPagination } from "src/types/pagination";
import type { ICategoryItem } from "src/types/category";

import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import { LoadingScreen } from "src/components/loading-screen";
import EmptyContent from "src/components/empty-content/empty-content";

import CategoryItem from "./CategoryItem";

// ----------------------------------------------------------------------

type Props = {
  categories: ICategoryItem[];
  pagination: IPagination;
  isLoading: boolean;
};

export default function CategoryList({ categories, pagination, isLoading }: Props) {
  return (
    <>
      <Box
        gap={3}
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
          categories.map((category: ICategoryItem) => (
            <CategoryItem key={category.id} category={category} />
          ))
        )}
        {categories.length === 0 && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}
      </Box>

      {(pagination.totalDocs as number) > 12 && (
        <Pagination
          count={pagination.totalPages}
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
