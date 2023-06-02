import React from "react";
import { API_ROOT } from '../variables/api';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Progress
} from "reactstrap";
import { Redirect } from 'react-router-dom';
class Schools extends React.Component {
  constructor(props){
    super(props);
    this.state={
      schools:[],
      redirect: false,
      schoolCode: 0
    }
  }
  

  componentDidMount(){
    fetch(`${API_ROOT}/rest/school/all`,{
       method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": JSON.stringify(localStorage.getItem('token'))
      }
    })
      .then((resp) => {
        return resp.clone().json();
      })
      .then((res) => {
        this.setState({schools: res.content});
      });
  }

  schoolDetails(obj){
    console.log(obj);
    this.setState({redirect: true,schoolCode: obj.code});
    // this.props.history.push(`/main/projects/${this.state.schoolCode}`);
    console.log(this.state.schoolCode);
  }



  render() {
    return (
      <div className="content">
        <h1>Onboarded Schools</h1>
        <Row>
        {this.state.schools.map(school => (
        // <li key={reptile}>{reptile}</li>
     
          <Col md="6" key={school.code}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4" key={school.schoolName}>
                  {school.schoolName}
              </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/2009-0617-Ontonagon-school.jpg" className="sq-image" alt="schoolName" />
                  </Col>
                  <Col sm="12" md="9">
                    <Row>
                      <Col md="4">
                        <p>Location</p>
                      </Col>
                      <Col md="8" key={school.village}>
                        <p>{school.village}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4">
                        <p>Unique ID</p>
                      </Col>
                      <Col md="8" key={school.school_id}>
                        <p>{school.school_id}</p>
                      </Col>
                    </Row>

                    
                    {/* <div className="text-center"><p>Fund Collected: 2500</p></div> */}
                    {/* <div className="text-center"><p>Fund Value: 5000</p></div> */}
                    <Progress value="40" color="info">Amount Collected: 2500</Progress>
                    <div className="text-center"><p>Fund Value: 5000</p></div>
                    
                    <Row>
                      <Col>
                        <Button bssize="small" onClick={this.schoolDetails.bind(this,school)} type="submit">More Details</Button>
                      {this.state.redirect && (
                      <Redirect from="/main/schools" to={`/main/projects/${this.state.schoolCode}`} />
                      )}
                      </Col>
                    </Row>
                  </Col>

                </Row>
              </CardBody>
            </Card>

          </Col>
          ))}
        </Row>

      </div>
    );
  }
}

export default Schools;