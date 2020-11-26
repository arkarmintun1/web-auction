import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component';
import { setCurrentUser, setAccessToken } from '../../redux/user/user.actions';
import axios from '../../util/axios';

import './login.styles.scss';

const LoginPage = ({ history, setCurrentUser, setAccessToken }) => {
  const [alert, setAlert] = useState({
    show: false,
    title: 'Register',
    type: 'success',
    message: '',
    isAdmin: false,
  });

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const { email, password } = credentials;
  const { show, title, message, type, isAdmin } = alert;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleAlert = (props) => {
    setAlert({ ...alert, ...props });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const { token, user } = response.data;
        setAccessToken(token);
        setCurrentUser(user);

        handleAlert({
          show: true,
          title: 'Login Success',
          message: 'Logged in successfully.',
          type: 'success',
          isAdmin: user.role === 'admin',
        });
      }
    } catch (error) {
      const errorMessage = error.response.data
        ? error.response.data.error
        : 'Error occurred while logging into your account.';
      handleAlert({
        show: true,
        title: 'Login Failed',
        message: errorMessage,
        type: 'warning',
      });
    }
  };

  const closeAlert = () => {
    handleAlert({ show: false });
    if (isAdmin) {
      history.push('/dashboard');
    } else {
      history.push('/');
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
        <CustomButton type="button" onClick={() => history.push('/register')}>
          Don't have an account? Register
        </CustomButton>
      </form>

      <SweetAlert
        show={show}
        success={type === 'success'}
        warning={type === 'warning'}
        title={title}
        onConfirm={closeAlert}
      >
        {message}
      </SweetAlert>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setAccessToken: (token) => dispatch(setAccessToken(token)),
});

export default connect(null, mapDispatchToProps)(withRouter(LoginPage));
