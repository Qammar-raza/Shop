import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setUserId } from "../../../Actions/actions";
import React, { Component } from "react";
import "./login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    errors: [],
    token: null,
    authLoading: false,
    isAuth: false,
    Admin: false,
  };

  inputChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  loginHandler = (event, authData) => {
    console.log("Auth Data Coming From the Login Form : ", authData);
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        Admin: authData.isAdmin,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation Failed");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error");
          throw new Error("Could not authenticate you !");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.props.setUserId(resData.userId, resData.token);
        this.setState({
          isAuth: true,
          authLoading: false,
          userId: resData.userId,
          token: resData.token,
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliSeconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliSeconds
        );
        localStorage.setItem("expiryDate", expiryDate);
        this.setAutoLogout(remainingMilliSeconds);

        this.props.history.replace("/");
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };
  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  isFormValid = ({ email, password }) => {
    return email && password;
  };
  displayErrorMessage = (errors) =>
    errors.map((err, i) => <p key={i}> {err.message}</p>);

  render() {
    return (
      <Grid textAlign="center" verticalAlign="bottom">
        <Grid.Column style={{ maxWidth: 500 }} className="log-App">
          <Header as="h2" icon textAlign="center" color="black">
            <Icon name="shopping cart" inverted color="blue" />
            Login To My Shop
          </Header>
          <Form
            onSubmit={(e) =>
              this.loginHandler(e, {
                email: this.state.email,
                password: this.state.password,
                isAdmin: this.state.Admin,
              })
            }
          >
            <Segment stacked>
              <Form.Input
                name="email"
                icon="mail"
                type="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.inputChangeHandler}
              />
              <Form.Input
                name="password"
                icon="lock"
                iconPosition="left"
                type="password"
                placeholder="Password"
                onChange={this.inputChangeHandler}
              />
              <Form.Field>
                <Form.Radio
                  label="Admin"
                  checked={this.state.Admin}
                  onClick={(e) => {
                    e.preventDefault();
                    return this.setState({ Admin: !this.state.Admin });
                  }}
                />
              </Form.Field>
              <Button
                fluid
                size="large"
                color="blue"
                disabled={this.props.loading}
                className={this.props.loading ? "loading" : "null"}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 ? (
            <Message error>
              Error
              {this.displayErrorMessage(this.state.errors)}
            </Message>
          ) : null}
          <Message>
            Don't have an account ?<Link to="/register"> Register Now </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(null, { setUserId })(Login);
