import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { paths } from "src/routes/paths";

import { useVerifiedEmail } from "../../hook/useAuth";
import VerifyEmailForm from "../../core/auth/VerifyEmailForm";

export default function VerifyEmailContainer() {
  const token = useSearchParams().get("token") || "";
  const { push } = useRouter();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const verifyEmailMutaion = useVerifiedEmail({
    onSuccess: () => {},
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });
  const handleSubmit = () => {
    setSubmitErrors([]);
    verifyEmailMutaion.mutate({ token });
  };

  useEffect(() => {
    if (!token) {
      push(paths.auth.login);
    }
  }, [push, token]);
  return (
    <VerifyEmailForm
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
      loading={verifyEmailMutaion.isLoading}
      success={verifyEmailMutaion.isSuccess}
    />
  );
}
