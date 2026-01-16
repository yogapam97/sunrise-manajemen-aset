"use client";

import type { ILocationItem, ILocationPayload } from "src/types/location";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { updateLocation, getLocationIdById } from "src/api/location-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import LocationForm from "src/components/sunrise/core/location/LocationForm";

import { useWorkspaceContext } from "src/auth/hooks";

type LocationEditViewProps = {
  locationId: string;
};

export default function LocationEditView({ locationId }: LocationEditViewProps) {
  let defaultLocation: ILocationItem = {} as ILocationItem;
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
    isLoading: loadLocationLoading,
  } = useQuery({
    queryKey: ["locations", locationId],
    queryFn: () => getLocationIdById(locationId),
  });

  if (isSuccess) {
    ({ data: defaultLocation } = data);
  }

  const locationMutation = useMutation(
    (location: ILocationPayload) => updateLocation(defaultLocation?.id as string, location),
    {
      onSuccess: () => {
        enqueueSnackbar("Location updated", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.location.root(workspace?.id as string)}`);
        queryClient.invalidateQueries(["locations"]);
      },
      onError: (error: any) => {
        if (error.errors.length) {
          setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
        }
      },
    }
  );
  const handleSubmit = useCallback(
    (locationPayload: ILocationPayload) => {
      setSubmitErrors([]);
      locationMutation.mutate(locationPayload);
    },
    [locationMutation]
  );

  if (loadLocationLoading || isNavigating) {
    return <LoadingScreen height="50vh" message="Loading Location ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          {isSuccess && (
            <LocationForm
              isLoading={locationMutation.isLoading}
              onSubmit={handleSubmit}
              defaultLocation={defaultLocation}
              submitErrors={submitErrors}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
