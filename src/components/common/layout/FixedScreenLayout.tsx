import React from 'react';
import styles from "@/components/common/layout/FixedScreenLayout.module.css";
import backgroundImage from '@/assets/images/background/cover.png';

interface FixedScreenLayoutProps {
  children: React.ReactNode;
}

const FixedScreenLayout: React.FC<FixedScreenLayoutProps> = ({ children }) => {
  return (
    <div className={styles.screen} style={{ backgroundImage: `url(${backgroundImage})` }}>
      {children}
    </div>
  );
};

export default FixedScreenLayout;
