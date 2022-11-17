import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import AddSemester from "./AddSemester";
import AddCourse from "./AddCourse";
import {Link} from "react-router-dom";

function CourseList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [userGroup, setUserGroup] = useState("");
    const [courses, setCourses] = useState([]);
    const [checker, setChecker] = useState("");

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
        if(hasToken) {
            axios.get(BaseUrl + "course_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setCourses(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken, checker])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
        setChecker(localStorage.getItem("checker"));
    },[token])

    function deleteCourse(event) {
        let course_id = event.target.value;
        axios.delete(BaseUrl+"course_viewset/"+course_id+"/",
            {headers:{
                    "Authorization": "Token "+token
            }})
            .then(response => {
                alert("The course is deleted");
                // window.location.reload(false);
                setChecker(checker +1);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addCourseCallback = () => {
        setChecker(checker +1);
    }

    return (
        <div className={"container"} style={{paddingBottom:200}}>
            {hasToken && userGroup==="Admin"?
            <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                <h2>Course List</h2>
                <table className={"table table-striped mb-0 card-body p-0"}>
                    <thead className={"table-dark"}>
                        <tr>
                            <th scope="col">Course Code</th>
                            <th scope="col">Name</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {courses.map(course =>
                        <tr key={course.id}>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>
                                <Link to={"/CourseDetail"} state={{course_id:course.id}} className={"btn btn-success"}>Update</Link>
                            </td>
                            <td><button className={"btn btn-success"} value={course.id} onClick={deleteCourse}>Delete</button></td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <footer className={"fixed-bottom  container card"}>
                    <AddCourse parentCallback={addCourseCallback} />
                </footer>
            </div>
            :
            <h1>You don't have permission</h1>
            }
        </div>
    );
}

export default CourseList;