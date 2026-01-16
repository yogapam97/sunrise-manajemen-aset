import { identicon } from "@dicebear/collection";

import useCreateAvatar from "src/hooks/use-create-avatar";

export const useThumbnail = (options?: any) =>
  useCreateAvatar(identicon, {
    rowColor: ["f5f5f5"],
    backgroundColor: ["000"],
    scale: 70,
    ...options,
  });
