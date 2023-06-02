import React from "react";
import { API_ROOT } from '../variables/api';
import { Field, formInputData, formValidation } from 'reactjs-input-validator';
import {
  Button,
  Card,CardHeader,CardBody,CardTitle,
  Row,Col,Progress,Table, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

const items = [
  {
    src: 'http://images6.fanpop.com/image/photos/36800000/School-image-school-36812016-500-434.jpg',
    altText: 'Slide 1',
    id: "image1"
  },
  {
    src: 'https://www.cdc.gov/features/healthy-schools-successful-students/healthy-schools-successful-students_456px.gif',
    altText: 'Slide 2',
    id:"image2"
  },
  {
    src: 'https://image.shutterstock.com/image-vector/school-building-bus-front-yard-260nw-322015064.jpg',
    altText: 'Slide 3',
    id:"image3"
  }
];

class Projects extends React.Component {

//Carousel Code

constructor(props) {
  super(props);
  this.state={
    schoolDetails: {},
    projectDetails: [],
    modal: false, 
    data: {},
    project: {},
    donate: false,
    redirectURI: '',
    currentURI: window.location.href
  };
  this.handleChange= this.handleChange.bind(this);
}

componentDidMount(){
  const { match: { params } } = this.props;

  fetch(`${API_ROOT}/rest/school/${params.code}`,{
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
     this.setState({schoolDetails: res});
   });

   fetch(`${API_ROOT}/rest/school/project/${params.code}`,{
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
     this.setState({projectDetails: res});
   });
}

toggle(project) {
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
  this.setState({
    project: project
  });
}
donate(obj){
    let data={
      "token": localStorage.getItem('token').split(' ')[1],
      "projectId": obj.project_id,
      "donationAmount": Number(this.state.data.amount.value)
    }

    const isFormValid = formValidation(this.state.data);
 
    if (isFormValid) {
      // do anything including ajax calls
      this.setState({ callAPI: true });
      fetch(`${API_ROOT}/rest/user/donate`,{
        method: 'POST',
       headers: {
         "Content-Type": "application/json",
         "Authorization": JSON.stringify(localStorage.getItem('token'))
       },
       body: JSON.stringify(data)
     })
       .then((resp) => {
         return resp.clone().json();
       })
       .then((res) => {
         window.location.replace(res.paymentOptions.paymentUrl);
       });
    } else {
      this.setState({ callAPI: true, shouldValidateInputs: !isFormValid });
    }
  
}

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

  render() {

   
    return (
      <div className="content">
        <h1>School Name</h1>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  School Name
                  
                  <Progress value="50" color="info" className="projectProgress"><b>Amount Collected: 2500</b>
                  </Progress>
                    <div className="text-center"><p>Fund Value: 5000</p></div>
              </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="5" lg="5" sm="5" xs="12">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/2009-0617-Ontonagon-school.jpg" className="sq-image" alt="schoolName" />

                    <Table responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Fund Value</th>
                        <th>Fund Received</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.projectDetails.map((project, index) => (
                      <tr key={project.project_id}>
                        <th scope="row">{index+1}</th>
                        <td>{project.projectName}</td>
                        <td>{project.targetAmount}</td>
                        <td>{project.acheivedTarget}</td>
                        <td><Button color="primary" size="sm"  onClick={this.toggle.bind(this,project)}>Donate</Button></td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>

          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
          <Card>
            <CardBody>
            <h6>You are kind enough to donate. You are one step away to change the future of a child.Please enter the amount and Confirm.</h6>
          <Field
            validator="isNumeric" required
            label="Amount" name="amount" placeholder="Amount"
            onChange={this.handleChange}
            value={this.state.data.amount}
            shouldValidateInputs={this.state.shouldValidateInputs}
          />
          </CardBody>
          </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.donate.bind(this,this.state.project)}>Confirm</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>


                      
                  </Col>
                  <Col sm="7" lg="7" md="7" xs="12">
                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>School Name</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.schoolName}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Location</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.village}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Description</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.managementDesc}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Unique #</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.school_id}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Medium</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>English---</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Teacher Count</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.teacherCount}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>No. of Subjects</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.subjectCount}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Single Point of Contact</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.spocEmail}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Allocated Funds(in Rs.)</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>100----</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Completed Projects</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>a,b,c---</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Education Board</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>CBSE---</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Panchayat</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                        <p>{this.state.schoolDetails.panchayatDesc}</p>
                      </Col>
                    </Row>  

                    <Row>
                      <Col md="4" sm="4" lg="4" xs="6">
                        <p>Gender Ratio</p>
                      </Col>
                      <Col md="8" sm="8" lg="8" xs="6">
                      <Progress multi>
                        <Progress bar value="45">Boys(45%)</Progress>
                        <Progress bar color="info" value="55">Girls(55%)</Progress>
                      </Progress>---
                      </Col>
                    </Row>

                  </Col>

                </Row>
              </CardBody>
            </Card>

          </Col>

        </Row>

      </div>
    );
  }
}

export default Projects;