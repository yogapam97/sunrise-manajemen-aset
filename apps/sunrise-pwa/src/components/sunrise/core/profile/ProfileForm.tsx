import type IProfilePayload from "src/types/profile";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Avatar,
  Typography,
  LinearProgress,
  InputAdornment,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import { useAvatar } from "../../hook/useAvatar";
import { useUploadFile } from "../../hook/useFiles";
import CommonCropDialog from "../common/CommonCropDialog";
import VisuallyHiddenInput from "../../common/VisuallyHiddenInput";

type ProfileFormProps = {
  user: any;
  onSubmit: (profile: IProfilePayload) => void;
  loading?: boolean;
};

const ProfileSchema: Yup.ObjectSchema<IProfilePayload> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone_number: Yup.string()
    .nullable()
    .matches(/^[0-9\-+\s()]*$/, "Phone number can only contain numbers and the symbols - + ( )"),
  email: Yup.string().email().required("Email is required"),
  avatar: Yup.string().nullable(),
  password: Yup.string(),
  password_confirmation: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
});

export default function ProfileForm({ user, onSubmit, loading }: ProfileFormProps) {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const mdUp = useResponsive("up", "md");
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const commonCropDialog = useBoolean();
  const [cropImg, setCropImg] = useState<string | undefined>("");

  const defaultValues: IProfilePayload = useMemo(
    () => ({
      name: user?.name || "",
      phone_number: user?.phone_number || "",
      email: user?.email || "",
      avatar: user?.avatar || null,
      password: "",
      password_confirmation: "",
    }),
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  watch();

  const uploadFileMutation = useUploadFile(
    {
      onSuccess: (response) => {
        setValue("avatar", response?.file_url as never);
      },
    },
    (percentCompleted) => {
      setUploadProgress(percentCompleted);
    }
  );

  const createAvatar = useAvatar({});

  const handleFormSubmit = async (data: IProfilePayload) => {
    onSubmit(data);
  };

  const handleAvatarChange = (file: File) => {
    setCropImg(URL.createObjectURL(file));
    commonCropDialog.onTrue();
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleCrop = (croppedImage: any) => {
    uploadFileMutation.mutate(croppedImage as File);
    commonCropDialog.onFalse();
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          {mdUp && <Grid item md={2} />}
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack sx={{ my: 1 }} spacing={1}>
                  <Box display="flex" justifyContent="center">
                    <Avatar
                      sx={{ width: 128, height: 128 }}
                      src={getValues("avatar") || createAvatar(getValues("name"))}
                    />
                  </Box>

                  {getValues("avatar") && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setValue("avatar", null as never)}
                    >
                      Remove Avatar
                    </Button>
                  )}
                </Stack>
                {uploadFileMutation.isLoading && (
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {`Uploading... ${uploadProgress}%`}
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                  </Stack>
                )}
                {uploadError && (
                  <Typography color="error" variant="subtitle2">
                    {uploadError}
                  </Typography>
                )}
                <Stack spacing={1}>
                  <Button
                    disabled={uploadFileMutation.isLoading || loading}
                    component="label"
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon="solar:upload-outline" />}
                  >
                    Upload Avatar
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          const maxSize = 2 * 1024 * 1024; // 2MB

                          if (file && file.size > maxSize) {
                            alert("File is too large, please select a file smaller than 2MB.");
                          } else if (file) {
                            handleAvatarChange(file);
                          }
                        }
                      }}
                      accept="image/png, image/jpg, image/gif, image/jpeg"
                    />
                  </Button>
                  <Typography variant="caption">
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of 2mb
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="material-symbols:person-outline" />
                  <Typography variant="subtitle2">Profile Info</Typography>
                </Stack>
                <RHFTextField
                  name="name"
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  required
                />
                <RHFTextField
                  name="email"
                  label="Email"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="mdi:email-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFTextField
                  name="phone_number"
                  label="Phone Number"
                  placeholder="Enter phone number ..."
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="mdi:phone-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
                {isChangePassword ? (
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="material-symbols:lock-outline" />
                      <Typography variant="subtitle2">Change Password</Typography>
                    </Stack>
                    <RHFTextField
                      name="password"
                      label="Password"
                      type="password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      required
                    />
                    <RHFTextField
                      name="password_confirmation"
                      label="Confirm Password"
                      type="password"
                      error={!!errors.password_confirmation}
                      helperText={errors.password_confirmation?.message}
                      required
                    />
                    <Button variant="text" onClick={() => setIsChangePassword(false)}>
                      Cancel Change Password
                    </Button>
                  </Stack>
                ) : (
                  <Button variant="outlined" onClick={() => setIsChangePassword(true)}>
                    Change Password
                  </Button>
                )}
              </Stack>
            </Card>

            <Box sx={{ mt: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={uploadFileMutation.isLoading || loading}
              >
                Save Changes
              </LoadingButton>
              <Button
                sx={{ ml: 2 }}
                disabled={uploadFileMutation.isLoading || loading}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
      <CommonCropDialog
        open={commonCropDialog.value}
        src={cropImg}
        onCrop={handleCrop}
        cropShape="round"
        onClose={commonCropDialog.onFalse}
      />
    </>
  );
}
