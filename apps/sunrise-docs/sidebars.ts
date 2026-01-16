import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  userManualSidebar: [
    'intro', // Introduction page
    'dashboard', // Dashboard page
    'fixed-asset', // Fixed Asset page
    'file-discovery', // File Discovery page
    {
      type: 'category',
      label: 'Analytics',
      items: ['analytics/depreciation'], // Depreciation page
    },
    {
      type: 'category',
      label: 'Operation',
      items: [
        'operation/check-in-out', // Check In/Out page
        'operation/group-operation', // Group Operation page
        'operation/audit', // Audit page
        'operation/assignment', // Assignment page
        'operation/relocation', // Relocation page
        'operation/transition', // Transition page
        'operation/operation-log', // Operation Log page
      ],
    },
    {
      type: 'category',
      label: 'Repository',
      items: [
        'repository/metric', // Metric page
        'repository/lifecycle', // Lifecycle page
        'repository/location', // Location page
        'repository/category', // Category page
        'repository/supplier', // Supplier page
      ],
    },
    {
      type: 'category',
      label: 'Management',
      items: ['management/member'], // Member page
    },
  ],
};

export default sidebars;
