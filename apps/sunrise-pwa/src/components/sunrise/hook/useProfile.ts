import type IProfilePayload from "src/types/profile";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "src/api/profile-api";

export const useUpdateProfile = (options: { onSuccess: (response: any) => void }) => {
  const queryClient = useQueryClient();
  return useMutation((profilePayload: IProfilePayload) => updateProfile(profilePayload), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile"]);
      if (options.onSuccess) options.onSuccess(response);
    },
  });
};
