import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectCurrentUser,
  selectAccessToken,
} from '../../redux/user/user.selector';
import { setCurrentUser } from '../../redux/user/user.actions';
import axios from '../../util/axios';

import Header from '../../components/header/header.component';
import BidSettings from '../../components/bid-settings/bid-settings.component';

import './profile.styles.scss';

const ProfilePage = ({ currentuser, accessToken, setCurrentUser }) => {
  const [biddings, setBiddings] = useState([]);

  useEffect(() => {
    try {
      const getUserProfile = async () => {
        const response = await axios.get('/auth/me', {
          headers: {
            'Access-Token': accessToken,
          },
        });
        if (response.status === 200) {
          setCurrentUser(response.data.user);
        }
      };
      const getUserBiddings = async () => {
        const response = await axios.get('/user/biddings', {
          headers: {
            'Access-Token': accessToken,
          },
        });
        if (response.status === 200) {
          setBiddings(response.data.biddings);
        }
      };
      getUserProfile();
      getUserBiddings();
    } catch (error) {}
  }, [accessToken, setCurrentUser]);

  return (
    <div className="profile">
      <Header />
      <div className="container">
        <BidSettings />
        <h3 className="bid-title">Bids</h3>
        <div className="bids-container">
          <table className="bids-table">
            <tbody>
              <tr>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              {biddings.map((bidding) => {
                return (
                  <tr key={bidding.id}>
                    <td>{bidding.name}</td>
                    <td>{bidding.amount}</td>
                    <td>{bidding.status}</td>
                    <td>
                      {bidding.invoice ? (
                        <a
                          href={`http://localhost:3002${bidding.invoice}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentuser: selectCurrentUser,
  accessToken: selectAccessToken,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
