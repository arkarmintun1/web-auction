import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from './redux/user/user.selector';

import LoginPage from './pages/login/login.component';
import RegisterPage from './pages/register/register.component';
import HomePage from './pages/homepage/homepage.component';
import DashboardPage from './pages/dashboard/dashboard.component';
import ItemDetailPage from './pages/item-detail/item-detail.component';

const App = ({ currentUser }) => {
  const handleHomeRoute = () => {
    return currentUser ? <HomePage /> : <Redirect to="/login" />;
  };

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

  const handleItemDetail = () => {
    return currentUser ? <ItemDetailPage /> : <Redirect to="/login" />;
  };

  return (
    <div>
      <Switch>
        <Route exact path="/" render={handleHomeRoute} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard" render={handleDashbordRoute} />
        <Route path="/items/:itemId" render={handleItemDetail} />
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(App);
