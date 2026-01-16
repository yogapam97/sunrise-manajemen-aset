import nProgress from "nprogress";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { paths } from "src/routes/paths";

import { useNewPasswordAuth } from "../../hook/useAuth";
import NewPasswordForm from "../../core/auth/NewPasswordForm";

export default function NewPasswordContainer() {
  const token = useSearchParams().get("token");
  const { push } = useRouter();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const newPasswordMutaion = useNewPasswordAuth({
    onSuccess: () => {
      setTimeout(() => {
        nProgress.start();
        push(paths.auth.login);
      }, 3000); // Delay for 3 seconds (3000 milliseconds)
    },
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });
  const handleSubmit = (data: any) => {
    setSubmitErrors([]);
    newPasswordMutaion.mutate({
      ...data,
      token,
    });
  };

  useEffect(() => {
    if (!token) {
      push(paths.auth.login);
    }
  }, [push, token]);

  return (
    <NewPasswordForm
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
      loading={newPasswordMutaion.isLoading}
      success={newPasswordMutaion.isSuccess}
    />
  );
}
