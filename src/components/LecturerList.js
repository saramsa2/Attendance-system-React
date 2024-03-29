import React, {useEffect, useState}  from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import UserName from "./UserName";
import UserEmail from "./UserEmail";
import AddLecturer from "./AddLecturer";
import {Link} from "react-router-dom";

function LecturerList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [userGroup, setUserGroup] = useState("");
    const [checker, setChecker] = useState(1);
    const [lecturers, setLecturers] = useState([]);

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
    }, [hasToken, checker])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function deleteLecturer(event) {
        let user_id = event.target.value;
        if(hasToken) {
            axios.delete(BaseUrl + "user_viewset/" + user_id + "/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    alert("The lecturer is deleted");
                    setChecker(checker +1);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    const addLecturerCallback = () => {
        setChecker(checker +1 );
    }

    return (
        <div className={"container"}>
            {hasToken && userGroup==="Admin"?
            <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                <h2>Lecturer List</h2>
                <table className={"table table-striped mb-0 card-body p-0"}>
                    <thead className={"table-dark"}>
                    <tr>
                        <th scope="col">Staff ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                        {lecturers.map(lecturer =>
                            <tr key={lecturer.staff_id}>
                                <td>{lecturer.staff_id}</td>
                                <td>{lecturer.user.username}</td>
                                <td>{lecturer.user.first_name}</td>
                                <td>{lecturer.user.last_name}</td>
                                <td>{lecturer.user.email}</td>
                                <td><Link  to={"/LecturerDetail"} state={{staff_id:lecturer.staff_id}} className={"btn btn-success"}>Update</Link></td>
                                <td><button className={"btn btn-success"} value={lecturer.user.id} onClick={deleteLecturer}>Delete</button> </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <footer className={"fixed-bottom  container card"}>
                    <AddLecturer parentCallback={addLecturerCallback} />
                </footer>
            </div>
            :
            <h1>Waiting for loading</h1>
            }
        </div>
    );
}

export default LecturerList;