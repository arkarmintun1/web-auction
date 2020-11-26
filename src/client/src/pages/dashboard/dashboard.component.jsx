import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

import {
  selectCurrentItems,
  selectLoadingStatus,
  selectTotalItems,
  selectCurrentPage,
} from '../../redux/items/items.selector';
import { selectSearchQuery } from '../../redux/search/search.selector';
import {
  setCurrentItems,
  setTotalItems,
  startLoadingItems,
  finishLoadingItems,
  setCurrentPage,
} from '../../redux/items/items.actions';
import axios from '../../util/axios';

import Header from '../../components/header/header.component';
import NewItemForm from '../../components/new-item-form/new-item-form.componet';
import BidItem from '../../components/item/item.component';

import './dashboard.styles.scss';

const DashboardPage = ({
  currentItems,
  loadItems,
  totalItems,
  setCurrentItems,
  setTotalItems,
  startLoadingItems,
  finishLoadingItems,
  searchQuery,
  currentPage,
  setCurrentPage,
}) => {
  useEffect(() => {
    if (!loadItems) {
      startLoadingItems();
      const fetchItems = async () => {
        const response = await axios.get(
          `/items?query=${searchQuery}&page=${currentPage}`
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
    setTotalItems,
    finishLoadingItems,
    loadItems,
    currentPage,
    searchQuery,
  ]);

  return (
    <div className="dashboard">
      <Header showSearch={true} />
      <div className="container">
        <div className="items">
          <div className="bids-wrapper">
            {currentItems &&
              currentItems.map((item) => (
                <BidItem
                  key={item._id}
                  isAdmin={true}
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
        <div className="new-item">
          <NewItemForm />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentItems: selectCurrentItems,
  loadItems: selectLoadingStatus,
  totalItems: selectTotalItems,
  searchQuery: selectSearchQuery,
  currentPage: selectCurrentPage,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentItems: (items) => dispatch(setCurrentItems(items)),
  setTotalItems: (numberOfItems) => dispatch(setTotalItems(numberOfItems)),
  startLoadingItems: () => dispatch(startLoadingItems()),
  finishLoadingItems: () => dispatch(finishLoadingItems()),
  setCurrentPage: (index) => dispatch(setCurrentPage(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
