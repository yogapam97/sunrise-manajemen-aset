"use client";

import type { ICategoryItem } from "src/types/category";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Card, Grid, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { deleteCategory, getCategoryIdById } from "src/api/category-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import ConfirmDialog from "src/components/sunrise/common/dialog/ConfirmDialog";
import CategoryDetailTable from "src/components/sunrise/core/category/CategoryDetailTable";
import FixedAssetTableContainer from "src/components/sunrise/container/fixed-asset/FixedAssetTableContainer";
import DepreciationTableContainer from "src/components/sunrise/container/depreciation/DepreciationTableContainer";

type CategoryDetailViewProps = {
  categoryId: string;
  workspaceId: string;
};

export default function CategoryDetailView({ categoryId, workspaceId }: CategoryDetailViewProps) {
  let category: ICategoryItem = {} as ICategoryItem;

  const settings = useSettingsContext();
  const deleteDialog = useBoolean();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const deleteConfirm = useBoolean();
  const [tabValue, setTabValue] = useState("detail");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    data,
    isLoading: isDeleteLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getCategoryIdById(categoryId),
  });

  if (isSuccess) {
    ({ data: category } = data);
  }

  const { mutate, isLoading } = useMutation(() => deleteCategory(categoryId), {
    onSuccess: () => {
      push(`${paths.app.category.root(workspaceId as string)}`);
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const handleDeleteCategory = useCallback(() => {
    mutate();
    deleteDialog.onFalse();
  }, [mutate, deleteDialog]);

  if (isLoading || isDeleteLoading) {
    return <LoadingScreen height="50vh" message="Loading Category ..." />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "xl"}>
        <PageHeader
          withBackButton
          action={
            <Button
              variant="contained"
              component={RouterLink}
              href={paths.app.category.edit(workspaceId as string, categoryId)}
            >
              Edit Category
            </Button>
          }
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleTabChange}>
                  <Tab label="Detail" value="detail" />
                  <Tab label="Fixed Asset" value="fixedAsset" />
                  <Tab label="Depreciation" value="depreciation" />
                </TabList>
              </Box>
            </TabContext>
            <Box sx={{ mt: 1 }}>
              {tabValue === "detail" && (
                <Card>
                  <CategoryDetailTable workspaceId={workspaceId} category={category} />
                </Card>
              )}
              {tabValue === "fixedAsset" && (
                <FixedAssetTableContainer
                  workspaceId={workspaceId}
                  filter={{ category: [categoryId] }}
                  config={{ hideImport: true, hideFilter: true }}
                />
              )}
              {tabValue === "depreciation" && (
                <DepreciationTableContainer
                  workspaceId={workspaceId}
                  filter={{ category: [categoryId] }}
                  config={{ hideFilter: true }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{category?.name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this category?
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteCategory}>
            Delete
          </Button>
        }
      />
    </>
  );
}
