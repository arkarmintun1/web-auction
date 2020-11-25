import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selector';
import { setCurrentUser, setAccessToken } from '../../redux/user/user.actions';

import './user-icon.styles.scss';

const UserIcon = ({ currentUser, setCurrentUser, setAccessToken }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    setAccessToken(null);
  };

  return (
    <div className="user-icon" onClick={() => setShowPopup(!showPopup)}>
      {currentUser.username}
      {showPopup && (
        <div className="popup">
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

export default connect(mapStateToProps, mapDispatchToProps)(UserIcon);
