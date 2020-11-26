import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import CustomButton from '../../components/custom-button/custom-button.component';

import './item.styles.scss';

const BidItem = ({
  history,
  name,
  imgUrl,
  id,
  biddingCloseAt,
  price,
  isAdmin = false,
}) => {
  const [timeDiff, setTimeDiff] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      let difference = new Date(biddingCloseAt) - new Date();
      if (difference > 0) {
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((difference / 1000 / 60) % 60);
        let seconds = Math.floor((difference / 1000) % 60);
        setTimeDiff(`${days} days ${hours}:${minutes}:${seconds}`);
      } else {
        setTimeDiff('ended');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [biddingCloseAt]);

  const handleClick = () => {
    history.push(`/items/${id}`);
  };

  return (
    <div className="item">
      <div className="item-top">
        <img
          className="item-image"
          src={'http://localhost:3002' + imgUrl}
          alt=""
        />
        <div className="item-name">{name}</div>
        <div className="item-price">
          <strong>Price: {price} USD</strong>
        </div>
      </div>
      <div className="item-bottom">
        <div className="item-time-remaining">Time reamining: {timeDiff}</div>
        <CustomButton onClick={handleClick}>
          {isAdmin ? 'View Detail' : 'Bid Now'}
        </CustomButton>
      </div>
    </div>
  );
};

export default withRouter(BidItem);
