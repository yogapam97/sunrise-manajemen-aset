import { useRouter } from "next/navigation";

import { Button } from "@mui/material";

import Iconify from "src/components/iconify";

export default function BackButton() {
  const { back } = useRouter();
  return (
    <Button
      onClick={() => back()}
      variant="outlined"
      startIcon={<Iconify icon="eva:chevron-left-outline" />}
    >
      Back
    </Button>
  );
}
