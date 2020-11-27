import React from 'react';

import './form-input.styles.scss';

const FormInput = ({ label, handleChange, ...otherProps }) => {
  return (
    <div className="form-group">
      <input
        type="text"
        className="form-input"
        onChange={handleChange}
        {...otherProps}
      />
      <label className={`form-input-label ${otherProps.value ? 'shrink' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default FormInput;
