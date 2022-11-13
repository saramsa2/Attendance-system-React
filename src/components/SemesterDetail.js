import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";



function SemesterDetail(props) {
    const location=useLocation();
    const navigate = useNavigate();
    const semester_id = location.state.semester_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [year, setYear] = useState("");
    const [name, setName] = useState("");

    useEffect(() =>{
        axios.get(BaseUrl+"semester_viewset/"+semester_id + "/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setYear(response.data.year);
                setName(response.data.semester);
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

    function updateSemester() {
        if(hasToken){
            let login_token = token;
            axios.patch(BaseUrl+"semester_viewset/" + semester_id + "/",
                {
                    year:document.getElementById("year").value,
                    semester:document.getElementById("name").value
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("The semester is updated");
                    navigate("/SemesterList");
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to update");
                });

        }
    }

    function yearHandler(event) {
        setYear(event.target.value);
    }

    function nameHandler(event) {
        setName(event.target.value);
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
                                                <td><label className={"control-label text-right align-middle"}>Year</label></td>
                                                <td><input className={"form-control"}  id={"year"} type={"number"} value={year} onChange={yearHandler} /></td>
                                            </tr>
                                            <tr>
                                                <td><label className={" control-label text-right align-middle"}>Name</label></td>
                                                <td><input className={"form-control"} id={"name"} type={"text"} value={name} onChange={nameHandler} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className={"table"}>
                                        <thead>
                                           <tr>
                                               <td><button className={"btn btn-success form-control"} onClick={updateSemester}>Submit</button></td>
                                               <td><Link to={"/SemesterList"} className={"btn btn-success form-control"}>Cancel</Link></td>
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
                    ""
                </React.Fragment>
            }
        </div>
    );
}

export default SemesterDetail;