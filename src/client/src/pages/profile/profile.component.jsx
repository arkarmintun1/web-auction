import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selector';
import {} from '../../redux/user/user.actions';

import Header from '../../components/header/header.component';

import './profile.styles.scss';

const ProfilePage = ({ currentuser }) => {
  return (
    <div className="profile">
      <Header />
      <div className="container">
        <h3>Bids</h3>
        <div className="bids"></div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentuser: selectCurrentUser,
});

export default connect(mapStateToProps)(ProfilePage);
