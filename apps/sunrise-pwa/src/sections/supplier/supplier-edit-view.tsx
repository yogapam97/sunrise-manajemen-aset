"use client";

import type { ISupplierItem, ISupplierPayload } from "src/types/supplier";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { updateSupplier, getSupplierIdById } from "src/api/supplier-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import SupplierForm from "src/components/sunrise/core/supplier/SupplierForm";

import { useWorkspaceContext } from "src/auth/hooks";

type SupplierEditViewProps = {
  supplierId: string;
};

export default function SupplierEditView({ supplierId }: SupplierEditViewProps) {
  let defaultSupplier: ISupplierItem = {} as ISupplierItem;
  const settings = useSettingsContext();
  const { workspace } = useWorkspaceContext();
  const [isNavigating, setIsNavigating] = useState(false);
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const {
    data,
    isSuccess,
    isLoading: loadSupplierLoading,
  } = useQuery({
    queryKey: ["categories", supplierId],
    queryFn: () => getSupplierIdById(supplierId),
  });

  if (isSuccess) {
    ({ data: defaultSupplier } = data);
  }

  const supplierMutation = useMutation(
    (supplier: ISupplierPayload) => updateSupplier(defaultSupplier?.id as string, supplier),
    {
      onSuccess: () => {
        enqueueSnackbar("Supplier updated", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.supplier.root(workspace?.id as string)}`);
        queryClient.invalidateQueries(["categories"]);
      },
      onError: (error: any) => {
        if (error.errors.length) {
          setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
        }
      },
    }
  );
  const handleSubmit = useCallback(
    (supplierPayload: ISupplierPayload) => {
      setSubmitErrors([]);
      supplierMutation.mutate(supplierPayload);
    },
    [supplierMutation]
  );

  if (loadSupplierLoading || isNavigating) {
    return <LoadingScreen height="50vh" message="Loading Supplier ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          {isSuccess && (
            <SupplierForm
              isLoading={supplierMutation.isLoading}
              onSubmit={handleSubmit}
              defaultSupplier={defaultSupplier}
              submitErrors={submitErrors}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
