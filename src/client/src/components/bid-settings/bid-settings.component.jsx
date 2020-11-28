import React, { useState, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setCurrentUser } from '../../redux/user/user.actions';
import {
  selectCurrentUser,
  selectAccessToken,
} from '../../redux/user/user.selector';
import axios from '../../util/axios';

import CustomButton from '../custom-button/custom-button.component';
import FormInput from '../form-input/form-input.component';

import './bid-settings.styles.scss';

const BidSettings = ({ currentUser, accessToken, setCurrentUser }) => {
  const [alertDialog, setAlertDialog] = useState({
    show: false,
    title: 'Update Settings',
    type: 'success',
    message: '',
  });

  const { show, title, message, type } = alertDialog;

  const handleAlertDialog = (props) => {
    setAlertDialog({ ...alertDialog, ...props });
  };

  const [amount, setAmount] = useState(0);
  const [alert, setAlert] = useState(0);

  useEffect(() => {
    setAmount(currentUser.autoBidAmount);
    setAlert(currentUser.autoBidAlert);
  }, [currentUser]);

  const submitUpdateSettings = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        '/user/updateAutoBidSettings',
        {
          autoBidAmount: amount,
          autoBidAlert: alert,
        },
        {
          headers: {
            'Access-Token': accessToken,
          },
        }
      );
      if (response.status === 200) {
        const user = response.data.user;
        setCurrentUser(user);
        handleAlertDialog({
          show: true,
          title: 'Update Success',
          message: 'Auto bidding settings updated successfully.',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error);
      handleAlertDialog({
        show: true,
        title: 'Update Failed',
        message: 'Error occurred while updating auto bidding settings.',
        type: 'warning',
      });
    }
  };
  return (
    <div className="bid-settings">
      <h3 className="bid-title">Auto Bidding Settings</h3>
      <div className="setting-groups">
        <div className="current-settings">
          <h4>Current Settings</h4>
          <p>Auto Bid Amount: {currentUser.autoBidAmount}</p>
          <p>Auto Bid Alert: {currentUser.autoBidAlert} %</p>
        </div>
        <div className="update-settings">
          <h4>Update Settings</h4>
          <form className="bid-settings-form" onSubmit={submitUpdateSettings}>
            <FormInput
              type="text"
              name="Amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              label="Amount"
              required
            />
            <FormInput
              type="text"
              name="Alert"
              value={alert}
              onChange={(e) => {
                setAlert(e.target.value);
              }}
              label="Alert"
              required
            />

            <CustomButton type="submit">Submit</CustomButton>
          </form>
        </div>
      </div>
      <SweetAlert
        show={show}
        success={type === 'success'}
        warning={type === 'warning'}
        title={title}
        onConfirm={() => handleAlertDialog({ show: false })}
      >
        {message}
      </SweetAlert>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  accessToken: selectAccessToken,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BidSettings);
