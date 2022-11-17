import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import UserName from "./UserName";
import LoginUserName from "./LoginUserName";

function Navigation(props) {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [userGroup, setUserGroup] = useState("");

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "usergroup/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setUserGroup(response.data[0].name);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken]);

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
                navigate("/Login");
                window.location.reload()
            })
            .catch(error => {
                console.log(error);
            })

    }

    return (
        <Navbar bg="light" expand="lg">
            {hasToken ?
            <Container>
                <Navbar.Brand href="/">Maungawhau College</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="container">
                        {userGroup==="Admin" ?
                            <React.Fragment>
                                <Nav.Link href="SemesterList"><Button className={"btn btn-primary"}>Semester</Button></Nav.Link>
                                <Nav.Link href="CourseList"><Button className={"btn btn-primary"}>Course</Button></Nav.Link>
                                <Nav.Link href="LecturerList"><Button className={"btn btn-primary"}>Lecturer</Button></Nav.Link>
                                <Nav.Link href="StudentList"><Button className={"btn btn-primary"}>Student</Button></Nav.Link>
                                <Nav.Link href="ClassList"><Button className={"btn btn-primary"}>Class</Button></Nav.Link>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <h2 className={"text-center"} style={{width:500}}>Welcome <LoginUserName /> </h2>
                                    <Link to={"/ClassList"} className={"btn btn-primary"} style={{width:100}}>Class</Link>
                            </React.Fragment>
                        }

                        </Nav>
                        {hasToken?
                        <Button className={"btn btn-info float-right"} onClick={logout}>Logout</Button>
                        :
                        <Link to={"/Login"} className={"btn btn-info float-right"}>Login</Link>
                        }
                </Navbar.Collapse>
            </Container>
                :
                <div style={{width:"100%"}}>
                    <h1 className={"text-center"}> Please login to use the system </h1>
                </div>
                 }
        </Navbar>
    );
}

export default Navigation;