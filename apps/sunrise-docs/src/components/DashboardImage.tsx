import React from 'react';
import { useColorMode } from '@docusaurus/theme-common'; // Correct hook import

const DashboardImage: React.FC = () => {
  const { colorMode } = useColorMode(); // Correctly get the current color mode
  const imageUrl =
    colorMode === 'dark'
      ? '/img/Stageholder_Logo_Light.png'
      : '/img/Stageholder_Logo_Dark.png';

  return <img src={imageUrl} alt="Overview Dashboard" style={{ maxWidth: '100%' }} />;
};

export default DashboardImage;
