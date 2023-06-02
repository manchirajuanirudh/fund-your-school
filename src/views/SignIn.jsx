import React from "react";
import { Field, formInputData, formValidation } from 'reactjs-input-validator';
import { Link, Redirect, Switch } from 'react-router-dom';
import { API_ROOT } from '../variables/api';
import {
  Button,
  Col,
  Card, CardBody, CardTitle, CardHeader,
  Container
} from "reactstrap";
// import "./Login.css";

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      loginData: {},
      apiPass: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    fetch(`${API_ROOT}/token`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.defaultToken)
    })
      .then(function (resp) {
        return resp.clone().json();
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem('token', `Bearer ${res.token}`);
      });
  }

  defaultToken = {
    "userName": "browser",
    "fullName": "fundyourschool",
    "userType": "BROWSER"
  };

  handleChange(event, inputValue, inputName, validationState, isRequired) {
    const value = (event && event.target.value) || inputValue;
    const { data } = this.state;
    data[inputName] = { value, validation: validationState, isRequired };
    this.setState({
      data,
      isFormValid: false,
      validLogin: false
    });
    // if you want access to your form data
    const formData = formInputData(this.state.data); // eslint-disable-line no-unused-vars
    // tells you if the entire form validation is true or false
    const isFormValid = formValidation(this.state.data); // eslint-disable-line no-unused-vars
  }



  isLoginValid(token) {
    console.log(typeof JSON.stringify(localStorage.getItem('token')));
    if (JSON.stringify(localStorage.getItem('token')) === 'null') {

      fetch(`${API_ROOT}/token`, {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token)
      })
        .then(function (resp) {
          return resp.clone().json();
        })
        .then((res) => {
          console.log(res);
          localStorage.setItem('token', `Bearer ${res.token}`);
          this.login();
        });
    }
    else {
      this.login();
    }
  }
  login() {

    fetch(`${API_ROOT}/rest/user/login`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Authorization": JSON.stringify(localStorage.getItem('token')),
      },
      body: JSON.stringify({
        "userName": this.state.data.username.value,
        "password": this.state.data.password.value
      })
    })
      .then(function (resp) {
        console.log(resp.clone().json());
        return resp.clone().json();
      })
      .then((results) => {
        console.log(results);
        localStorage.setItem('token', `Bearer ${results.userToken}`);
        this.setState({ apiPass: true })
        if (this.state.isFormValid) {
          // do anything including ajax calls
          this.setState({ callAPI: true });
        } else {
          this.setState({ callAPI: true, shouldValidateInputs: !this.state.isFormValid });
        }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem('username',this.state.data.username.value);
    localStorage.setItem('password',this.state.data.password.value);
    this.loginData=  {
      "userName": this.state.data.username.value,
      "password": this.state.data.password.value
    }
    this.setState({
      isFormValid: formValidation(this.state.data),
      loginData: this.loginData
    });
    this.isLoginValid(this.defaultToken);

  }


  render() {
    return (
      <div className="content">
        <Container className="login-form">
          <Card>
            <CardHeader >
              <CardTitle tag="h4">
                Please Sign In
                  </CardTitle>
            </CardHeader>
            <CardBody>
              <form className="form">
                <Col>
                  <Field
                    validator="isAlphanumeric" required
                    label="User Name" name="username" placeholder="User Name"
                    onChange={this.handleChange}
                    value={this.state.data.username}
                    shouldValidateInputs={this.state.shouldValidateInputs}
                  />
                  <Field
                    validator="isAlphanumeric" required minLength={8}
                    minLengthErrMsg="Short passwords are easy to guess. Try one with atleast 8 characters"
                    label="Password" name="password" type="password" placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.data.password}
                    shouldValidateInputs={this.state.shouldValidateInputs}
                  />
                </Col>
                <Button
                  block
                  bssize="large"
                  onClick={this.handleSubmit}
                  type="submit"
                >
                  Login
          </Button>
                {this.state.apiPass && (
                  <Redirect from="/login " to="/main/schools" />
                )}
              </form>

              <p>Not a registered user? <Link to={`signup`}>Sign up Here</Link></p>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}
export default SignIn;