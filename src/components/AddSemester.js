import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";


function AddSemester(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function addSemester() {
        if(hasToken){
            axios.post(BaseUrl+"semester_viewset/",
                {
                    year:document.getElementById("year").value,
                    semester:document.getElementById("name").value
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("New semester is created");
                    window.location.reload(false);
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to add new semester");
                });
        }

    }

    return (
        <div>
            <h3>New Semester</h3>
            <div className={"table-responsive"}>
            <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                <tbody>
                <tr>
                    <td><p>Year</p></td>
                    <td><p>Name</p></td>
                    <td></td>
                </tr>
                <tr>
                    <td><input type={"number"} id={"year"} /></td>
                    <td><input type={"text"} id={"name"} /></td>
                    <td><button className={"btn btn-info form-control text-reset"} onClick={addSemester} >Create</button></td>
                </tr>
            </tbody></table></div>
            <br/><br/>
        </div>
    );
}

export default AddSemester;