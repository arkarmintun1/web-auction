import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component';
import { setCurrentUser, setAccessToken } from '../../redux/user/user.actions';
import axios from '../../util/axios';

import './register.styles.scss';

const RegisterPage = ({ history, setCurrentUser, setAccessToken }) => {
  const [alert, setAlert] = useState({
    show: false,
    title: 'Register',
    type: 'success',
    message: '',
    goToHome: false,
  });
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = credentials;
  const { show, title, message, type, goToHome } = alert;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleAlert = (props) => {
    setAlert({ ...alert, ...props });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/register', {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        const { token, user } = response.data;
        setAccessToken(token);
        setCurrentUser(user);

        handleAlert({
          show: true,
          title: 'Register Success',
          message: 'User account has been created successfully.',
          type: 'success',
          goToHome: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response.data
        ? error.response.data.error
        : 'Error occurred while creating your user account.';
      handleAlert({
        show: true,
        title: 'Register Failed',
        message: errorMessage,
        type: 'warning',
      });
    }
  };

  const closeAlert = () => {
    handleAlert({ show: false });
    if (goToHome) {
      history.push('/');
    }
  };

  return (
    <div className="register">
      <h1 className="title">Web Auction</h1>
      <form className="form" onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          label="Username"
          required
        />
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
        <CustomButton type="submit">Register</CustomButton>
        <CustomButton type="button" onClick={() => history.push('/login')}>
          Already have an account? Login
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

export default connect(null, mapDispatchToProps)(withRouter(RegisterPage));
