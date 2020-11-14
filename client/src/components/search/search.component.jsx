import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../redux/items/items.actions';

import { setSearchQuery } from '../../redux/search/search.actions';

import CustomButton from '../custom-button/custom-button.component';

import './search.styles.scss';

const Search = ({ setSearchQuery, setCurrentPage }) => {
  const [search, setSearch] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setSearchQuery(search);
  };

  return (
    <div className="search">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or description"
          className="search-form-input"
          // required
        />
        <CustomButton type="submit">Search</CustomButton>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  setCurrentPage: (index) => dispatch(setCurrentPage(index)),
});

export default connect(null, mapDispatchToProps)(Search);
