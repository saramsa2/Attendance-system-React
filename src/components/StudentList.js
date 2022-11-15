import React, {useEffect, useState} from 'react';

import axios from "axios";
import {BaseUrl} from "./constants";
import UserName from "./UserName";
import UserEmail from "./UserEmail";
import AddLecturer from "./AddLecturer";
import AddStudent from "./AddStudent";
import {Link} from "react-router-dom";

function StudentList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [checker, setChecker] = useState("");
    const [students, setStudents] = useState([]);

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
    },[hasToken, checker])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])


    function deleteStudent(event) {
        let user_id = event.target.value;
        axios.delete(BaseUrl+"user_viewset/"+user_id+"/",
            {headers:{
                    "Authorization": "Token "+token
            }})
            .then(response => {
                alert("The lecturer is deleted");
                setChecker(checker +1);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addStudentCallback = () => {
        setChecker(checker+1);
    }

    return (
        <div className={"container"} style={{paddingBottom:"200px"}}>
            {hasToken ?
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"} >
                    <h2>Student List</h2>
                    <table className={"table table-striped mb-0 card-body p-0"}>
                        <thead className={"table-dark"}>
                        <tr>
                            <th scope="col">Student ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                            {students.map(student =>
                                <tr key={student.student_id}>
                                    <td>{student.student_id}</td>
                                    <td><UserName userId={student.user.id} /></td>
                                    <td><UserEmail userId={student.user.id} /></td>
                                    <td><Link to={"/StudentDetail"} state={{student_id:student.student_id}} className={"btn btn-success"}>Update</Link></td>
                                    <td><button className={"btn btn-success"} value={student.user.id} onClick={deleteStudent}>Delete</button> </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <footer className={"fixed-bottom  container card"}>
                        <AddStudent parentCallback={addStudentCallback} />
                    </footer>
                </div>
            :
            <div>You don't have permission</div>
            }
        </div>
    );
}

export default StudentList;