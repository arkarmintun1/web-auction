import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectCurrentUser,
  selectAccessToken,
} from '../../redux/user/user.selector';
import axios from '../../util/axios';

import Header from '../../components/header/header.component';

import './profile.styles.scss';
import BidSettings from '../../components/bid-settings/bid-settings.component';

const ProfilePage = ({ currentuser, accessToken }) => {
  const [biddings, setBiddings] = useState([]);

  useEffect(() => {
    try {
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
      getUserBiddings();
    } catch (error) {}
  }, [currentuser, accessToken]);

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

export default connect(mapStateToProps)(ProfilePage);
