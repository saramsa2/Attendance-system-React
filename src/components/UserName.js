import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function UserName(props) {
    const [name, setName] = useState("");

    useEffect(() => {
            axios.get(BaseUrl + "user_viewset/" + props.userId)
                .then(response => {
                    setName(response.data.username);
                })
    }, [name]);

    return (
        <Fragment>
            {name}
        </Fragment>
    );
}

export default UserName;