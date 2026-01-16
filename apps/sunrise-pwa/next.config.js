const path = require('path');

module.exports = {
  trailingSlash: true,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.alias['@dicebear/converter'] = path.resolve(__dirname, 'node_modules/@dicebear/converter/lib/index.js');
    return config;
  },
};
