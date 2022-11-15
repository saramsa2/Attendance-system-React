import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import UserName from "./UserName";
import {Button} from "react-bootstrap";

function ClassAttendance(props) {
    const class_id = props.state.class_id;
    const class_date = props.state.selected_date;
    const class_total_day = props.state.total_day;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [checker, setChecker] = useState("");
    const [classCollegeDay, setClassCollegeDay] = useState([]);
    const [collegeDays, setCollegeDays] = useState([]);
    const [userGroup, setUserGroup] = useState("");
    const [classStudents, setClassStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendCounters, setAttendCounters] = useState([]);

    useEffect(() => {
        let studentAttend = []
        classStudents.map(student => {
            let counter = collegeDays.filter(obj => obj.student === student && obj.theClass === class_id && obj.attendance === true).length
            studentAttend.push({id: student, value: counter})
        })
        setAttendCounters(studentAttend)
    }, [classStudents, collegeDays, checker]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "student_viewset/",
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
                });
        }
    }, [hasToken]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "collegeday_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setCollegeDays(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },[hasToken, checker])

    useEffect(() => {
        let tempCollegeDay = [];
        collegeDays.map( collegeDay => {
            if(collegeDay.theClass === class_id && collegeDay.date === class_date) {
                tempCollegeDay.push(collegeDay)
            }
        })
        setClassCollegeDay(tempCollegeDay);
    }, [collegeDays, class_date]);

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

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function attendanceHandler(event) {
        let collegeDay_id = event.target.value;
        let new_attendance = !classCollegeDay.find(object => object.id = collegeDay_id).attendance
         if(hasToken){
            axios.patch(BaseUrl+"collegeday_viewset/" + collegeDay_id + "/",
                {
                    attendance: new_attendance
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("The attendance is updated");
                    setChecker(checker+1);
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to update");
                });
        }
    }

    return (
        <div className={"container"}>
            {class_date === "summary"?
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                    <h3>Summary</h3>
                    <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Attendance Ratio</th>
                                <th>Send email</th>
                            </tr>
                        </thead>
                        <tbody>
                        {classStudents.map(student =>
                            <tr key={student}>
                                {students.find(object => object.student_id === student) ?
                                    <td>{students.find(object => object.student_id === student).user.username}</td>:
                                <td/>}
                                {attendCounters.length > 0 ?
                                    <td>{attendCounters.find(obj => obj.id === student).value} / {class_total_day} </td>:
                                    <td/>}
                                <td></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                :
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                    <h3>{class_date}</h3>
                    <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                        {classStudents.map(student =>
                            <tr key={student}>
                                {students.find(object => object.student_id === student) ?
                                    <td>{students.find(object => object.student_id === student).user.username}</td>:
                                <td/>}
                                <td>{classCollegeDay.find(object => object.student === student)?
                                    <div>
                                        {classCollegeDay.find(object => object.student === student).attendance?
                                        <Button className={"btn btn-primary"} value={classCollegeDay.find(object => object.student === student).id}
                                                onClick={attendanceHandler}>Attend</Button>
                                        :
                                        <Button className={"btn btn-danger"} value={classCollegeDay.find(object => object.student === student).id}
                                                onClick={attendanceHandler}>Absent</Button>}
                                    </div>
                                    :<p>WAIT</p>}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                </div>}
        </div>
    );
}

export default ClassAttendance;