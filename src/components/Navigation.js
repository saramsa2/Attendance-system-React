import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

function Navigation(props) {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function logout() {
        let login_token = localStorage.getItem("token");
        axios.get(BaseUrl+"auth/logout/",
            {
                headers: {
                    'Authorization': 'token '+ login_token,
                }
            })
            .then(response => {
                console.log(response);
                localStorage.removeItem("token");
                setToken("");
                setHasToken(false);
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            })

    }

    return (
        <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Attendance System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="SemesterList"><Button className={"btn btn-primary"}>Semester</Button></Nav.Link>
            <Nav.Link href="CourseList"><Button className={"btn btn-primary"}>Course</Button></Nav.Link>
            <Nav.Link href="LecturerList"><Button className={"btn btn-primary"}>Lecturer</Button></Nav.Link>
            <Nav.Link href="StudentList"><Button className={"btn btn-primary"}>Student</Button></Nav.Link>
            <Nav.Link href="ClassList"><Button className={"btn btn-primary"}>Class</Button></Nav.Link>
          </Nav>
            {hasToken?
              <Button className={"btn btn-info float-right"} onClick={logout}>Logout</Button>
                :
                <Link to={"/Login"} className={"btn btn-info float-right"}>Login</Link>
              }
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
}

export default Navigation;