import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import UserName from "./UserName";

function LecturerName(props) {
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
            axios.get(BaseUrl + "lecturer_viewset/" + props.staff_id +"/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setName(<UserName userId={response.data.user.id} />);
                })
    }, [hasToken]);


    return (
        <React.Fragment>
            {name}
        </React.Fragment>
    );
}

export default LecturerName;