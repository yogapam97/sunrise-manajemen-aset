import { Avatar } from "@mui/material";

import { useAvatar } from "../../hook/useAvatar";

type UserAvatarProps = {
  name: string;
  avatarSize?: { width: number; height: number };
};

export default function UserAvatar({ name, avatarSize }: UserAvatarProps) {
  const createAvatar = useAvatar({ backgroundColor: ["000"] });
  const avatar = createAvatar(name);

  return <Avatar src={avatar} variant="circular" sx={avatarSize} />;
}
