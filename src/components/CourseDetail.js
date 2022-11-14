import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";

function CourseDetail(props) {
    const location=useLocation();
    const navigate = useNavigate();
    const course_id = location.state.course_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        axios.get(BaseUrl+"course_viewset/" + course_id + "/",
            {headers:{
                    "Authorization": "Token "+token
            }})
            .then(response => {
                setCode(response.data.code);
                setName(response.data.name);
            })
            .catch(error => {
                console.log(error);
            });
    }, [hasToken])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function codeHandler(event) {
        setCode(event.target.value);
    }

    function nameHandler(event) {
        setName(event.target.value);
    }

    function updateCourse() {
        if(hasToken){
            axios.patch(BaseUrl+"course_viewset/" + course_id + "/",
                {
                    code:code,
                    name:name
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("The semester is updated");
                    navigate("/CourseList");
                    setToken(token);
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to update");
                });

        }
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
                                                <td><label className={"control-label text-right align-middle"}>Code</label></td>
                                                <td><input className={"form-control"}  id={"code"} type={"text"} value={code} onChange={codeHandler} /></td>
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
                                               <td><button className={"btn btn-success form-control"} onClick={updateCourse}>Submit</button></td>
                                               <td><Link to={"/CourseList"} className={"btn btn-success form-control"}>Cancel</Link></td>
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

export default CourseDetail;