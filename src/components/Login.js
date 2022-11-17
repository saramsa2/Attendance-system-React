import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {useNavigate} from 'react-router-dom';

function Login(props) {
    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
            navigate("/ClassList")
        }
    },[token])
    
    function usernameHandler(event) {
        setUsername(event.target.value);
    }


    function passwordHandler(event) {
        setPassword(event.target.value);
    }

    function login() {
        axios.post(BaseUrl + "auth/",
            {
                username: username,
                password: password,
            })
            .then(response =>  {
                setToken(response.data);
                setHasToken(true);
                localStorage.setItem("token", response.data.token);
                window.location.reload(false);
                navigate("/ClassList");
            })
            .catch(error => {
                console.log(error);
            });
    }

    function logout() {
        let login_token = localStorage.getItem("token");
        axios.get(BaseUrl+"auth/logout/",
            {
                headers: {
                    'Authorization': 'token '+ login_token,
                }
            })
            .then(response => {
                console.log(response);
                localStorage.removeItem("token");
                setToken("");
                setHasToken(false);
                navigate("/Home")
            })
            .catch(error => {
                console.log(error);
            })

    }

    return (
        <div>
            {hasToken?
                <Fragment>
                    <button className={"btn btn-secondary"} onClick={logout}>Logout</button>
                </Fragment>
                :
                <Fragment>
                    <section className={"mt-5 p-4 d-flex justify-content-center pb-4"}>
                        <div className={"bg-white border rounded-5"}>
                            <section className={"w-100 p-4 d-flex justify-content-center pb-4"}>
                                <div style={{width: "26rem"}}>
                                    <div className={"form-group clearfix m-2"}>
                                        <label className={"col-md-4 control-label text-right "}>Username</label>
                                        <div>
                                            <input className={"form-control"} name={"username"} onChange={usernameHandler} />
                                        </div>
                                    </div>
                                    <div className={"form-group clearfix m-2"}>
                                        <label className={"col-md-4 control-label text-right"}>Password</label>
                                        <div>
                                            <input className={"form-control"} name={"password"} type={"password"} onChange={passwordHandler} />
                                        </div>
                                    </div>
                                    <div className={"col-md-offset-4 mt-5 ms-5 me-5"}>
                                        <button className={"btn btn-success form-control"} onClick={login} >Login</button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                </Fragment>
            }
        </div>
    );
}

export default Login;