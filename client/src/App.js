import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from './redux/user/user.selector';

import LoginPage from './pages/login/login.component';
import HomePage from './pages/homepage/homepage.component';
import DashboardPage from './pages/dashboard/dashboard.component';
import ItemDetailPage from './pages/item-detail/item-detail.component';

const App = ({ currentUser }) => {
  return (
    <div>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route
          exact
          path="/"
          render={() => (currentUser ? <HomePage /> : <Redirect to="/login" />)}
        />
        <Route
          path="/dashboard"
          render={() =>
            currentUser ? <DashboardPage /> : <Redirect to="/login" />
          }
        />
        <Route
          path="/items/:itemId"
          render={() =>
            currentUser ? <ItemDetailPage /> : <Redirect to="/login" />
          }
        />
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(App);
