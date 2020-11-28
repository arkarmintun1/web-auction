import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

import {
  selectCurrentItems,
  selectLoadingStatus,
  selectCurrentPage,
} from '../../redux/items/items.selector';
import { selectSearchQuery } from '../../redux/search/search.selector';
import {
  setCurrentItems,
  startLoadingItems,
  finishLoadingItems,
  setCurrentPage,
} from '../../redux/items/items.actions';
import { selectAccessToken } from '../../redux/user/user.selector';
import axios from '../../util/axios';

import Header from '../../components/header/header.component';
import BidItem from '../../components/item/item.component';

import './homepage.styles.scss';

const HomePage = ({
  currentItems,
  loadItems,
  setCurrentItems,
  startLoadingItems,
  finishLoadingItems,
  searchQuery,
  currentPage,
  setCurrentPage,
  accessToken,
}) => {
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!loadItems) {
      startLoadingItems();
      const fetchItems = async () => {
        const response = await axios.get(
          `/items?query=${searchQuery}&page=${currentPage}`,
          {
            headers: {
              'Access-Token': accessToken,
            },
          }
        );
        if (response.status === 200) {
          setCurrentItems(response.data.items);
          setTotalItems(response.data.totalItems);
        } else {
          alert('Error occurred');
        }
      };
      fetchItems();
      finishLoadingItems();
    }
  }, [
    startLoadingItems,
    setCurrentItems,
    finishLoadingItems,
    loadItems,
    currentPage,
    searchQuery,
    accessToken,
  ]);

  const handleOnClickSortByPrice = async () => {
    const response = await axios.get(
      `/items?query=${searchQuery}&page=${currentPage}&sort=price`,
      {
        headers: {
          'Access-Token': accessToken,
        },
      }
    );
    if (response.status === 200) {
      setCurrentItems(response.data.items);
      setTotalItems(response.data.totalItems);
    } else {
      alert('Error occurred');
    }
  };

  return (
    <div className="home">
      <Header showSearch={true} />
      <div className="container">
        <div className="home-title">
          <h2>Bidding Items</h2>
          <button type="button" onClick={handleOnClickSortByPrice}>
            Sort By Price
          </button>
        </div>

        <div className="bids-wrapper">
          {currentItems &&
            currentItems.map((item) => (
              <BidItem
                key={item._id}
                id={item._id}
                name={item.name}
                imgUrl={item.imageUrl}
                price={item.price}
                biddingCloseAt={item.biddingCloseAt}
              />
            ))}
        </div>
        <div className="item-pagination">
          <Pagination
            onChange={setCurrentPage}
            current={currentPage}
            total={totalItems}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentItems: selectCurrentItems,
  loadItems: selectLoadingStatus,
  searchQuery: selectSearchQuery,
  currentPage: selectCurrentPage,
  accessToken: selectAccessToken,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentItems: (items) => dispatch(setCurrentItems(items)),
  startLoadingItems: () => dispatch(startLoadingItems()),
  finishLoadingItems: () => dispatch(finishLoadingItems()),
  setCurrentPage: (index) => dispatch(setCurrentPage(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
