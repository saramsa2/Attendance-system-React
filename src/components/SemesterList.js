import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import AddSemester from "./AddSemester";
import {Link} from "react-router-dom";

function SemesterList(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [userGroup, setUserGroup] = useState("");
    const [semesters, setSemesters] = useState([]);
    const [checker, setChecker] = useState(1);

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
    },[hasToken, checker])

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
                setChecker(checker +1);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addSemesterCallback = () => {
        setChecker(checker +1);
    }

    return (
        <div className={"container"}  style={{paddingBottom:"200px"}}>
            {hasToken && userGroup==="Admin"?
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
                    <AddSemester parentCallback={addSemesterCallback} />
                </footer>
            </div>
            :
                <h1>You don't have permission</h1>
            }
        </div>
    );
}

export default SemesterList;