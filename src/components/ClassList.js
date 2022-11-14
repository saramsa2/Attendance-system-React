import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Link} from "react-router-dom";
import AddSemester from "./AddSemester";
import UserName from "./UserName";
import CourseName from "./CourseName";
import LecturerName from "./LecturerName";

function ClassList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "lecturer_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setLecturers(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken])

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "semester_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setSemesters(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "class_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setClasses(response.data);
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

    function deleteClass() {

    }

    return (
        <div>
            {hasToken?
            <div>
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                    <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                        <thead className={"table-dark"}>
                        <tr>
                            <th scope="col">Number</th>
                            <th scope="col">Course</th>
                            <th scope="col">Year</th>
                            <th scope="col">Semester</th>
                            <th scope="col">Lecturer</th>
                            <th scope="col">Students No.</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {classes.map(theClass =>
                            <tr key={theClass.id}>
                                <td>{theClass.number}</td>
                                <td><CourseName courseId={theClass.course} /></td>
                                <td>{semesters.find(object => {return object.id === theClass.semester}).year}</td>
                                <td>{semesters.find(object => {return object.id === theClass.semester}).semester}</td>
                                {/*<td>{lecturers.find(object => {return object.staff_id === theClass.lecturer})}</td>*/}
                                <td><LecturerName staff_id={theClass.lecturer} /></td>
                                <td>{theClass.student.findLastIndex(object => {return object > 1})+1}</td>
                                <td>
                                    <Link  to={"/ClassDetail"} state={{class_id:theClass.id}} className={"btn btn-success"}>Update</Link>
                                </td>
                                <td>
                                    <button className={"btn btn-success"} value={theClass.id} onClick={deleteClass}>Delete</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <footer className={"fixed-bottom  container card"}>
                    {/*<AddSemester/>*/}
                </footer>
            </div>
            :
                <div>You don't have permission</div>
            }
        </div>
    );
}

export default ClassList;