import type { AxiosProgressEvent } from "axios";
import type { ICategoryItem } from "src/types/category";
import type { ILocationItem } from "src/types/location";
import type { ISupplierItem } from "src/types/supplier";
import type { ILifecycleItem } from "src/types/lifecycle";
import type { IFixedAssetPayload } from "src/types/fixed-asset";

import _ from "lodash";
import * as Yup from "yup";
import { parseISO } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState, useEffect, useCallback } from "react";

import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Card,
  Grid,
  Paper,
  Stack,
  Button,
  Switch,
  Avatar,
  ButtonBase,
  Typography,
  LinearProgress,
  FormControlLabel,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { fData } from "src/utils/format-number";

import { uploadFile } from "src/api/file-api";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import Upload from "../../common/upload";
import { useThumbnail } from "../../hook/useThumbnail";
import CommonCropDialog from "../common/CommonCropDialog";
import CurrencyDisplay from "../../common/CurrencyDisplay";
import VisuallyHiddenInput from "../../common/VisuallyHiddenInput";
import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import SupplierInputAutocomplete from "../supplier/SupplierInputAutocomplete";
import CategoryInputAutocomplete from "../category/CategoryInputAutocomplete";
import CommonAutocompleteInputTag from "../common/CommonAutocompleteInputTag";
import LifecycleInputAutocomplete from "../lifecycle/LIfecycleInputAutocomplete";
import {
  CHECK_ICON,
  TRANSITION_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  FIXED_ASSET_TANGIBLE_ICON,
  FIXED_ASSET_INTANGIBLE_ICON,
} from "../icon-definitions";

type FixedAssetFormProps = {
  workspaceId: string;
  defaultFixedAsset?: IFixedAssetPayload;
  onSubmit: (fixedAsset: IFixedAssetPayload) => void;
  submitErrors?: any[];
  loading?: boolean;
  isEdit?: boolean;
};

const FixedAssetSchema: Yup.ObjectSchema<IFixedAssetPayload> = Yup.object().shape({
  id: Yup.string().nullable(),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot be longer than 80 characters"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  serial_number: Yup.string().nullable().max(60, "Name cannot be longer than 60 characters"),
  tags: Yup.array(),
  type: Yup.string()
    .required("Type is required")
    .oneOf(["tangible", "intangible"], "Type must be either tangible or intangible"),
  purchase_cost: Yup.number().typeError("Please enter a valid number").nullable(),
  purchase_date: Yup.date().nullable(),
  category: Yup.object().nullable(),
  location: Yup.object().nullable(),
  lifecycle: Yup.object().nullable(),
  supplier: Yup.object().nullable(),
  assignee: Yup.object().nullable(),
  description: Yup.string().nullable(),
  thumbnail: Yup.string().nullable(),
  images: Yup.array(),
  is_calculate_depreciation: Yup.boolean().nullable(),
  active_start_date: Yup.date()
    .typeError("Active start date must be valid date")
    .nullable()
    .when("is_calculate_depreciation", (isCalculatedDepreciation, schema) =>
      isCalculatedDepreciation[0]
        ? schema.required("Active start date is required when calculating depreciation")
        : schema.nullable()
    ),
  active_end_date: Yup.date()
    .typeError("Active end date must be valid date")
    .nullable()
    .when("is_calculate_depreciation", (isCalculatedDepreciation, schema) =>
      isCalculatedDepreciation[0]
        ? schema.required("Active start end is required when calculating depreciation")
        : schema.nullable()
    ),
  warranty_expire_date: Yup.date().nullable(),
});

