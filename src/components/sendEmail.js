import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import Select from "react-select";

function SendEmail(props) {
    const navigate = useNavigate();
    const location=useLocation();
    const defaultStudent = location.state.student;
    const class_id = location.state.class_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [students, setStudents] = useState([]);
    const [classStudents, setClassStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [body, setBody] = useState("");
    const [subject, setSubject] = useState("");
    const [userGroup, setUserGroup] = useState("");
    const StudentOptions = [];

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

    useEffect(() => {
        if(students.length > 0) {
            let newSelect = []
            let test = students.find(student => student.student_id === defaultStudent).user.email;
            newSelect.push(students.find(student => student.student_id === defaultStudent).user.email);
            setSelectedStudents(newSelect);
        }
    }, [students]);

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "class_viewset/" + class_id +"/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    let tempClassStudents = response.data.student;
                    tempClassStudents.sort((a,b) => a > b ? 1: -1)
                    setClassStudents(tempClassStudents);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken]);

    useEffect(() =>{
        axios.get(BaseUrl+"student_viewset/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    },[hasToken])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    classStudents.map(student => {
        let classMember = students.find(obj => obj.student_id === student);
        if(classMember) {
            StudentOptions.push({value: classMember.user.email, label: classMember.user.username});
        }

    });


    function studentsHandler(event) {
        let newSelect = []
        event.map(object => {
            newSelect.push(object.value);
        })
        setSelectedStudents(newSelect);
    }

    function bodyHandler(event) {
        setBody(event.target.value);
    }

    function subjectHandler(event) {
        setSubject(event.target.value);
    }

    function sendEmailToStudents() {
        Promise.all(
            selectedStudents.map( student => {
                axios.post(BaseUrl+"sendmail/",
                    {
                        subject: subject,
                        body: body,
                        receiver: student
                    },
                    {headers:{
                    "Authorization": "Token "+token
                }})
            }))
            .then(response => {
                alert("The mail is sent");
                navigate(-1);
            })
            .catch(error=> {
                console.log(error);
                alert("Failed to add new date");
            });
    }

    return (
        <div className={"container"}>
            {hasToken && (userGroup === "Lecturer" || userGroup === "Admin")?
            <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                <h2>Send Email</h2>
                <table className={"table table-striped mb-0 card-body p-0"}>
                    <tbody>
                        <tr>
                            <td>To:</td>
                            <td><Select className={"basic-multi-select"} options={StudentOptions} isMulti
                                        value={StudentOptions.filter(object => selectedStudents.includes(object.value))}
                            onChange={studentsHandler} menuPortalTarget={document.querySelector('body')} /> </td>
                        </tr>
                        <tr>
                            <td>Subject:</td>
                            <td><input type={"text"} style={{width:"99%"}} onChange={subjectHandler}/> </td>
                        </tr>
                        <tr>
                            <td>Body:</td>
                            <td><textarea style={{width:"99%"}} rows={"10"} onChange={bodyHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><div>
                                <label style={{width:"10%"}}  />
                                <button className={"btn btn-info "}  style={{width:"20%"}} onClick={sendEmailToStudents}>Send email</button>
                                <label style={{width:"10%"}}  />
                                <button className={"btn btn-info"} style={{width:"20%"}} onClick={() => navigate(-1)}>Cancel</button>
                                <label style={{width:"10%"}} />
                            </div></td>

                        </tr>
                    </tbody>
                </table>
            </div>
            :
            <div>You don't have permission</div>
            }
        </div>
    );
}

export default SendEmail;