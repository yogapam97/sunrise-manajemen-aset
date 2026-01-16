import * as Yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Card, Stack, Button } from "@mui/material";

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import { useWorkspaceContext } from "src/auth/hooks";

import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import CategoryInputAutocomplete from "../category/CategoryInputAutocomplete";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import SupplierInputAutocomplete from "../supplier/SupplierInputAutocomplete";
import LifecycleInputAutocomplete from "../lifecycle/LIfecycleInputAutocomplete";

type FixedAssetFilterFormProps = {
  defaultFilter?: any;
  onFilter: (values: any) => void;
};

const FixedAssetFilterSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  serial_number: Yup.string().nullable().max(60, "Name cannot be longer than 60 characters"),
  category: Yup.array().nullable(),
  location: Yup.array().nullable(),
  lifecycle: Yup.array().nullable(),
  supplier: Yup.array().nullable(),
  assignee: Yup.array().nullable(),
});

export default function FixedAssetFilterForm({
  defaultFilter,
  onFilter,
}: FixedAssetFilterFormProps) {
  const { workspace } = useWorkspaceContext();

  const defaultValues: any = useMemo(
    () => ({
      code: defaultFilter?.code || "",
      serial_number: defaultFilter?.serial_number || "",
      category: defaultFilter?.category || [],
      location: defaultFilter?.location || [],
      lifecycle: defaultFilter?.lifecycle || [],
      assignee: defaultFilter?.assignee || [],
      supplier: defaultFilter?.supplier || [],
    }),
    [defaultFilter]
  );

  const methods = useForm({
    resolver: yupResolver(FixedAssetFilterSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, getValues, watch } = methods;
  watch();

  const handleInputSubmit = handleSubmit(async (inputValues: any) => {
    onFilter(inputValues);
  });

  return (
    <Card sx={{ p: 2 }}>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Stack spacing={2}>
          <RHFTextField size="small" name="code" label="Code" />
          <RHFTextField size="small" name="serial_number" label="Serial Number" />
          <LifecycleInputAutocomplete
            multiple
            size="small"
            workspaceId={workspace?.id as string}
            defaultValue={getValues("lifecycle")}
            onChange={(e: any, value: any) => setValue("lifecycle", value)}
            hideCreateNew
          />
          <CategoryInputAutocomplete
            multiple
            size="small"
            workspaceId={workspace?.id as string}
            defaultValue={getValues("category")}
            onChange={(e: any, value: any) => setValue("category", value)}
            hideCreateNew
          />
          <LocationInputAutocomplete
            multiple
            size="small"
            workspaceId={workspace?.id as string}
            defaultValue={getValues("location")}
            onChange={(e: any, value: any) => setValue("location", value)}
            hideCreateNew
          />
          <SupplierInputAutocomplete
            multiple
            size="small"
            workspaceId={workspace?.id as string}
            defaultValue={getValues("supplier")}
            onChange={(e: any, value: any) => setValue("supplier", value)}
            hideCreateNew
          />
          <MemberInputAutocomplete
            multiple
            size="small"
            workspaceId={workspace?.id as string}
            defaultValue={getValues("assignee")}
            onChange={(e: any, value: any) => setValue("assignee", value)}
            hideInvite
          />
          <Button type="submit" variant="contained" size="small">
            Filter
          </Button>
        </Stack>
      </FormProvider>
    </Card>
  );
}
