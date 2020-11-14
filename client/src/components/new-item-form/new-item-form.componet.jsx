import React, { useState } from 'react';
import axios from '../../util/axios';

import DateTimePicker from 'react-datetime-picker';
import CustomButton from '../custom-button/custom-button.component';
import FormInput from '../form-input/form-input.component';

import './new-item-form.styles.scss';

const NewItemForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [biddingCloseAt, setBiddingCloseAt] = useState(new Date());

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (biddingCloseAt < Date.now()) {
      alert('Your bidding should end in the future.');
      return;
    }
    let formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('biddingCloseAt', biddingCloseAt);
    formData.append('image', image);
    try {
      const response = await axios.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('New Item Successfully Created!');
        resetFields();
      }
    } catch (error) {
      alert('Error occurred while creating new item!');
    }
  };

  const resetFields = () => {
    setName('');
    setDescription('');
    setImage('');
    setBiddingCloseAt(new Date());
  };

  return (
    <form className="new-item-form" onSubmit={handleSubmit}>
      <h3>Create New Item</h3>
      <FormInput
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Name"
        required
      />
      <FormInput
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
        required
      />
      <DateTimePicker
        className="date-time-picker"
        onChange={setBiddingCloseAt}
        value={biddingCloseAt}
      />
      <CustomButton type="submit">Submit</CustomButton>
    </form>
  );
};

export default NewItemForm;
