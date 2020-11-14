import React from 'react';
import Search from '../search/search.component';

import './header.styles.scss';

const Header = () => {
  return (
    <div className="header">
      <div className="brand-name">Web Auction</div>

      <Search />
    </div>
  );
};

export default Header;
