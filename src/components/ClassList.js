import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Link} from "react-router-dom";
import CourseName from "./CourseName";
import LecturerName from "./LecturerName";
import AddClass from "./AddClass";
import LecturerClass from "./LecturerClass";
import StudentClass from "./StudentClass";

function ClassList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [userGroup, setUserGroup] = useState("");
    const [checker, setChecker] = useState("");
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);

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
    }, [hasToken, checker]);


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
    },[hasToken, checker])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function deleteClass(event) {
         let class_id = event.target.value;
        axios.delete(BaseUrl+"class_viewset/"+class_id+"/",
            {headers:{
                    "Authorization": "Token "+token
            }})
            .then(response => {
                alert("The course is deleted");
                setChecker(checker+1);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addClassCallback = () => {
        setChecker(checker+1);
    }

    return (
        <div className={"container"} style={{paddingBottom:50}}>
            {hasToken?
            <div>
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                    <h2>Class List</h2>
                    {userGroup === "Admin" ?
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
                                    <td><Link to={"/Attendance"} state={{
                                        class_id: theClass.id,
                                        class_number: theClass.number
                                    }}>{theClass.number}</Link></td>
                                    <td><CourseName courseId={theClass.course}/></td>
                                    <td>{semesters.find(object => {
                                        return object.id === theClass.semester
                                    }).year}</td>
                                    <td>{semesters.find(object => {
                                        return object.id === theClass.semester
                                    }).semester}</td>
                                    <td><LecturerName staff_id={theClass.lecturer}/></td>
                                    <td>{theClass.student.findLastIndex(object => {
                                        return object > 1
                                    }) + 1}</td>
                                    <td>
                                        <Link to={"/ClassDetail"} state={{class_id: theClass.id}}
                                              className={"btn btn-success"}>Update</Link>
                                    </td>
                                    <td>
                                        <button className={"btn btn-success"} value={theClass.id}
                                                onClick={deleteClass}>Delete
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                    </table>
                    :
                        <React.Fragment>
                        {userGroup === "Lecturer" ?
                            <LecturerClass/>
                            :
                            <StudentClass/>
                        }
                        </React.Fragment>
                    }
                </div>
                {userGroup === "Admin" ?
                <footer className={" float-top  container card"}>
                   <AddClass parentCallback={addClassCallback} />
                </footer>
                    : <p></p> }
            </div>
            :
                <div>You don't have permission</div>
            }
        </div>
    );
}

export default ClassList;