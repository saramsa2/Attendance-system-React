import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function LoginUserName(props) {
     const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [name, setName] = useState("");

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "login_user_name/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setName(response.data.name);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [hasToken]);

    return (
        <React.Fragment>
            {name}
        </React.Fragment>
    );
}

export default LoginUserName;