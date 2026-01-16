// sections
import type { Metadata } from "next";

import LocationCreateView from "src/sections/location/location-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Fixed Asset",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <LocationCreateView workspaceId={workspaceId} />;
}
