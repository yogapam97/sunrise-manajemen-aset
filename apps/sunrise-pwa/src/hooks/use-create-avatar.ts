import type { Style, StyleOptions } from "@dicebear/core";

import { useMemo, useCallback } from "react";
import { createAvatar } from "@dicebear/core";

const useCreateAvatar = (avatarStyle: Style<any>, option: StyleOptions<any>) => {
  const createAvatarUri = useCallback(
    (seed: string) => createAvatar(avatarStyle, { ...option, seed }).toDataUri(),
    [avatarStyle, option]
  );
  const createAvatarMemoized = useMemo(() => createAvatarUri, [createAvatarUri]);

  return createAvatarMemoized;
};

export default useCreateAvatar;
