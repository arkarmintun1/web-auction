import React from 'react';
import Search from '../search/search.component';
import UserIcon from '../user-icon/user-icon.component';

import './header.styles.scss';

const Header = () => {
  return (
    <div className="header">
      <div className="brand-name">Web Auction</div>

      <Search />
      <UserIcon />
    </div>
  );
};

export default Header;
