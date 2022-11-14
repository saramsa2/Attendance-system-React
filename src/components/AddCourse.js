import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function AddCourse(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function addCourse() {
        if(hasToken){
            let login_token = token;
            axios.post(BaseUrl+"course_viewset/",
                {
                    code:document.getElementById("code").value,
                    name:document.getElementById("name").value
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    setToken(token);
                    alert("New course is created");
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to add new course");
                });
        }
    }

    return (
        <div>
            <h3>New Course</h3>
                <div className={"table-responsive"}>
                <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                    <tbody>
                    <tr>
                        <th><p>Course Code</p></th>
                        <th><p>Name</p></th>
                        <td></td>
                    </tr>
                    <tr>
                        <td><input type={"text"} id={"code"} /></td>
                        <td><input type={"text"} id={"name"} /></td>
                        <td><button className={"btn btn-info form-control text-reset"} onClick={addCourse} >Create</button></td>
                    </tr>
                </tbody></table></div>
                <br/><br/>
        </div>
    );
}

export default AddCourse;