import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setCurrentItem } from '../../redux/items/items.actions';
import { setSearchQuery } from '../../redux/search/search.actions';
import { selectCurrentItem } from '../../redux/items/items.selector';
import axios from '../../util/axios';

import DateTimePicker from 'react-datetime-picker';
import CustomButton from '../custom-button/custom-button.component';

import './update-item-form.styles.scss';

const UpdateItemForm = ({ currentItem, setSearchQuery, setCurrentItem }) => {
  const [itemId, setItemId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [biddingCloseAt, setBiddingCloseAt] = useState(new Date());

  useEffect(() => {
    setItemId(currentItem._id);
    setName(currentItem.name);
    setDescription(currentItem.description);
    if (currentItem.biddingCloseAt) {
      setBiddingCloseAt(new Date(currentItem.biddingCloseAt ?? ''));
    }
  }, [currentItem]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (biddingCloseAt < Date.now()) {
      alert('Your bidding should end in the future.');
      return;
    }
    let formData = new FormData();
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (biddingCloseAt) formData.append('biddingCloseAt', biddingCloseAt);
    if (image) formData.append('image', image);

    try {
      const response = await axios.put(`/items/${itemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Item Successfully Updated!');
        setSearchQuery('');
        setCurrentItem(response.data);
      }
    } catch (error) {
      alert('Error occurred while updating item!');
    }
  };

  return (
    <form className="update-item-form" onSubmit={handleSubmit}>
      <h3>Update Item</h3>

      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Name"
        required
      />
      <textarea
        type="text"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        label="Description"
        required
      />
      <input
        type="file"
        name="image"
        accept="image/png,image/jpeg"
        onChange={(event) => setImage(event.target.files[0])}
      />
      <DateTimePicker
        className="date-time-picker"
        onChange={setBiddingCloseAt}
        value={biddingCloseAt}
      />
      <CustomButton type="submit">Update</CustomButton>
    </form>
  );
};
const mapStateToProps = createStructuredSelector({
  currentItem: selectCurrentItem,
});

const mapDispatchToProps = (dispatch) => ({
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  setCurrentItem: (item) => dispatch(setCurrentItem(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateItemForm);
