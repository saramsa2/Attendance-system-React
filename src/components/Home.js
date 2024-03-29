import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";

function Home(props) {

    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [userGroup, setUserGroup] = useState("");

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        } else {
            navigate("/Login");
            window.location.reload()
        }
    },[token])

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
                    navigate("/ClassList");
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken]);


    return (
        <div>
            Assignment 2 Homepage
        </div>
    );
}

export default Home;