import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";

function LecturerDetail(props) {
    const location=useLocation();
    const navigate = useNavigate();
    const staff_id = location.state.staff_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [user_id, setUser_id] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");

    useEffect(() =>{
        axios.get(BaseUrl + "lecturer_viewset/" + staff_id + "/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setUser_id(response.data.user.id);
                setUsername(response.data.user.username);
                setFirst_name(response.data.user.first_name);
                setLast_name(response.data.user.last_name);
                setEmail(response.data.user.email);
                setDob(response.data.DOB);
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

    function emailHandler(event) {
        setEmail(event.target.value);
    }

    function dobHandler(event) {
        setDob(event.target.value);
    }

    function updateLecturer() {
        if(hasToken){
            axios.patch(BaseUrl+"lecturer_viewset/" + staff_id + "/",
                {
                    DOB: dob,
                    user: {
                        email: email,
                        first_name: first_name,
                        last_name: last_name
                    },
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("The Lecturer is updated");
                    navigate("/LecturerList");
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to update");
                });
        }
    }

    function firstNameHandler(event) {
        setFirst_name(event.target.value);
    }

    function lastNameHandler(event) {
        setLast_name(event.target.value);
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
                                                <td><label className={"control-label text-right align-middle"}>Username</label></td>
                                                <td><input className={"form-control"}  id={"username"} type={"text"} value={username} disabled={true}/></td>
                                            </tr>
                                            <tr>
                                                <td><label className={"control-label text-right align-middle"}>First Name</label></td>
                                                <td><input className={"form-control"}  id={"first_name"} type={"text"} value={first_name} onChange={firstNameHandler} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={"control-label text-right align-middle"}>Last Name</label></td>
                                                <td><input className={"form-control"}  id={"last_name"} type={"text"} value={last_name} onChange={lastNameHandler} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={" control-label text-right align-middle"}>Email</label></td>
                                                <td><input className={"form-control"} id={"email"} type={"text"} value={email} onChange={emailHandler} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={" control-label text-right align-middle"}>Date of Birth</label></td>
                                                <td><input className={"form-control"} id={"dob"} type={"date"} value={dob} onChange={dobHandler} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className={"table"}>
                                        <thead>
                                           <tr>
                                               <td><button className={"btn btn-success form-control"} onClick={updateLecturer}>Submit</button></td>
                                               <td><Link to={"/LecturerList"} className={"btn btn-success form-control"}>Cancel</Link></td>
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
                    <div>You don't have permission</div>
                </React.Fragment>
            }
        </div>
    );
}

export default LecturerDetail;