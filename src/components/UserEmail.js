import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function UserEmail(props) {
    const [email, setEmail] = useState("");

    useEffect(() => {
            axios.get(BaseUrl + "user_viewset/" + props.userId)
                .then(response => {
                    setEmail(response.data.email);
                })
    }, [email]);

    return (
        <Fragment>
            {email}
        </Fragment>
    );
}

export default UserEmail;