export default function FixedAssetForm({
  workspaceId,
  defaultFixedAsset,
  loading,
  submitErrors,
  onSubmit,
  isEdit,
}: FixedAssetFormProps) {
  const commonCropDialog = useBoolean();
  const [cropImg, setCropImg] = useState<string | undefined>("");
  const createThumbnail = useThumbnail();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues: IFixedAssetPayload = useMemo(
    () => ({
      id: defaultFixedAsset?.id || "",
      name: defaultFixedAsset?.name || "",
      code: defaultFixedAsset?.code || "",
      serial_number: defaultFixedAsset?.serial_number || "",
      tags: defaultFixedAsset?.tags || [],
      type: defaultFixedAsset?.type || "tangible",
      purchase_cost: defaultFixedAsset?.purchase_cost || 0,
      purchase_date: defaultFixedAsset?.purchase_date
        ? parseISO(defaultFixedAsset?.purchase_date)
        : null,
      category: defaultFixedAsset?.category || {},
      location: defaultFixedAsset?.location || {},
      lifecycle: defaultFixedAsset?.lifecycle || {},
      assignee: defaultFixedAsset?.assignee || {},
      supplier: defaultFixedAsset?.supplier || {},
      description: defaultFixedAsset?.description || "",
      thumbnail: defaultFixedAsset?.thumbnail || null,
      images: defaultFixedAsset?.images || [],
      is_calculate_depreciation: defaultFixedAsset?.is_calculate_depreciation || false,
      active_start_date: defaultFixedAsset?.active_start_date
        ? parseISO(defaultFixedAsset?.active_start_date)
        : null,
      active_end_date: defaultFixedAsset?.active_end_date
        ? parseISO(defaultFixedAsset?.active_end_date)
        : null,
      warranty_expire_date: defaultFixedAsset?.warranty_expire_date
        ? parseISO(defaultFixedAsset?.warranty_expire_date)
        : null,
    }),
    [defaultFixedAsset]
  );

  const methods = useForm<IFixedAssetPayload>({
    resolver: yupResolver(FixedAssetSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    getValues,
    watch,
  } = methods;
  const values = watch();

  useEffect(() => {
    if (!_.isEmpty(submitErrors)) {
      submitErrors?.forEach((error) => {
        setError(error.field, { message: error.message });
      });
    }

    if (!_.isEmpty(errors)) {
      enqueueSnackbar("Please check again your input", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  }, [setError, submitErrors, errors, enqueueSnackbar]);

  const [uploadThumbnailProgress, setUploadThumbnailProgress] = useState(0);
  const [uploadImagesProgress, setUploadImagesProgress] = useState(0);
  const uploadThumbnailMutation = useMutation(
    (file: File) =>
      uploadFile(file, (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total ?? 1; // Use 1 as a fallback to avoid division by zero
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        setUploadThumbnailProgress(percentCompleted);
      }),
    {
      onSuccess: (data) => {
        setValue("thumbnail", data?.file_url as string);
      },
    }
  );
  const uploadImagesMutation = useMutation(
    (file: File) =>
      uploadFile(file, (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total ?? 1; // Use 1 as a fallback to avoid division by zero
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        setUploadImagesProgress(percentCompleted);
      }),
    {
      onSuccess: (data) => {
        setValue("images", [...(getValues("images") as never), data?.file_url]);
      },
    }
  );
  const { isLoading: isLoadingUploadThumbnail } = uploadThumbnailMutation;

  const { isLoading: isLoadingUploadImages } = uploadImagesMutation;

  const handleThumbnailChange = (file: File) => {
    setCropImg(URL.createObjectURL(file));
    commonCropDialog.onTrue();
    setUploadThumbnailProgress(0);
  };

  const handleCrop = (croppedImage: any) => {
    uploadThumbnailMutation.mutate(croppedImage as File);
    commonCropDialog.onFalse();
  };

  const handleCategoryChange = (event: any, value: ICategoryItem | null) => {
    setValue("category", value);
  };

  const handleLocationChange = (event: any, value: ILocationItem | null) => {
    setValue("location", value);
  };

  const handleLifecycleChange = (event: any, value: ILifecycleItem | null) => {
    setValue("lifecycle", value);
  };

  const handleSupplierChange = (event: any, value: ISupplierItem | null) => {
    setValue("supplier", value);
  };

  const handleAssigneeChange = (event: any, value: any | null) => {
    setValue("assignee", value);
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        uploadImagesMutation.mutate(newFile);
      }
    },
    [uploadImagesMutation]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue("images", filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue("images", []);
  }, [setValue]);

  const handleChangeTags = (tags: string[]) => {
    setValue("tags", tags);
  };

  const handleInputSubmit = handleSubmit(async (inputValues: IFixedAssetPayload) =>
    onSubmit(inputValues as IFixedAssetPayload)
  );

  return (
    <>
      <Card sx={{ p: 4 }}>
        <FormProvider methods={methods} onSubmit={handleInputSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Card variant="outlined" sx={{ p: 4, boxShadow: 0 }}>
                  <Stack spacing={1.5} alignItems="center">
                    {isLoadingUploadThumbnail ? (
                      <Box sx={{ height: 220 }} display="flex" alignItems="center">
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress variant="determinate" value={uploadThumbnailProgress} />
                          <Typography variant="caption">{`${uploadThumbnailProgress}%`}</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Avatar
                        sx={{ height: 256, width: 256 }}
                        variant="rounded"
                        src={getValues("thumbnail") || createThumbnail(getValues("name"))}
                      />
                    )}
                    {!getValues("thumbnail") && (
                      <Button
                        disabled={uploadThumbnailMutation.isLoading}
                        component="label"
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="solar:upload-outline" />}
                      >
                        Upload Thumbnail
                        <VisuallyHiddenInput
                          type="file"
                          onChange={(e) => {
                            if (e.target.files) {
                              const file = e.target.files[0];
                              const maxSize = 2 * 1024 * 1024; // 2MB

                              if (file && file.size > maxSize) {
                                alert("File is too large, please select a file smaller than 2MB.");
                              } else if (file) {
                                handleThumbnailChange(file);
                              }
                            }
                          }}
                          accept="image/png, image/jpg, image/gif, image/jpeg"
                        />
                      </Button>
                    )}
                    {getValues("thumbnail") && (
                      <Button color="error" onClick={() => setValue("thumbnail", null as never)}>
                        Remove
                      </Button>
                    )}
                  </Stack>
                </Card>
                <Card variant="outlined" sx={{ p: 2, boxShadow: 0, minHeight: 250 }}>
                  <Stack spacing={1.5} alignItems="center">
                    <Upload
                      files={getValues("images") as File[]}
                      accept={{
                        "image/png": [],
                        "image/jpg": [],
                        "image/gif": [],
                        "image/jpeg": [],
                      }}
                      multiple
                      thumbnail
                      maxSize={2097152}
                      onDrop={handleDrop}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                    />
                    {isLoadingUploadImages && (
                      <Box sx={{ width: 220 }} display="flex" alignItems="center">
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress variant="determinate" value={uploadImagesProgress} />
                          <Typography variant="caption">{`${uploadImagesProgress}%`}</Typography>
                        </Box>
                      </Box>
                    )}

                    <Typography
                      variant="caption"
                      sx={{
                        mx: "auto",
                        display: "block",
                        textAlign: "center",
                        color: "text.disabled",
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(2097152)}
                    </Typography>
                  </Stack>
                </Card>
                <Card variant="outlined" sx={{ p: 2, boxShadow: 0 }}>
                  <Stack spacing={1.5}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Default Location</Typography>
                      {!isEdit && (
                        <LocationInputAutocomplete
                          workspaceId={workspaceId}
                          defaultValue={defaultFixedAsset?.location}
                          onChange={handleLocationChange}
                          disabled={isEdit}
                        />
                      )}
                      {isEdit && (
                        <Stack spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            To change location, do relocation
                          </Typography>
                          <Button
                            LinkComponent={RouterLink}
                            variant="contained"
                            color="info"
                            size="small"
                            href={paths.app.relocation.create(workspaceId, defaultFixedAsset?.id)}
                            startIcon={<Iconify icon={RELOCATION_ICON} />}
                          >
                            Do Relocation
                          </Button>
                        </Stack>
                      )}
                    </Stack>

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Default Assignee</Typography>
                      {!isEdit && (
                        <MemberInputAutocomplete
                          workspaceId={workspaceId}
                          defaultValue={defaultFixedAsset?.assignee}
                          onChange={handleAssigneeChange}
                        />
                      )}
                      {isEdit && (
                        <Stack spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            To change assignee, do assignment
                          </Typography>
                          <Button
                            LinkComponent={RouterLink}
                            variant="contained"
                            color="info"
                            size="small"
                            href={paths.app.assignment.create(workspaceId, defaultFixedAsset?.id)}
                            startIcon={<Iconify icon={ASSIGNMENT_ICON} />}
                          >
                            Do Assignment
                          </Button>
                        </Stack>
                      )}
                    </Stack>

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Lifecycle</Typography>
                      {!isEdit && (
                        <LifecycleInputAutocomplete
                          workspaceId={workspaceId}
                          defaultValue={defaultFixedAsset?.lifecycle}
                          onChange={handleLifecycleChange}
                        />
                      )}
                      {isEdit && (
                        <Stack spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            To change lifecycle, do transition
                          </Typography>
                          <Button
                            LinkComponent={RouterLink}
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<Iconify icon={TRANSITION_ICON} />}
                            href={paths.app.transition.create(workspaceId, defaultFixedAsset?.id)}
                          >
                            Do Transition
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                    {isEdit && (
                      <Stack spacing={1.5}>
                        <Typography variant="caption" color="text.secondary">
                          For temporary allocation, do Check In/Out
                        </Typography>
                        <Button
                          component={RouterLink}
                          href={paths.app.check.create(workspaceId, defaultFixedAsset?.id)}
                          variant="contained"
                          startIcon={<Iconify icon={CHECK_ICON} />}
                        >
                          Do Check In/Out
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Name</Typography>
                  <RHFTextField
                    name="name"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter fixed asset name ..."
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Code</Typography>
                  <RHFTextField
                    name="code"
                    error={!!errors.code}
                    helperText={errors.code?.message as string}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter fixed asset code ..."
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Serial Number</Typography>
                  <RHFTextField
                    name="serial_number"
                    error={!!errors.serial_number}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter fixed asset serial number ..."
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Tag</Typography>
                  <CommonAutocompleteInputTag
                    onChange={handleChangeTags}
                    defaultValue={getValues("tags")}
                  />
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="subtitle2">Type</Typography>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                        {[
                          {
                            label: "Tangible",
                            value: "tangible",
                            icon: (
                              <Iconify icon={FIXED_ASSET_TANGIBLE_ICON} width={32} sx={{ mb: 2 }} />
                            ),
                          },
                          {
                            label: "Intangible",
                            value: "intangible",
                            icon: (
                              <Iconify
                                icon={FIXED_ASSET_INTANGIBLE_ICON}
                                width={32}
                                sx={{ mb: 2 }}
                              />
                            ),
                          },
                        ].map((item) => (
                          <Paper
                            component={ButtonBase}
                            variant="outlined"
                            key={item.label}
                            onClick={() => field.onChange(item.value)}
                            sx={{
                              p: 2.5,
                              borderRadius: 1,
                              typography: "subtitle2",
                              flexDirection: "column",
                              ...(item.value === field.value && {
                                borderWidth: 2,
                                borderColor: "text.primary",
                              }),
                            }}
                          >
                            {item.icon}
                            {item.label}
                          </Paper>
                        ))}
                      </Box>
                    )}
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Purchase Cost</Typography>
                  <RHFTextField
                    name="purchase_cost"
                    error={!!errors.purchase_cost}
                    helperText={errors.purchase_cost?.message as string}
                    fullWidth
                    variant="outlined"
                    placeholder="0.0"
                  />
                  <CurrencyDisplay variant="caption" value={Number(values.purchase_cost)} />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Purchase Date</Typography>
                  <Controller
                    name="purchase_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>

                <Card variant="outlined" sx={{ p: 2, boxShadow: 0 }}>
                  <Stack spacing={1.5}>
                    <Controller
                      name="is_calculate_depreciation"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch {...field} checked={getValues("is_calculate_depreciation")} />
                          }
                          label={
                            <Typography variant="subtitle2">Calculate Depreciation</Typography>
                          }
                        />
                      )}
                    />
                    {values.is_calculate_depreciation && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Active Start Date</Typography>
                            <Controller
                              name="active_start_date"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  format="dd/MM/yyyy"
                                  onChange={(date) => {
                                    field.onChange(date);
                                    setValue("active_end_date", null);
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      error: !!errors.active_start_date,
                                      helperText: errors.active_start_date?.message?.toString(),
                                    },
                                  }}
                                />
                              )}
                            />
                            <Box>
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  setValue("active_start_date", getValues("purchase_date"))
                                }
                                size="small"
                              >
                                Set same as purchase date
                              </Button>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Active End Date</Typography>
                            <Controller
                              name="active_end_date"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  format="dd/MM/yyyy"
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      error: !!errors.active_end_date,
                                      helperText: errors.active_end_date?.message?.toString(),
                                    },
                                  }}
                                  disabled={!values.active_start_date}
                                  minDate={values.active_start_date}
                                />
                              )}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Typography variant="subtitle2">Initial value:</Typography>
                              <CurrencyDisplay
                                variant="caption"
                                value={Number(values.purchase_cost)}
                              />
                            </Stack>
                            <Typography variant="caption">* Based on purchase price</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    )}
                  </Stack>
                </Card>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Category</Typography>
                  <CategoryInputAutocomplete
                    workspaceId={workspaceId}
                    defaultValue={defaultFixedAsset?.category}
                    onChange={handleCategoryChange}
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Supplier</Typography>
                  <SupplierInputAutocomplete
                    workspaceId={workspaceId}
                    defaultValue={defaultFixedAsset?.supplier}
                    onChange={handleSupplierChange}
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Description</Typography>
                  <RHFTextField
                    name="description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder="Enter fixed asset description ..."
                  />
                </Stack>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Warranty Expire Date</Typography>
                  <Controller
                    name="warranty_expire_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
                <Stack spacing={1.5} direction="row">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    loading={loading}
                  >
                    Save Fixed Asset
                  </LoadingButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>

      <CommonCropDialog
        open={commonCropDialog.value}
        src={cropImg}
        onCrop={handleCrop}
        onClose={commonCropDialog.onFalse}
      />
    </>
  );
}
