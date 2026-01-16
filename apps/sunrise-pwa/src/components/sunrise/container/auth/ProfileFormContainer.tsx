import { useSnackbar } from "notistack";

import { useAuthContext } from "src/auth/hooks";

import ProfileForm from "../../core/profile/ProfileForm";
import { useUpdateProfile } from "../../hook/useProfile";

type ProfileFormContainerProps = {
  onSuccess?: () => void;
};

export default function ProfileFormContainer({ onSuccess }: ProfileFormContainerProps) {
  const { user, setUser } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const updateProfileMutation = useUpdateProfile({
    onSuccess: (response) => {
      const { data } = response;
      setUser(data);
      enqueueSnackbar("Profile updated", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleUpdateProfile = (profilePayload: any) => {
    updateProfileMutation.mutate(profilePayload);
  };

  return (
    <ProfileForm
      user={user}
      onSubmit={handleUpdateProfile}
      loading={updateProfileMutation.isLoading}
    />
  );
}
