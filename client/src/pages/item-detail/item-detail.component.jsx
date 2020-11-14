import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import axios from '../../util/axios';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { setSearchQuery } from '../../redux/search/search.actions';
import { setCurrentItem } from '../../redux/items/items.actions';

import Header from '../../components/header/header.component';
import CustomButton from '../../components/custom-button/custom-button.component';

import './item-detail.styles.scss';
import FormInput from '../../components/form-input/form-input.component';
import UpdateItemForm from '../../components/update-item-form/update-item-form.component';
import { selectCurrentItem } from '../../redux/items/items.selector';

const ItemDetailPage = ({
  currentUser,
  currentItem,
  setCurrentItem,
  setSearchQuery,
}) => {
  const { itemId } = useParams();
  // const [currentItem, setCurrentItem] = useState({});
  const [timeDiff, setTimeDiff] = useState('');
  const [biddingAmount, setBiddingAmount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let difference = new Date(currentItem.biddingCloseAt) - new Date();
      if (difference > 0) {
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((difference / 1000 / 60) % 60);
        let seconds = Math.floor((difference / 1000) % 60);
        setTimeDiff(`${days} days ${hours}:${minutes}:${seconds}`);
      } else {
        setTimeDiff('Bidding has done');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentItem.biddingCloseAt]);

  useEffect(() => {
    const fetchItem = async () => {
      const response = await axios.get(`/items/${itemId}`);
      if (response.status === 200) {
        setCurrentItem(response.data);
      } else {
        alert('Error occurred while fetching data');
      }
    };
    fetchItem();
  }, [itemId, setCurrentItem]);

  const handleBid = async () => {
    if (currentItem.biddings && currentItem.biddings.length) {
      const latestBid = currentItem.biddings[currentItem.biddings.length - 1];
      if (latestBid.email === currentUser.email) {
        alert('You already placed the last bid');
        return;
      } else if (latestBid.amount >= biddingAmount) {
        alert('You need to bit more than previous users');
        return;
      }
    }
    const response = await axios.post(`/items/${itemId}/biddings`, {
      email: currentUser.email,
      amount: biddingAmount,
    });
    if (response.status === 200) {
      setCurrentItem(response.data);
      alert('Bidding has been placed successfully');
    } else {
      alert('Error occurred while placing bid');
    }
  };

  const handleDelete = async () => {
    const response = await axios.delete(`/items/${itemId}`);
    if (response.status === 200) {
      alert('Item Successfully Deleted');
      setSearchQuery('');
    } else {
      alert('Error occurred while deleting item');
    }
  };

  return (
    <div className="item-detail">
      <Header />
      <div className="item-wrapper">
        <div className="left-side">
          <div className="item-name">{currentItem.name}</div>
          {currentItem.imageUrl && (
            <img src={'http://localhost:3002/' + currentItem.imageUrl} alt="" />
          )}
          <div className="item-description">{currentItem.description}</div>
        </div>
        <div className="right-side">
          <h3>Price: {currentItem.price} USD</h3>

          {timeDiff === 'Bidding has done' ? (
            <p>Bidding has been finished</p>
          ) : (
            <div>
              {currentUser.email === 'admin@gmail.com' ? (
                <div>
                  <p>Time Remaining: {timeDiff}</p>
                  <div className="delete-button">
                    <CustomButton onClick={handleDelete}>
                      Delete Item
                    </CustomButton>
                  </div>
                  <UpdateItemForm item={currentItem} />
                </div>
              ) : (
                <div>
                  <FormInput
                    type="amount"
                    name="amount"
                    onChange={(e) => setBiddingAmount(e.target.value)}
                    value={biddingAmount}
                    label="Bidding Amount"
                    required
                  />
                  <CustomButton type="button" onClick={handleBid}>
                    Submit Bit
                    <br />
                    (Time Remaining: {timeDiff})
                  </CustomButton>
                </div>
              )}
            </div>
          )}

          <h4>Biddings</h4>
          {currentItem.biddings && currentItem.biddings.length ? (
            currentItem.biddings.map((bidding) => (
              <p key={bidding.createdAt}>
                {bidding.email} - {bidding.amount}USD
              </p>
            ))
          ) : (
            <p>No bidding has been placed</p>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  currentItem: selectCurrentItem,
});

const mapDispatchToProps = (dispatch) => ({
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  setCurrentItem: (item) => dispatch(setCurrentItem(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetailPage);
