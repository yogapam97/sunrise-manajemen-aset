// routes
import { paths } from "src/routes/paths";

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
export const PREFIX_API = process.env.NEXT_PUBLIC_PREFIX_API;
export const APP_DISTRIBUTION = process.env.NEXT_PUBLIC_APP_DISTRIBUTION;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.workspace.root; // as '/workspace'
export const PATH_DEFAULT_APP = paths.workspace.root; // as '/workspace'
