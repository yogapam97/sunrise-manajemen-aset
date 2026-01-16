import type { ILocationPayload } from "src/types/location";

import axios, { endpoints } from "../utils/axios";

interface IGetAllLocations {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllLocations = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllLocations
): Promise<any> => {
  const response = await axios.get(`${endpoints.location}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getLocationIdById = async (locationId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.location}/${locationId}`);
  return response.data;
};

export const createLocation = async (location: ILocationPayload): Promise<any> => {
  const response = await axios.post(endpoints.location, location);
  return response.data;
};

export const updateLocation = async (
  locationId: string,
  location: ILocationPayload
): Promise<any> => {
  const response = await axios.patch(`${endpoints.location}/${locationId}`, location);
  return response.data;
};

export const deleteLocation = async (locationId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.location}/${locationId}`);
  return response.data;
};

export const getLocationFixedAssets = async (
  workspaceId: string,
  locationId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.location}/${locationId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
