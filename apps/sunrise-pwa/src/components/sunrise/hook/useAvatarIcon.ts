import { icons } from "@dicebear/collection";

import useCreateIcon from "src/hooks/use-create-icon";

export const useAvatarIcon = (options?: any) =>
  useCreateIcon(icons, {
    backgroundColor: ["000"],
    scale: 70,
    ...options,
  });
