// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: "https://mui.com/store/items/minimal-dashboard/",
  // LEGAL
  legal: {
    termOfService: "/legal/term-of-service",
    privacyPolicy: "/legal/privacy-policy",
  },
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  workspace: {
    root: "/workspace",
    create: "/workspace/create",
    detail: (workspaceId: string) => `/workspace/${workspaceId}`,
    edit: (workspaceId: string) => `/workspace/${workspaceId}/edit`,
  },
  profile: {
    root: "/profile",
    edit: "/profile/edit",
  },
  app: {
    dashboard: {
      root: (workspaceId: string) => `/app/${workspaceId}/dashboard`,
    },
    fixedAsset: {
      root: (workspaceId: string) => `/app/${workspaceId}/fixed-asset`,
      create: (workspaceId: string) => `/app/${workspaceId}/fixed-asset-create`,
      import: (workspaceId: string) => `/app/${workspaceId}/fixed-asset-import`,
      detail: (workspaceId: string, fixedAssetId: string) =>
        `/app/${workspaceId}/fixed-asset/${fixedAssetId}`,
      edit: (workspaceId: string, fixedAssetId: string) =>
        `/app/${workspaceId}/fixed-asset/${fixedAssetId}/edit`,
    },
    depreciation: {
      root: (workspaceId: string) => `/app/${workspaceId}/depreciation`,
    },
    operationGroup: {
      root: (workspaceId: string) => `/app/${workspaceId}/operation-group`,
      create: (workspaceId: string) => `/app/${workspaceId}/operation-group-create`,
      detail: (workspaceId: string, operationGroupId: string) =>
        `/app/${workspaceId}/operation-group/${operationGroupId}`,
      edit: (workspaceId: string, operationGroupId: string) =>
        `/app/${workspaceId}/operation-group/${operationGroupId}/edit`,
      do: (workspaceId: string, operationGroupId: string) =>
        `/app/${workspaceId}/operation-group/${operationGroupId}/do`,
    },
    operationLog: {
      root: (workspaceId: string) => `/app/${workspaceId}/operation-log`,
    },
    check: {
      root: (workspaceId: string) => `/app/${workspaceId}/check`,
      create: (workspaceId: string, fixedAssetId?: string) =>
        `/app/${workspaceId}/check-create${fixedAssetId ? `?fixed-asset-id=${fixedAssetId}` : ""}`,
      detail: (workspaceId: string, checkId: string) => `/app/${workspaceId}/check/${checkId}`,
    },
    maintenance: {
      root: (workspaceId: string) => `/app/${workspaceId}/maintenance`,
      create: (workspaceId: string, fixedAssetId?: string) =>
        `/app/${workspaceId}/maintenance-create${fixedAssetId ? `?fixed-asset-id=${fixedAssetId}` : ""}`,
      detail: (workspaceId: string, maintenanceId: string) =>
        `/app/${workspaceId}/maintenance/${maintenanceId}`,
    },
    audit: {
      root: (workspaceId: string) => `/app/${workspaceId}/audit`,
      create: (workspaceId: string, fixedAssetId?: string) =>
        `/app/${workspaceId}/audit-create${fixedAssetId ? `?fixed-asset-id=${fixedAssetId}` : ""}`,
      detail: (workspaceId: string, auditId: string) => `/app/${workspaceId}/audit/${auditId}`,
    },
    transition: {
      root: (workspaceId: string) => `/app/${workspaceId}/transition`,
      create: (workspaceId: string, fixedAssetId?: string) =>
        `/app/${workspaceId}/transition-create${fixedAssetId ? `?fixed-asset-id=${fixedAssetId}` : ""}`,
      detail: (workspaceId: string, transitionId: string) =>
        `/app/${workspaceId}/transition/${transitionId}`,
    },
    assignment: {
      root: (workspaceId: string) => `/app/${workspaceId}/assignment`,
      create: (workspaceId: string, fixedAssetId?: string) =>
        `/app/${workspaceId}/assignment-create${fixedAssetId ? `?fixed-asset-id=${fixedAssetId}` : ""}`,
      detail: (workspaceId: string, assignmentId: string) =>
        `/app/${workspaceId}/assignment/${assignmentId}`,
    },
    relocation: {
      root: (workspaceId: string) => `/app/${workspaceId}/relocation`,
      create: (workspaceId: string, fixedAssetId?: string) =>
        `/app/${workspaceId}/relocation-create${fixedAssetId ? `?fixed-asset-id=${fixedAssetId}` : ""}`,
      detail: (workspaceId: string, relocationId: string) =>
        `/app/${workspaceId}/relocation/${relocationId}`,
    },
    location: {
      root: (workspaceId: string) => `/app/${workspaceId}/location`,
      create: (workspaceId: string) => `/app/${workspaceId}/location-create`,
      detail: (workspaceId: string, locationId: string) =>
        `/app/${workspaceId}/location/${locationId}`,
      edit: (workspaceId: string, locationId: string) =>
        `/app/${workspaceId}/location/${locationId}/edit`,
    },
    category: {
      root: (workspaceId: string) => `/app/${workspaceId}/category`,
      create: (workspaceId: string) => `/app/${workspaceId}/category-create`,
      detail: (workspaceId: string, categoryId: string) =>
        `/app/${workspaceId}/category/${categoryId}`,
      edit: (workspaceId: string, categoryId: string) =>
        `/app/${workspaceId}/category/${categoryId}/edit`,
    },
    lifecycle: {
      root: (workspaceId: string) => `/app/${workspaceId}/lifecycle`,
      create: (workspaceId: string) => `/app/${workspaceId}/lifecycle-create`,
      detail: (workspaceId: string, lifecycleId: string) =>
        `/app/${workspaceId}/lifecycle/${lifecycleId}`,
      edit: (workspaceId: string, lifecycleId: string) =>
        `/app/${workspaceId}/lifecycle/${lifecycleId}/edit`,
    },
    supplier: {
      root: (workspaceId: string) => `/app/${workspaceId}/supplier`,
      create: (workspaceId: string) => `/app/${workspaceId}/supplier-create`,
      detail: (workspaceId: string, supplierId: string) =>
        `/app/${workspaceId}/supplier/${supplierId}`,
      edit: (workspaceId: string, supplierId: string) =>
        `/app/${workspaceId}/supplier/${supplierId}/edit`,
    },
    metric: {
      root: (workspaceId: string) => `/app/${workspaceId}/metric`,
      create: (workspaceId: string) => `/app/${workspaceId}/metric-create`,
      detail: (workspaceId: string, metricId: string) => `/app/${workspaceId}/metric/${metricId}`,
      edit: (workspaceId: string, metricId: string) =>
        `/app/${workspaceId}/metric/${metricId}/edit`,
    },
    member: {
      root: (workspaceId: string) => `/app/${workspaceId}/member`,
      create: (workspaceId: string) => `/app/${workspaceId}/member-create`,
      detail: (workspaceId: string, memberId: string) => `/app/${workspaceId}/member/${memberId}`,
      edit: (workspaceId: string, memberId: string) =>
        `/app/${workspaceId}/member/${memberId}/edit`,
    },
  },
  fixedAsset: { root: "/fixed-asset" },
  goal: { root: "/goal" },
  depreciation: { root: "/depreciation" },
  assessment: { root: "/assessment" },
  transition: { root: "/transition" },
  relocation: { root: "/relocation" },
  assignment: { root: "/assignment" },
  metric: { root: "/metric" },
  lifecycle: { root: "/lifecycle" },
  location: { root: (workspaceId: string) => `/workspace/${workspaceId}/location` },
  category: { root: "/category" },
  hashtag: { root: "/hashtag" },
  member: { root: "/member" },
  user: { root: "/user" },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
