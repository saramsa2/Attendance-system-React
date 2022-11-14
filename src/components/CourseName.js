import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function CourseName(props) {
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
            axios.get(BaseUrl + "course_viewset/" + props.courseId +"/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setName(response.data.name);
                })
    }, [hasToken]);

    return (
        <React.Fragment>
            {name}
        </React.Fragment>
    );
}

export default CourseName;