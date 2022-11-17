import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Link} from "react-router-dom";
import CourseName from "./CourseName";

function StudentClass(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [classes, setClasses] = useState([]);
    const [studentClass, setStudentClass] = useState([]);
    const [semesters, setSemesters] = useState([]);

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
        let newClass = [];
        if(classes.length > 0 && studentId != "") {
            classes.map(theClass => {
                if(theClass.student.includes(studentId)) {
                    newClass.push(theClass)
                }
            });
            setStudentClass(newClass);
        }
    }, [classes, studentId]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "student_id/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setStudentId(response.data.student_id);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },[hasToken])

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

    return (
        <React.Fragment>
            {hasToken && studentClass.length > 0 ?
            <div>
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                    <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                        <thead className={"table-dark"}>
                        <tr>
                            <th scope="col">Number</th>
                            <th scope="col">Course</th>
                            <th scope="col">Year</th>
                            <th scope="col">Semester</th>
                            <th scope="col">Students No.</th>
                        </tr>
                        </thead>

                        <tbody>
                        {studentClass.map(theClass =>
                            <tr key={theClass.id}>
                                <td><Link to={"/Attendance"} state={{
                                        class_id: theClass.id,
                                        class_number: theClass.number
                                    }}>{theClass.number}</Link></td>
                                    <td><CourseName courseId={theClass.course}/></td>
                                    <td>{semesters.find(object => {return object.id === theClass.semester}).year}</td>
                                    <td>{semesters.find(object => {return object.id === theClass.semester}).semester}</td>
                                    <td>{theClass.student.findLastIndex(object => {return object > 1}) + 1}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

            </div>
            :
                <div>You don't have permission</div>
            }
        </React.Fragment>
    );
}

export default StudentClass;