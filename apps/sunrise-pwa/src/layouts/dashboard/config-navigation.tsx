import { useMemo } from "react";

// routes
import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify/iconify";
import {
  AUDIT_ICON,
  CHECK_ICON,
  MEMBER_ICON,
  METRIC_ICON,
  CATEGORY_ICON,
  LOCATION_ICON,
  SUPPLIER_ICON,
  LIFECYCLE_ICON,
  DASHBOARD_ICON,
  RELOCATION_ICON,
  ASSIGNMENT_ICON,
  TRANSITION_ICON,
  FIXED_ASSET_ICON,
  MAINTENANCE_ICON,
  DEPRECIATION_ICON,
  OPERATION_LOG_ICON,
  OPERATION_GROUP_ICON,
} from "src/components/sunrise/core/icon-definitions";

// components
import { useWorkspaceContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

export function useNavData() {
  const { workspace } = useWorkspaceContext();
  const data = useMemo(
    () => [
      {
        items: [
          {
            title: "Dashboard",
            path: paths.app.dashboard.root(workspace?.id as string),
            icon: <Iconify icon={DASHBOARD_ICON} />,
          },
        ],
      },
      {
        items: [
          {
            title: "Fixed Asset",
            path: paths.app.fixedAsset.root(workspace?.id as string),
            icon: <Iconify icon={FIXED_ASSET_ICON} />,
          },
        ],
      },
      // Analytics
      // ----------------------------------------------------------------------
      {
        subheader: "Analytics",
        items: [
          {
            title: "Depreciation",
            path: paths.app.depreciation.root(workspace?.id as string),
            icon: <Iconify icon={DEPRECIATION_ICON} />,
          },
          // {
          //   title: 'KPI / Goal',
          //   path: paths.app.depreciation.root(workspace?.id as string),
          //   icon: <Iconify icon={GOAL_ICON} />,
          // },
        ],
      },
      // Operation
      // ----------------------------------------------------------------------
      {
        subheader: "Operation",
        items: [
          {
            title: "Check In/Out",
            path: paths.app.check.root(workspace?.id as string),
            icon: <Iconify icon={CHECK_ICON} />,
            caption: "Manage Allocation",
          },
          {
            title: "Group Operation",
            path: paths.app.operationGroup.root(workspace?.id as string),
            icon: <Iconify icon={OPERATION_GROUP_ICON} />,
            caption: "Instant Multiple Tracking",
          },
          {
            title: "Maintenance",
            path: paths.app.maintenance.root(workspace?.id as string),
            icon: <Iconify icon={MAINTENANCE_ICON} />,
            caption: "Manage Maintenace Trail",
          },
          {
            title: "Audit",
            path: paths.app.audit.root(workspace?.id as string),
            icon: <Iconify icon={AUDIT_ICON} />,
            caption: "Manage Audit Trail",
          },
          {
            title: "Assignment",
            path: paths.app.assignment.root(workspace?.id as string),
            icon: <Iconify icon={ASSIGNMENT_ICON} />,
            caption: "Manage Assignee Tracking",
          },
          {
            title: "Relocation",
            path: paths.app.relocation.root(workspace?.id as string),
            icon: <Iconify icon={RELOCATION_ICON} />,
            caption: "Manage Location Tracking",
          },
          {
            title: "Transition",
            path: paths.app.transition.root(workspace?.id as string),
            icon: <Iconify icon={TRANSITION_ICON} />,
            caption: "Manage Lifecycle Tracking",
          },
          {
            title: "Operation Log",
            path: paths.app.operationLog.root(workspace?.id as string),
            icon: <Iconify icon={OPERATION_LOG_ICON} />,
            caption: "Track Operation History",
          },
        ],
      },
      // Tools
      // ----------------------------------------------------------------------
      // {
      //   subheader: 'Tools',
      //   items: [
      //     {
      //       title: 'Label Designer',
      //       path: paths.app.fixedAsset.root(workspace?.id as string),
      //       icon: <Iconify icon={LABEL_DESIGNER} />,
      //     },
      //     {
      //       title: 'Label Generator',
      //       path: paths.app.fixedAsset.root(workspace?.id as string),
      //       icon: <Iconify icon={LABEL_GENERATOR_ICON} />,
      //     },
      //   ],
      // },
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: "Repository",
        items: [
          {
            title: "Metric",
            path: paths.app.metric.root(workspace?.id as string),
            icon: <Iconify icon={METRIC_ICON} />,
          },
          {
            title: "Lifecycle",
            path: paths.app.lifecycle.root(workspace?.id as string),
            icon: <Iconify icon={LIFECYCLE_ICON} />,
          },
          {
            title: "Location",
            path: paths.app.location.root(workspace?.id as string),
            icon: <Iconify icon={LOCATION_ICON} />,
          },
          {
            title: "Category",
            path: paths.app.category.root(workspace?.id as string),
            icon: <Iconify icon={CATEGORY_ICON} />,
          },
          {
            title: "Supplier",
            path: paths.app.supplier.root(workspace?.id as string),
            icon: <Iconify icon={SUPPLIER_ICON} />,
          },
          // {
          //   title: 'Lifecycle',
          //   path: paths.app.lifecycle.root(workspace?.id as string),
          //   icon: <Iconify icon={LIFECYCLE_ICON} />,
          // },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: "management",
        items: [
          {
            title: "Member",
            path: paths.app.member.root(workspace?.id as string),
            icon: <Iconify icon={MEMBER_ICON} />,
          },
        ],
      },
    ],
    [workspace?.id]
  );

  return data;
}
