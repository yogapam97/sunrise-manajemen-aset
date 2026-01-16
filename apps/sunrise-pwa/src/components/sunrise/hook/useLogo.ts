import { shapes } from "@dicebear/collection";

import useCreateAvatar from "src/hooks/use-create-avatar";

export const useLogo = (options: any) =>
  useCreateAvatar(shapes, {
    backgroundColor: ["000"],
    shape1Color: ["fff"],
    shape2Color: ["000"],
    shape3Color: ["fff"],
    scale: 70,
    ...options,
  });
