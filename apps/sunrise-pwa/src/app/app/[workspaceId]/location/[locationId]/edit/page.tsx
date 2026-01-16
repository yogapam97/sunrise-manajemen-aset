// sections
import type { Metadata } from "next";

import LocationEditView from "src/sections/location/location-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Location",
};
type PageProps = {
  params: {
    workspaceId: string;
    locationId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { locationId } = params;
  return <LocationEditView locationId={locationId} />;
}
