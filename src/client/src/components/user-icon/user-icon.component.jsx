import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { selectCurrentUser } from '../../redux/user/user.selector';
import { setCurrentUser, setAccessToken } from '../../redux/user/user.actions';

import './user-icon.styles.scss';

const UserIcon = ({ history, currentUser, setCurrentUser, setAccessToken }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    setAccessToken(null);
  };

  const handleProfile = () => {
    history.push('/profile');
  };

  const handleDashboard = () => {
    history.push('/dashboard');
  };

  return (
    <div className="user-icon" onClick={() => setShowPopup(!showPopup)}>
      {currentUser.username}
      {showPopup && (
        <div className="popup">
          {currentUser && currentUser.role === 'admin' ? (
            <button className="popup-button" onClick={handleDashboard}>
              Dashboard
            </button>
          ) : (
            <button className="popup-button" onClick={handleProfile}>
              Profile
            </button>
          )}

          <button className="popup-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setAccessToken: (token) => dispatch(setAccessToken(token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserIcon));
