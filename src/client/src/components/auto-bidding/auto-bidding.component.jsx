import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentItem } from '../../redux/items/items.selector';
import {
  selectAccessToken,
  selectCurrentUser,
} from '../../redux/user/user.selector';

import axios from '../../util/axios';

const AutoBidding = ({ currentItem, accessToken, currentUser }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (currentItem.autoBidders && currentUser) {
      const status = currentItem.autoBidders.some(
        (autoBidderId) => autoBidderId === currentUser.id
      );
      setChecked(status);
    }
  }, [currentItem, currentUser]);

  const handleAutoBidding = async () => {
    try {
      const response = await axios.get(
        `/items/${currentItem._id}/toggleAutoBidder`,
        {
          headers: { 'Access-Token': accessToken },
        }
      );
      if (response.status === 200) {
        alert('Auto bidding setting has been updated.');
      }
    } catch (error) {
      alert('Error occurred while adding user to auto bidder');
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        name="autoBid"
        id="autoBid"
        checked={checked}
        onChange={(e) => {
          console.log(e.target.checked);
          handleAutoBidding();
        }}
      />
      <label htmlFor="autoBid">Auto Bidding</label>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentItem: selectCurrentItem,
  accessToken: selectAccessToken,
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(AutoBidding);
