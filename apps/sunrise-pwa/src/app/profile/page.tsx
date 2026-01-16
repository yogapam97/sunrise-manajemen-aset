// sections
import type { Metadata } from "next";

import ProfileView from "src/sections/profile/profile-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <ProfileView />;
}
