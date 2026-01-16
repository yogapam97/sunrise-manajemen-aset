// sections
import type { Metadata } from "next";

import LocationListView from "src/sections/location/location-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Location",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <LocationListView workspaceId={workspaceId} />;
}
