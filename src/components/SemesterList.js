import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import AddSemester from "./AddSemester";
import {Link} from "react-router-dom";

function SemesterList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
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
    },[hasToken])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function deleteSemester(event) {
        let semester_id = event.target.value;
        axios.delete(BaseUrl+"semester_viewset/"+semester_id+"/",
            {headers:{
                    "Authorization": "Token "+token
            }})
            .then(response => {
                alert("Semester is deleted");
                setHasToken(hasToken);
                // window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (

        <div className={"card container"}>
            {hasToken?
            <div>
                <div className={"table-responsive table-scroll"} data-mdb-perfect-scrollbar={"true"}>
                    <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                        <thead className={"table-dark"}>
                        <tr>
                            <th scope="col">Year</th>
                            <th scope="col">Name</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {semesters.map(semester =>
                            <tr key={semester.id}>
                                <td>{semester.year}</td>
                                <td>{semester.semester}</td>
                                <td>
                                    <Link  to={"/SemesterDetail"} state={{semester_id:semester.id}} className={"btn btn-success"}>Update</Link>
                                </td>
                                <td>
                                    <button className={"btn btn-success"} value={semester.id} onClick={deleteSemester}>Delete</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <footer className={"fixed-bottom  container card"}>
                    <AddSemester/>
                </footer>
            </div>
            :
                <div>You don't have permission</div>
            }
        </div>
    );
}

export default SemesterList;