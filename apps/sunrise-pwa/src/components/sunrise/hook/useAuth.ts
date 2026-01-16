import { useMutation } from "@tanstack/react-query";

import {
  newPassword,
  verifyEmail,
  resetPassword,
  verifiedEmail,
  deleteProfile,
} from "src/api/auth-api";

export const useResetPasswordAuth = (options: any) =>
  useMutation((email: string) => resetPassword(email), {
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useNewPasswordAuth = (options: any) =>
  useMutation((email: string) => newPassword(email), {
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useVerifyEmail = (options: any) =>
  useMutation(() => verifyEmail(), {
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useVerifiedEmail = (options: any) =>
  useMutation((token: any) => verifiedEmail(token), {
    onSuccess: (response) => {
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });

export const useDeleteProfile = (options: any) =>
  useMutation(() => deleteProfile(), {
    onSuccess: () => {
      if (options.onSuccess) options.onSuccess();
    },
  });
