import React, {useEffect, useState} from 'react';
import SelectCourse from "./SelectCourse";
import SelectSemester from "./SelectSemester";
import SelectLecturer from "./SelectLecturer";
import SelectStudents from "./SelectStudents";
import axios from "axios";
import {BaseUrl} from "./constants";
import {useNavigate} from "react-router-dom";

function AddClass(props) {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [checker, setChecker] = useState(1);
    const [number, setNumber] = useState("");
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [lecturer, setLecturer] = useState("");
    const [students, setStudents] = useState([]);

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token, checker])

    function addClass() {
        if(hasToken){
            axios.post(BaseUrl+"class_viewset/",
                {
                    number: number,
                    semester: semester,
                    course: course,
                    lecturer: lecturer,
                    student: students
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("The class is created");
                    props.parentCallback();
                    window.location.reload(false);
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to create");
                });
        }
    }

    function numberHandler(event) {
        setNumber(event.target.value)
    }

    const semesterCallback = (data) => {
        setSemester(data);
    }

    const courseCallback = (data) => {
        setCourse(data);
    }

    const lecturerCallback = (data) => {
        setLecturer(data);
    }

    const studentCallback = (data) => {
        setStudents(data);
    }
    
    return (
        <div>
            {hasToken ?
            <React.Fragment>
                <h3>New Class</h3>
                <div className={"table-responsive"}>
                    <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                        <tbody>
                            <tr>
                                <td><p>Number</p></td>
                                <td><p>Course</p></td>
                                <td><p>Semester</p></td>
                                <td><p>Lecturer</p></td>
                                <td><p>Students</p></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><input type={"number"} id={"year"} onChange={numberHandler}/></td>
                                <td><SelectCourse state={{course_id:course}} parentCallback={courseCallback} /></td>
                                <td><SelectSemester state={{semester_id:semester}} parentCallback={semesterCallback} /></td>
                                <td><SelectLecturer state={{staff_id:lecturer}} parentCallback={lecturerCallback} /></td>
                                <td><SelectStudents students_id={students} parentCallback={studentCallback} /></td>
                                <td><button className={"btn btn-info form-control text-reset"} onClick={addClass} >Create</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
            </React.Fragment>
        :
            <div>You don't have permission</div>
        }
        </div>
    );
}

export default AddClass;