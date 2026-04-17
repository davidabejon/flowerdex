import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface Props {
  title?: string;
  left?: React.ReactNode;
  children?: React.ReactNode;
  onLogin?: () => void;
  onLogout?: () => void;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ title, left, children, onLogin, onLogout, footerLeft, footerRight }) => {
  return (
    <div className="fe-container">
      <Header title={title || ''} left={left} onLogin={onLogin} onLogout={onLogout} />
      <div className="fe-screen">
        {children}
      </div>
      <Footer left={footerLeft} right={footerRight} />
    </div>
  );
};

export default Layout;
