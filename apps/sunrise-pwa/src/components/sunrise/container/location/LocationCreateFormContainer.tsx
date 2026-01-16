import type { ILocationPayload } from "src/types/location";

import { useSnackbar } from "notistack";
import { useState, useCallback } from "react";

import LocationForm from "../../core/location/LocationForm";
import { useCreateLocation } from "../../hook/useLocations";

type LocationCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: (response: any) => void;
};

export default function LocationCreateFormContainer({
  workspaceId,
  onSuccess,
}: LocationCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const locationMutation = useCreateLocation({
    onSuccess: (response: any) => {
      enqueueSnackbar("Location created", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });

  const handleSubmit = useCallback(
    (locationPayload: ILocationPayload) => {
      setSubmitErrors([]);
      locationMutation.mutate(locationPayload);
    },
    [locationMutation]
  );

  return (
    <LocationForm
      isLoading={locationMutation.isLoading}
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
    />
  );
}
