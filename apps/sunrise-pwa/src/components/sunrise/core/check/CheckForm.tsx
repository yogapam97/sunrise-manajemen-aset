import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { ICheckItem, ICheckPayload } from "src/types/check";

import _ from "lodash";
import * as Yup from "yup";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Card,
  Grid,
  Stack,
  Button,
  Switch,
  FormGroup,
  Typography,
  ButtonGroup,
  ListItemText,
  FormControlLabel,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import CheckFormDetail from "./CheckFormDetail";
import { MEMBER_ICON, LOCATION_ICON } from "../icon-definitions";
import { useGetCurrentCheckAction } from "../../hook/useFixedAssets";
import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";

type CheckFormProps = {
  workspaceId: string;
  defaultCheck?: ICheckItem;
  onSubmit: (check: ICheckPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const AssignmentOption = () => (
  <ListItemText primary="Perform Assignment" secondary="Change default assignee" />
);

const RelocationOption = () => (
  <ListItemText primary="Perform Relocation" secondary="Change default location" />
);

export default function CheckForm({
  workspaceId,
  onSubmit,
  defaultCheck,
  isLoading,
  submitErrors,
}: CheckFormProps) {
  const isCheckOutToMember = useBoolean(true);
  const isCheckOutToLocation = useBoolean();
  const getCurrentCheckAction = useGetCurrentCheckAction();
  const [selectedFixedAsset, setSelectedFixedAsset] = useState<IFixedAssetItem | null>(
    defaultCheck?.fixed_asset || null
  );
  const [isAssignmentDefault, setIsAssignmentDefault] = useState(false);
  const [isRelocationDefault, setIsRelocationDefault] = useState(false);

  const CheckSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    fixed_asset: Yup.string().required("Fixed asset is required"),
    assignee: isCheckOutToMember.value
      ? Yup.string().required("New assignee is required")
      : Yup.string().nullable(),
    location: isCheckOutToLocation.value
      ? Yup.string().required("New new location is required")
      : Yup.string().nullable(),
    note: Yup.string().nullable(),
  });

  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: defaultCheck?.fixed_asset?.id || null,
      assignee: "",
      is_assignment: false,
      location: "",
      is_relocation: false,
      check_in_date: new Date(),
      check_due_date: null,
      check_out_date: null,
      note: "",
    }),
    [defaultCheck]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(CheckSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = methods;

  watch();

  const handleChangeFixedAsset = (event: any, value: any) => {
    setSelectedFixedAsset(value);
    setValue("fixed_asset", value?.id);
  };

  const handleAssigneeChange = (event: any, value: any) => {
    setValue("assignee", value?.id);
  };

  const handleLocationChange = (event: any, value: any) => {
    setValue("location", value?.id);
  };

  const handleSetAssignmentDefault = (e: any) => {
    setIsAssignmentDefault(e.target.checked);
    setValue("is_assignment", true);
    setValue("assignee", selectedFixedAsset?.assignee?.id);
  };

  const handleSetRelocationDefault = (e: any) => {
    setIsRelocationDefault(e.target.checked);
    setValue("is_relocation", true);
    setValue("location", selectedFixedAsset?.location?.id);
  };

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

  const handleInputSubmit = handleSubmit(async (values: ICheckPayload) => onSubmit(values));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <FormProvider methods={methods} onSubmit={handleInputSubmit}>
            <Stack spacing={2}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Fixed Asset</Typography>
                <FixedAssetInputAutocomplete
                  workspaceId={workspaceId}
                  defaultValue={selectedFixedAsset}
                  onChange={handleChangeFixedAsset}
                  error={!!errors.fixed_asset}
                  helperText={errors.fixed_asset?.message as string}
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle2">Check Out To</Typography>
                <ButtonGroup>
                  <Button
                    variant={isCheckOutToMember.value ? "contained" : "outlined"}
                    onClick={isCheckOutToMember.onToggle}
                    startIcon={<Iconify icon={MEMBER_ICON} />}
                  >
                    Member
                  </Button>
                  <Button
                    variant={isCheckOutToLocation.value ? "contained" : "outlined"}
                    onClick={isCheckOutToLocation.onToggle}
                    startIcon={<Iconify icon={LOCATION_ICON} />}
                  >
                    Location
                  </Button>
                </ButtonGroup>
              </Stack>

              {isCheckOutToMember.value && (
                <Card sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Assignee</Typography>
                    {!isAssignmentDefault && (
                      <>
                        <MemberInputAutocomplete
                          error={!!errors.assignee}
                          helperText={errors.assignee?.message as string}
                          workspaceId={workspaceId}
                          onChange={handleAssigneeChange}
                        />
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                onChange={(e) => setValue("is_assignment", e.target.checked)}
                              />
                            }
                            label={<AssignmentOption />}
                          />
                        </FormGroup>
                      </>
                    )}

                    {getCurrentCheckAction(selectedFixedAsset?.current_check, true).status ===
                      "check-out" && (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              disabled={!selectedFixedAsset?.assignee}
                              checked={isAssignmentDefault}
                              onChange={handleSetAssignmentDefault}
                            />
                          }
                          label={
                            <Typography
                              color={
                                !selectedFixedAsset?.assignee ? "text.disabled" : "text.primary"
                              }
                              variant="subtitle2"
                            >
                              Set to Default Assignee
                            </Typography>
                          }
                        />
                      </FormGroup>
                    )}
                  </Stack>
                </Card>
              )}

              {isCheckOutToLocation.value && (
                <Card sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Location</Typography>
                    {!isRelocationDefault && (
                      <>
                        <LocationInputAutocomplete
                          error={!!errors.location}
                          helperText={errors.location?.message as string}
                          workspaceId={workspaceId}
                          onChange={handleLocationChange}
                        />
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                onChange={(e) => setValue("is_relocation", e.target.checked)}
                              />
                            }
                            label={<RelocationOption />}
                          />
                        </FormGroup>
                      </>
                    )}
                    {getCurrentCheckAction(selectedFixedAsset?.current_check, true).status ===
                      "check-out" && (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              disabled={!selectedFixedAsset?.location}
                              checked={isRelocationDefault}
                              onChange={handleSetRelocationDefault}
                            />
                          }
                          label={
                            <Typography
                              color={
                                !selectedFixedAsset?.location ? "text.disabled" : "text.primary"
                              }
                              variant="subtitle2"
                            >
                              Set to Default Location
                            </Typography>
                          }
                        />
                      </FormGroup>
                    )}
                  </Stack>
                </Card>
              )}

              {getCurrentCheckAction(selectedFixedAsset?.current_check).status === "check-out" && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Check Out Date</Typography>
                  <DatePicker
                    format="dd/MM/yyyy"
                    onChange={(date) => {
                      setValue("check_due_date", null);
                      setValue("check_out_date", date);
                    }}
                    defaultValue={new Date()}
                    maxDate={new Date()}
                    value={getValues("check_out_date")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "Select check out date ...",
                      },
                    }}
                  />

                  <Typography variant="subtitle2">Check Out Due Date</Typography>
                  <DatePicker
                    format="dd/MM/yyyy"
                    onChange={(date) => {
                      setValue("check_due_date", date);
                    }}
                    disabled={!getValues("check_out_date")}
                    minDate={getValues("check_out_date")}
                    value={getValues("check_due_date")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "Select check out due date ...",
                        disabled: !getValues("check_out_date"),
                      },
                    }}
                  />
                  {getValues("check_due_date") && (
                    <Typography variant="caption">
                      {`Check out will be expired ${moment(getValues("check_due_date")).fromNow()}`}
                    </Typography>
                  )}
                </Stack>
              )}

              {getCurrentCheckAction(selectedFixedAsset?.current_check).status === "check-in" && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Check In Date</Typography>
                  <DatePicker
                    format="dd/MM/yyyy"
                    onChange={(date) => {
                      setValue("check_in_date", date);
                    }}
                    defaultValue={new Date()}
                    maxDate={new Date()}
                    value={getValues("check_in_date")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "Select check in date ...",
                      },
                    }}
                  />
                </Stack>
              )}

              <Stack spacing={2}>
                <Typography variant="subtitle2">Note</Typography>
                <RHFTextField
                  name="note"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter check note ..."
                />
              </Stack>

              <Stack spacing={2}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  color={getCurrentCheckAction(selectedFixedAsset?.current_check).color}
                  disabled={!selectedFixedAsset}
                  loading={isLoading}
                  startIcon={
                    <Iconify icon={getCurrentCheckAction(selectedFixedAsset?.current_check).icon} />
                  }
                >
                  {getCurrentCheckAction(selectedFixedAsset?.current_check).text}
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <CheckFormDetail workspaceId={workspaceId} fixedAsset={selectedFixedAsset} />
      </Grid>
    </Grid>
  );
}
