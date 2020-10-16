import React, { Component } from "react";
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

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    authLoading: false,
    isAuth: false,
    Admin: false,
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    console.log("Auth Data Coming From the SignUp Form : ", authData);
    this.setState({ authLoading: true });
    fetch("/auth/signup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        name: authData.username,
        isAdmin: authData.Admin,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error !");
          throw new Error("Creation of new User Failed !");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ authLoading: false, isAuth: false });
        this.props.history.replace("/");
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          authLoading: false,
          isAuth: false,
          error: err,
        });
      });
  };

  inputChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  saveUser = (userCreated) => {
    return this.state.userRef.child(userCreated.user.uid).set({
      name: userCreated.user.displayName,
      avatar: userCreated.user.photoURL,
    });
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFeildValid(this.state)) {
      error = "Please Fill All The Feilds";
      this.setState({
        errors: errors.concat(error),
      });
      return false;
    } else if (this.isPasswordValid(this.state)) {
      error = "Password is InValid";
      this.setState({
        errors: errors.concat(error),
      });
      return false;
    } else {
      return true;
    }
  };
  isFeildValid = ({ username, email, password, passwordConfirmation }) => {
    return !username || !email || !password || !passwordConfirmation;
  };
  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 5 || passwordConfirmation.length < 5) {
      return true;
    } else if (password !== passwordConfirmation) {
      return true;
    } else {
      return false;
    }
  };

  displayError = (errors) => errors.map((err, i) => <p key={i}>{err}</p>);

  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }} className="log-App">
          <Header as="h2" color="black" icon textAlign="center">
            <Icon name="puzzle piece" color="purple" inverted />
            Register to Employee Adder
          </Header>
          <Form onSubmit={(e) => this.signupHandler(e, this.state)}>
            <Segment stacked>
              <Form.Input
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                onChange={this.inputChangeHandler}
              />
              <Form.Input
                name="email"
                icon="mail"
                type="email"
                iconPosition="left"
                placeholder="Email"
                onChange={this.inputChangeHandler}
              />
              <Form.Input
                name="password"
                icon="lock"
                type="password"
                iconPosition="left"
                placeholder="Password"
                onChange={this.inputChangeHandler}
              />
              <Form.Input
                name="passwordConfirmation"
                icon="repeat"
                type="password"
                iconPosition="left"
                placeholder="Repeat Confirmation"
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
                color="blue"
                fluid
                size="large"
                disabled={this.state.loading}
                className={this.state.loading ? "loading" : ""}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 ? (
            <Message error>
              Error
              {this.displayError(this.state.errors)}
            </Message>
          ) : null}
          <Message>
            Already a member ?<Link to="/login"> Login </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
