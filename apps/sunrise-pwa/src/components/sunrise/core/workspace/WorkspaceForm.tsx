import type { AxiosProgressEvent } from "axios";
import type { IWorkspaceItem, IWorkspacePayload } from "src/types/workspace";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Button, Avatar, Typography, LinearProgress } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import { uploadFile } from "src/api/file-api";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import WorkspaceIcon from "./WorkspaceIcon";
import { useAvatarIcon } from "../../hook/useAvatarIcon";
import CommonCropDialog from "../common/CommonCropDialog";
import AvatarInputSelection from "../../common/AvatarIconInput";
import VisuallyHiddenInput from "../../common/VisuallyHiddenInput";
import CurrencyAutocomplete from "../../common/autocomplete/CurrencyAutocomplete";

type WorkspaceFormProps = {
  onSubmit: (workspace: IWorkspacePayload) => void;
  workspace?: IWorkspaceItem;
  isLoading?: boolean;
};
export default function WorkspaceForm({ onSubmit, workspace, isLoading }: WorkspaceFormProps) {
  const mdUp = useResponsive("up", "md");
  const createAvatarIcon = useAvatarIcon({});
  const { back } = useRouter();
  const commonCropDialog = useBoolean();
  const [cropImg, setCropImg] = useState<string | undefined>("");

  const WorkspaceSchema: Yup.ObjectSchema<IWorkspacePayload> = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email must be a valid email address").optional(),
    phone: Yup.string().optional(),
    default_icon: Yup.string().required(),
    description: Yup.string(),
    currency: Yup.object({
      symbol: Yup.string().required("Currency symbol is required"),
      name: Yup.string().required("Currency name is required"),
      symbol_native: Yup.string().required("Currency symbol native is required"),
      decimal_digits: Yup.number().required("Currency decimal digits is required"),
      rounding: Yup.number().required("Currency rounding is required"),
      code: Yup.string().required("Currency code is required"),
      name_plural: Yup.string().required("Currency name plural is required"),
    }).required("Currency is required"),
    // time_zone: Yup.object({
    //   value: Yup.string().required('Timezone value is required'),
    //   abbr: Yup.string().required('Abbreviation is required'),
    //   offset: Yup.number().required('Offset value is required'),
    //   isdst: Yup.boolean().required('Is DST value is required'),
    //   text: Yup.string().required('Text value is required'),
    //   utc: Yup.array()
    //     .of(Yup.string().required('UTC String is required'))
    //     .required('This field is required'),
    // }).required('Time Zone is required'),
    logo: Yup.string().nullable(),
  });

  const defaultValues: IWorkspacePayload = useMemo(
    () => ({
      name: workspace?.name || "",
      email: workspace?.email || "",
      phone: workspace?.phone || "",
      default_icon: workspace?.default_icon || "boxSeam",
      description: workspace?.description || "",
      currency: workspace?.currency || null,
      time_zone: workspace?.time_zone || null,
      logo: workspace?.logo || null,
    }),
    [workspace]
  );

  const methods = useForm({
    resolver: yupResolver(WorkspaceSchema),
    defaultValues,
  });

  const {
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  watch();

  const handleInputSubmit = handleSubmit(async (values: IWorkspacePayload) => onSubmit(values));

  const [uploadLogoProgress, setUploadLogoProgress] = useState(0);
  const uploadMutation = useMutation(
    (file: File) =>
      uploadFile(file, (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total ?? 1; // Use 1 as a fallback to avoid division by zero
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        setUploadLogoProgress(percentCompleted);
      }),
    {
      onSuccess: (data) => {
        setValue("logo", data?.file_url as never);
      },
    }
  );

  const { isLoading: isLoadingLogo } = uploadMutation;

  const handleLogoChange = (file: File) => {
    setCropImg(URL.createObjectURL(file));
    commonCropDialog.onTrue();
    setUploadLogoProgress(0);
  };

  const handleCrop = (croppedImage: any) => {
    uploadMutation.mutate(croppedImage as File);
    commonCropDialog.onFalse();
  };

  const renderAction = (
    <Stack direction="row" sx={{ my: 2 }}>
      <LoadingButton type="submit" variant="contained" size="large" loading={isLoading}>
        {!workspace ? "Create Workspace" : "Save Changes"}
      </LoadingButton>
      <Button sx={{ ml: 2 }} size="large" onClick={() => back()} disabled={isLoading}>
        Cancel
      </Button>
    </Stack>
  );

  const renderHeader = (
    <>
      {mdUp && <Grid item md={2} />}
      <Grid item md={8}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <WorkspaceIcon />
          <Typography variant="h6">{!workspace ? "Create Workspace" : "Update Changes"}</Typography>
        </Stack>
      </Grid>
      {mdUp && <Grid item md={2} />}
    </>
  );

  const renderInput = (
    <>
      {mdUp && <Grid item md={2} />}
      <Grid item xs={12} md={4}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5} alignItems="center">
              {isLoadingLogo ? (
                <Box sx={{ height: 220 }} display="flex" alignItems="center">
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress variant="determinate" value={uploadLogoProgress} />
                    <Typography variant="caption">{`${uploadLogoProgress}%`}</Typography>
                  </Box>
                </Box>
              ) : (
                <Avatar
                  sx={{ height: 256, width: 256 }}
                  variant="rounded"
                  src={getValues("logo") || createAvatarIcon(getValues("default_icon"))}
                />
              )}
              {!getValues("logo") && (
                <Button
                  disabled={uploadMutation.isLoading}
                  component="label"
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:upload-outline" />}
                >
                  Upload Logo
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        const maxSize = 2 * 1024 * 1024; // 2MB

                        if (file && file.size > maxSize) {
                          alert("File is too large, please select a file smaller than 2MB.");
                        } else if (file) {
                          handleLogoChange(file);
                        }
                      }
                    }}
                    accept="image/png, image/jpg, image/gif, image/jpeg"
                  />
                </Button>
              )}
              {getValues("logo") && (
                <Button color="error" onClick={() => setValue("logo", null as never)}>
                  Remove
                </Button>
              )}
            </Stack>
            <AvatarInputSelection
              value={getValues("default_icon")}
              onAvatarSelect={(icon) => setValue("default_icon", icon as never)}
            />
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Name *</Typography>
              <RHFTextField name="name" placeholder="Ex: My Org fixed asset ..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Contact Email (Optional)</Typography>
              <RHFTextField name="email" type="email" placeholder="Enter contact email ..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Contact Phone (Optional)</Typography>
              <RHFTextField name="phone" placeholder="Enter contact phone ..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFTextField
                multiline
                rows={2}
                name="description"
                placeholder="Simple description ..."
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Currency *</Typography>
              <CurrencyAutocomplete
                error={errors}
                onChange={(currency) => {
                  setValue("currency", currency as never);
                }}
                defaultValue={getValues("currency")}
              />
            </Stack>

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Time Zone *</Typography>
              <TimeZoneAutocomplete
                error={errors}
                noLabel
                onChange={(timezone) => setValue('time_zone', timezone)}
                defaultValue={getValues('time_zone')}
              />
            </Stack> */}
          </Stack>
        </Card>

        {renderAction}
      </Grid>
      {mdUp && <Grid item md={2} />}
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Grid container spacing={2}>
          {renderHeader}
          {renderInput}
        </Grid>
      </FormProvider>

      <CommonCropDialog
        open={commonCropDialog.value}
        src={cropImg}
        onCrop={handleCrop}
        onClose={commonCropDialog.onFalse}
      />
    </>
  );
}
