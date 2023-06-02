import React from "react";
import { API_ROOT } from '../variables/api';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Col, Alert, Row, Button
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    const queryString = require('query-string');
    var parsed = queryString.parse(this.props.location.search);

    this.state = {
      data: {
        insta_id: parsed.payment_id,
        payment_status: parsed.payment_status.toUpperCase(),
        payment_id: parsed.id,
        transaction_id: parsed.transaction_id
      },
      payment: {},
      redirect: false
    }

  }

  goHome(){
    this.setState({redirect: true});
  }


  componentDidMount() {

    let input =
    {
      "instamojoId": this.state.data.insta_id,
      "paymentId": this.state.data.payment_id,
      "transactionId": this.state.data.transaction_id,
      "paymentStatus": this.state.data.payment_status,
      "token": localStorage.getItem('token').split(' ')[1]
    }

    fetch(`${API_ROOT}/rest/user/payment`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": JSON.stringify(localStorage.getItem('token'))
      },
      body: JSON.stringify(input)
    })
      .then((resp) => {
        return resp.clone().json();
      })
      .then((res) => {
        if (res.message === 'SUCCESS') {
          fetch(`${API_ROOT}/rest/user/transaction`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": JSON.stringify(localStorage.getItem('token'))
            },
            body: JSON.stringify({ "transactionId": input.transactionId })
          })
            .then((resp) => {
              return resp.clone().json();
            })
            .then((res) => {
              console.log(res);
              this.setState({ payment: res });
            });
        }
      });
  }


  render() {
    return (
      <div className="content">
        <Row>
          <Col sm="10" lg="8" md="8" xs="12">
            <Alert color="info" >
              <h4 className="alert-heading">Well done!</h4>
              <p>
                You started making a change with your gesture. Payment Successful!
        </p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col sm="10" lg="8" md="8" xs="12">
            <Card>
              {/* <img width="100%" src="../../../../assets/img/FUND.png" alt="Card image cap" /> */}
              <CardBody>
                <b>Your Donation Details</b>
                {/* <CardSubtitle>Card subtitle</CardSubtitle> */}
                <CardText>
                  <Row>

                    <Col md="4" sm="5" lg="4" xs="6">Donor Email
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment.email}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">Donor Full Name
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment.fullName}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">
                      School Name
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment && this.state.payment.school && this.state.payment.school.schoolName}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">
                      Project Name
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment && this.state.payment.project && this.state.payment.project.projectName}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">
                      Incharge Email
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment && this.state.payment.school && this.state.payment.school.spocEmail}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">
                      Incharge Contact
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment && this.state.payment.school && this.state.payment.school.spocPhone1}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">Amount Donated
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment.donated_amount}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">
                      User Name
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment.userName}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" sm="5" lg="4" xs="6">
                      Transaction Status
              </Col>
                    <Col md="4" sm="5" lg="4" xs="6">
                      {this.state.payment.status}
                    </Col>
                  </Row>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>

          <Col className="pull-right">
            <Button color="primary" size="sm" onClick={this.goHome.bind(this)}>Home</Button>
            {this.state.redirect && (
              <Redirect to={`/main/schools`} />
            )}
          </Col>
        </Row>

      </div>

    );
  }
}

export default Payment;