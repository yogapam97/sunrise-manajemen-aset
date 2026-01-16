import type { ISupplierPayload } from "src/types/supplier";

import axios, { endpoints } from "../utils/axios";

interface IGetAllSuppliers {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllSuppliers = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllSuppliers
): Promise<any> => {
  const response = await axios.get(`${endpoints.supplier}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getSupplierIdById = async (supplierId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.supplier}/${supplierId}`);
  return response.data;
};

export const createSupplier = async (supplier: ISupplierPayload): Promise<any> => {
  const response = await axios.post(endpoints.supplier, supplier);
  return response.data;
};

export const updateSupplier = async (
  supplierId: string,
  supplier: ISupplierPayload
): Promise<any> => {
  const response = await axios.patch(`${endpoints.supplier}/${supplierId}`, supplier);
  return response.data;
};

export const deleteSupplier = async (supplierId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.supplier}/${supplierId}`);
  return response.data;
};

export const getSupplierFixedAssets = async (
  workspaceId: string,
  supplierId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.supplier}/${supplierId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
