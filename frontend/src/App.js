import React, { Component, Fragment } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Nav from "./Components/Navigation/Navs";
import Shop from "./Components/Shop/Shop";
import LoginPage from "./Components/Pages/auth/login";
import SignUp from "./Components/Pages/auth/Signup";
import Form from "./Components/Form/Form";
import SingleProduct from "./Components/Shop/SingleProduct/SingleProduct";
import AdminProducts from "./Components/Admin-Products/admin-products";
import EditForm from "./Components/Edit-Form/editForm";

import { connect } from "react-redux";
import { clearUserId, setUserId } from "./Actions/actions";

import "./App.css";

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.props.setUserId(userId, token);
    this.setAutoLogout(remainingMilliseconds);
  }
  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  logoutHandler = () => {
    this.props.clearUserId();
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={() => <Shop token={this.props.token} />}
        />

        <Route path={"/login"} exact component={LoginPage} />
        <Route path="/register" exact component={SignUp} />
        <Route
          path="/shop"
          exact
          render={() => <Shop token={this.props.token} />}
        />
        <Route path="/products" exact component={Shop} />
        <Route
          path="/addproducts"
          exact
          render={() => <Form token={this.props.token} />}
        />
        <Route
          path="/adminproducts"
          exact
          render={() => (
            <AdminProducts
              token={this.props.token}
              userId={this.props.userId}
            />
          )}
        />
        <Route
          path="/:productId"
          exact
          render={() => <SingleProduct token={this.props.token} />}
        />
        <Route
          path="/edit/:productId"
          exact
          render={() => <EditForm token={this.props.token} />}
        />
      </Switch>
    );
    return (
      <Fragment>
        <Nav isAuth={this.props.isAuth} logoutClicked={this.logoutHandler} />
        {routes}
      </Fragment>
    );
  }
}

const mapStateFromProps = (state) => {
  return {
    isAuth: state.user.isAuth,
    token: state.user.token,
    userId: state.user.currentUserID,
  };
};

export default connect(mapStateFromProps, { clearUserId, setUserId })(
  withRouter(App)
);
