import type { Style, StyleOptions } from "@dicebear/core";

import { useMemo, useCallback } from "react";
import { createAvatar } from "@dicebear/core";

const useCreateIcon = (avatarStyle: Style<any>, option: StyleOptions<any>) => {
  const createAvatarUri = useCallback(
    (icon: string) => createAvatar(avatarStyle, { ...option, icon: [icon] }).toDataUri(),
    [avatarStyle, option]
  );
  const createAvatarMemoized = useMemo(() => createAvatarUri, [createAvatarUri]);

  return createAvatarMemoized;
};

export default useCreateIcon;
