import { initials } from "@dicebear/collection";

import useCreateAvatar from "src/hooks/use-create-avatar";

export const useAvatar = (options: any) =>
  useCreateAvatar(initials, { backgroundColor: ["000"], scale: 70, ...options });
