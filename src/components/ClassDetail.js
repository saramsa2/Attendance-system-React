import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Link, useLocation, useNavigate} from "react-router-dom";
import SelectSemester from "./SelectSemester";
import SelectCourse from "./SelectCourse";
import SelectLecturer from "./SelectLecturer";
import SelectStudents from "./SelectStudents";
function ClassDetail(props) {
    const location=useLocation();
    const navigate = useNavigate();
    const class_id = location.state.class_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [number, setNumber] = useState("");
    const [semester, setSemester] = useState("");
    const [course, setCourse] = useState("");
    const [lecturer, setLecturer] = useState("");
    const [students, setStudents] = useState([]);
    const [collegeDays, setCollegeDays] = useState([]);

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
    },[hasToken])

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "class_viewset/" + class_id + "/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setNumber(response.data.number);
                    setSemester(response.data.semester);
                    setCourse(response.data.course);
                    if(response.data.lecturer != null) {
                        setLecturer(response.data.lecturer);
                    }
                    if(response.data.student != null) {
                        setStudents(response.data.student);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },[hasToken])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function updateClass() {
        if(hasToken){
            axios.patch(BaseUrl+"class_viewset/" + class_id+ "/",
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
                    alert("The class is updated");
                    navigate("/ClassList");
                    setToken(token);
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to update");
                });
        }

        if(collegeDays.length > 0 && class_id != "") {
            let newCollegeDay = []
            Promise.all(
                collegeDays.map(collegeDay => {
                    if(collegeDay.theClass === class_id && !students.includes(collegeDay.student)){

                        axios.delete(BaseUrl+ "collegeday_viewset/" + collegeDay.id +"/")

                    }
                })
            )
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                })
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
            {hasToken?
                <React.Fragment>
                    <section className={"mt-5 p-4 d-flex justify-content-center pb-4"}>
                        <div className={"bg-white border rounded-5"}>
                            <section className={"w-100 p-4 d-flex justify-content-center pb-4"}>
                                <div style={{width: "30rem"}}>
                                    <table className={"table mb-0 card-body p-0 table-hover table-fixed"}>
                                        <tbody>
                                            <tr>
                                                <td><label className={"control-label text-right align-middle"}>Number</label></td>
                                                <td><input className={"form-control"}  id={"number"} type={"number"} value={number} onChange={numberHandler} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={" control-label text-right align-middle"}>Course</label></td>
                                                <td><SelectCourse state={{course_id:course}} parentCallback={courseCallback} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={"control-label text-right align-middle"}>Semester</label></td>
                                                <td><SelectSemester state={{semester_id:semester}} parentCallback={semesterCallback} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={" control-label text-right align-middle"}>Lecturer</label></td>
                                                <td><SelectLecturer state={{staff_id:lecturer}} parentCallback={lecturerCallback} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={" control-label text-right align-middle"}>Students</label></td>
                                                <td><SelectStudents students_id={students} parentCallback={studentCallback} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className={"table"}>
                                        <thead>
                                           <tr>
                                               <td><button className={"btn btn-success form-control"} onClick={updateClass}>Submit</button></td>
                                               <td><Link to={"/ClassList"} className={"btn btn-success form-control"}>Cancel</Link></td>
                                           </tr>
                                        </thead>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </section>
                </React.Fragment>
                :
                <React.Fragment>
                    ""
                </React.Fragment>
            }
        </div>
    );
}

export default ClassDetail;