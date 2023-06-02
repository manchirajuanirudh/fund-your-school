import React from "react";
import { Field, formInputData, formValidation } from 'reactjs-input-validator';
import { Redirect } from 'react-router-dom';
import { API_ROOT } from '../variables/api';

import {
  Button, FormGroup, Label, Input,
  Col,
  Card, CardBody, CardTitle, CardHeader,
  Container, UncontrolledTooltip
} from "reactstrap";


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      userData: {},
      tokenData: {},
      selectedOption: 'volunteer',
      apiPass:  false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }



  handleOptionChange(e) {

    this.setState({
      selectedOption: e.target.value
    });
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
    // this.state.data.userName= this.state.data.firstName+'_'+this.state.data.lastName;
    // if you want access to your form data
    const formData = formInputData(this.state.data); // eslint-disable-line no-unused-vars
    // tells you if the entire form validation is true or false
    const isFormValid = formValidation(this.state.data); // eslint-disable-line no-unused-vars
  }

  

  isLoginValid() {
    this.tokenData = {
      "userName": this.state.data.userName.value,
      "userType": this.state.selectedOption,
      "fullName": this.state.data.firstName.value + ' ' + this.state.data.lastName.value,
    };

    fetch(`${API_ROOT}/token`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.tokenData)
    })
      .then(function (resp) {
        return resp.clone().json();
      })
      .then((res) => {
        localStorage.setItem('token', `Bearer ${res.token}`);
        console.log(res.token, JSON.stringify(localStorage.getItem('token')));
        this.registerUser();

      });

  }
  registerUser() {
    fetch(`${API_ROOT}/rest/user/register`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Authorization": JSON.stringify(localStorage.getItem('token'))
      },
      body: JSON.stringify(this.state.userData)
    })
      .then(function (resp) {
        return resp.clone().json();
      })
      .then(({ results }) => {
        this.setState({ person: results,apiPass: true })
        if (this.state.isFormValid) {
          // do anything including ajax calls
          this.setState({ callAPI: true });
          console.log(this.props);
        } else {
          this.setState({ callAPI: true, shouldValidateInputs: !this.state.isFormValid });
        }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.userData = {
      "userName": this.state.data.userName.value,
      "userType": this.state.selectedOption,
      "password": this.state.data.password.value,
      "fullName": this.state.data.firstName.value + ' ' + this.state.data.lastName.value,
      "phoneNumber": this.state.data.phoneNumber.value,
      "email": this.state.data.email.value

    };
    this.setState({
      isFormValid: formValidation(this.state.data),
      userData: this.userData
    });
    this.isLoginValid();

  }


  render() {
    const classes = 'tooltip-inner'
    return (
      <div className="content">
        <Container className="login-form">
          <Card>
            <CardHeader >
              <CardTitle tag="h4">
                Please Fill the below Fields to Sign Up
                  </CardTitle>
            </CardHeader>
            <CardBody>
              <form className="form">
                <Col>
                  <FormGroup check required><p>Role:</p>
                    <Label check>
                      <Input type="radio" name="radio1" id="volunteer" required
                        checked={this.state.selectedOption === 'volunteer'}
                        onChange={this.handleOptionChange} value="volunteer" />{'Volunteer'}
                      <UncontrolledTooltip placement="top" target="volunteer">
                        Select Volunteer if you want to donate/contribute to Schools
                    </UncontrolledTooltip>
                    </Label>
                    <Label check>
                      <Input type="radio" name="radio1" id="SPOC" required
                        checked={this.state.selectedOption === 'SPOC'}
                        onChange={this.handleOptionChange} value="SPOC" />{'SPOC'}
                      <UncontrolledTooltip placement="top" target="SPOC">
                        Select Role as 'SPOC'(Single Point of Contact) only if you are taking care of the logistics of a school.
                    </UncontrolledTooltip>
                    </Label>
                  </FormGroup>
                  <br></br>
                  <Field
                    validator="isAlphanumeric" required minLength={2}
                    minLengthErrMsg="Name too short! It should be atleast 2 characters."
                    label="First Name" name="firstName" placeholder="First Name"
                    onChange={this.handleChange}
                    value={this.state.data.firstName}
                    shouldValidateInputs={this.state.shouldValidateInputs}
                  />
                  <Field
                    validator="isAlphanumeric" required minLength={2}
                    minLengthErrMsg="Name too short! It should be atleast 2 characters."
                    label="Last Name" name="lastName" placeholder="Last Name"
                    onChange={this.handleChange}
                    value={this.state.data.lastName}
                    shouldValidateInputs={this.state.shouldValidateInputs}
                  />
                  <Field
                    validator="isAlphanumeric" required minLength={8}
                    minLengthErrMsg="User Name too short! It should be atleast 8 characters."
                    label="User Name" name="userName" placeholder="User Name"
                    onChange={this.handleChange}
                    value={this.state.data.userName}
                    shouldValidateInputs={this.state.shouldValidateInputs}
                  />
                  <Field
                    validator="isNumeric" required minLength={10} maxLength={10}
                    minLengthErrMsg="Not a Valid Number. Please enter 10 digits."
                    label="Phone Number" name="phoneNumber" placeholder="Phone Number"
                    onChange={this.handleChange}
                    value={this.state.data.phoneNumber}
                    shouldValidateInputs={this.state.shouldValidateInputs}
                  />
                  <Field
                    validator="isEmail" required
                    label="Email" name="email" placeholder="Email"
                    onChange={this.handleChange}
                    value={this.state.data.email}
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
                  Signup
          </Button>
                {this.state.apiPass && (
                  <Redirect from="/login " to="/admin/dashboard" />
                )}
              </form>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}
export default Signup;