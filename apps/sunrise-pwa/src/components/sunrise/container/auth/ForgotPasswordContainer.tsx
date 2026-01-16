import { useState } from "react";

import { useResetPasswordAuth } from "../../hook/useAuth";
import ForgotPasswordForm from "../../core/auth/ForgotPasswordForm";

export default function ForgotPasswordContainer() {
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const resetPasswordMutaion = useResetPasswordAuth({
    onSuccess: () => {},
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });
  const handleSubmit = (data: any) => {
    setSubmitErrors([]);
    resetPasswordMutaion.mutate(data);
  };
  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
      loading={resetPasswordMutaion.isLoading}
      success={resetPasswordMutaion.isSuccess}
    />
  );
}
