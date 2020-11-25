import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component';
import { setCurrentUser } from '../../redux/user/user.actions';

import './login.styles.scss';

const LoginPage = ({ history, setCurrentUser }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const { email, password } = credentials;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentUser({ email });
    // TODO:: API request to backend for authentication and use state management
    if (
      (email === 'user1@gmail.com' || email === 'user2@gmail.com') &&
      password === 'password'
    ) {
      history.push('/');
    } else if (email === 'admin@gmail.com' && password === 'password') {
      history.push('/dashboard');
    }
  };

  return (
    <div className="login">
      <h1 className="title">Web Auction</h1>
      <form className="form" onSubmit={handleSubmit}>
        <FormInput
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          label="Email"
          required
        />
        <FormInput
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          label="Password"
          required
        />
        <CustomButton type="submit">Login</CustomButton>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(withRouter(LoginPage));
