// sections
import type { Metadata } from "next";

import ProfileEditView from "src/sections/profile/profile-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <ProfileEditView />;
}
