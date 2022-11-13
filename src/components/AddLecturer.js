import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";

function AddLecturer(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function addLecturer() {
        if(hasToken){
            axios.post(BaseUrl+"lecturer_viewset/",
                {
                    DOB: document.getElementById("dob").value,
                    user: {
                        username: document.getElementById("username").value,
                        password: document.getElementById("password").value,
                        email: document.getElementById("email").value
                    }},
                { headers: {
                    "Authorization": "Token "+token
                }})
                .then( response => {
                    alert("New lecturer is created");
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    return (
        <div>
            {hasToken ?
                <React.Fragment>
                    <h3>New Student</h3>
                    <div className={"table-responsive"}>
                        <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                            <tbody>
                            <tr>
                                <th><p>Username</p></th>
                                <th><p>Password</p></th>
                                <th><p>Email</p></th>
                                <th><p>Date of Birth</p></th>
                                <th></th>
                            </tr>
                            <tr>
                                <td><input type={"text"} id={"username"}/></td>
                                <td><input type={"password"} id={"password"}/></td>
                                <td><input type={"text"} id={"email"}/></td>
                                <td><input type={"date"} id={"dob"}/></td>
                                <td>
                                    <button className={"btn btn-info form-control text-reset"}
                                            onClick={addLecturer}>Create
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/><br/>
                </React.Fragment>
                :
                <div>You don't have permission</div>
            }
        </div>
    );
}

export default AddLecturer;