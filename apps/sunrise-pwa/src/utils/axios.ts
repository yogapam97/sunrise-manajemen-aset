import type { AxiosRequestConfig } from "axios";

import axios from "axios";

// config
import { HOST_API, PREFIX_API } from "src/config-global";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || "Something went wrong")
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    profile: `${PREFIX_API}/auth/profile`,
    login: `${PREFIX_API}/auth/login`,
    signup: `${PREFIX_API}/auth/signup`,
    resetPassword: `${PREFIX_API}/auth/reset-password`,
    newPassword: `${PREFIX_API}/auth/new-password`,
    verifyEmail: `${PREFIX_API}/auth/verify-email`,
    verifiedEmail: `${PREFIX_API}/auth/verified-email`,
  },
  workspace: `${PREFIX_API}/workspaces`,
  fixedAsset: `${PREFIX_API}/fixed-assets`,
  fixedAssetReport: `${PREFIX_API}/fixed-assets-report`,
  fixedAssetImport: `${PREFIX_API}/fixed-assets-import`,
  fixedAssetDownload: `${PREFIX_API}/fixed-assets-download`,
  depreciationDownload: `${PREFIX_API}/depreciations-download`,
  operationGroup: `${PREFIX_API}/operation-groups`,
  operationLog: `${PREFIX_API}/operation-logs`,
  operationLogDownload: `${PREFIX_API}/operation-logs-download`,
  checkDownload: `${PREFIX_API}/checks-download`,
  check: `${PREFIX_API}/checks`,
  maintenance: `${PREFIX_API}/maintenances`,
  audit: `${PREFIX_API}/audits`,
  transition: `${PREFIX_API}/transitions`,
  relocation: `${PREFIX_API}/relocations`,
  assignment: `${PREFIX_API}/assignments`,
  labelGenerator: `${PREFIX_API}/generate-qrs`,
  depreciation: `${PREFIX_API}/depreciations`,
  location: `${PREFIX_API}/locations`,
  lifecycle: `${PREFIX_API}/lifecycles`,
  category: `${PREFIX_API}/categories`,
  supplier: `${PREFIX_API}/suppliers`,
  metric: `${PREFIX_API}/metrics`,
  file: `${PREFIX_API}/files`,
  user: `${PREFIX_API}/users`,
  member: `${PREFIX_API}/members`,
  tmpFile: (file: string) => `${PREFIX_API}/files-tmp/${file}`,
};
