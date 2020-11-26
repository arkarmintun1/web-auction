import { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from './redux/user/user.selector';
import {
  selectCurrentItems,
  selectCurrentItem,
} from './redux/items/items.selector';
import { setCurrentItems, setCurrentItem } from './redux/items/items.actions';
import socket from './util/socket';

import LoginPage from './pages/login/login.component';
import RegisterPage from './pages/register/register.component';
import HomePage from './pages/homepage/homepage.component';
import DashboardPage from './pages/dashboard/dashboard.component';
import ItemDetailPage from './pages/item-detail/item-detail.component';
import ProfilePage from './pages/profile/profile.component';

const App = ({
  currentUser,
  currentItem,
  currentItems,
  setCurrentItem,
  setCurrentItems,
}) => {
  /**
   * If current user exist, the user will be directed to home page.
   * If not, the user will be redirected to login page.
   */
  const handleHomeRoute = () => {
    return currentUser ? <HomePage /> : <Redirect to="/login" />;
  };

  /**
   * If current user does not exist, the user will be redirected to login page.
   * If the current user exists and the user is admin, dashboard will be displayed
   * If the current user is not admin, the user will be redirected to home page.
   */
  const handleDashbordRoute = () => {
    return currentUser ? (
      currentUser.role === 'admin' ? (
        <DashboardPage />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Redirect to="/login" />
    );
  };

  /**
   * Item detail will only be visible to logged in user
   */
  const handleItemDetail = () => {
    return currentUser ? <ItemDetailPage /> : <Redirect to="/login" />;
  };

  /**
   * If logged in user exists, the user will be redirected to home page.
   * If not, display register page.
   */
  const handleRegisterRoute = () => {
    return currentUser ? <Redirect to="/" /> : <RegisterPage />;
  };

  /**
   * If logged in user exists, the user will be redirected to home page.
   * If not, display login page.
   */
  const handleLoginRoute = () => {
    return currentUser ? <Redirect to="/" /> : <LoginPage />;
  };

  /**
   * If current user exists, display profile page
   * If not, redirect to home page.
   */
  const handleProfileRoute = () => {
    return currentUser ? <ProfilePage /> : <Redirect to="/" />;
  };

  /**
   * Socket is connected with the server for bid realtime updates
   */
  useEffect(() => {
    socket.emit('initial_data');
    socket.on('get_data', (data) => {
      console.log(data);
    });
    socket.on('bid_placed', (incomingItem) => {
      if (currentItem._id === incomingItem._id) {
        setCurrentItem(incomingItem);
      }
      const updatedItems = currentItems.map((item) => {
        if (item._id === incomingItem._id) {
          return incomingItem;
        }
        return item;
      });
      setCurrentItems(updatedItems);
    });
    return () => {
      socket.off('get_data');
      socket.off('bid_placed');
    };
  }, [currentItems, setCurrentItems, currentItem, setCurrentItem]);

  return (
    <div>
      <Switch>
        <Route exact path="/" render={handleHomeRoute} />
        <Route path="/register" render={handleRegisterRoute} />
        <Route path="/login" render={handleLoginRoute} />
        <Route path="/dashboard" render={handleDashbordRoute} />
        <Route path="/profile" render={handleProfileRoute} />
        <Route path="/items/:itemId" render={handleItemDetail} />
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  currentItems: selectCurrentItems,
  currentItem: selectCurrentItem,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentItems: (items) => dispatch(setCurrentItems(items)),
  setCurrentItem: (item) => dispatch(setCurrentItem(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
