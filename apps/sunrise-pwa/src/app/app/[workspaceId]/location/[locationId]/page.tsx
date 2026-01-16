// sections
import type { Metadata } from "next";

import LocationDetailView from "src/sections/location/location-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Location",
};
type PageProps = {
  params: {
    workspaceId: string;
    locationId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { locationId, workspaceId } = params;
  return <LocationDetailView locationId={locationId} workspaceId={workspaceId} />;
}
