import React, {useEffect, useState} from 'react';
import Select from "react-select";
import axios from "axios";
import {BaseUrl} from "./constants";
import UserName from "./UserName";

function SelectLecturer(props) {
    const staff_id = props.state.staff_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [selectedLecturer, setSelectedLecturer] = useState("");
    const LecturerOptions = [];

    useEffect(() => {
        setSelectedLecturer(staff_id);
    }, [staff_id]);

    useEffect(() => {
        props.parentCallback(selectedLecturer);
    }, [selectedLecturer]);

    useEffect(() =>{
        axios.get(BaseUrl+"lecturer_viewset/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setLecturers(response.data);
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

    lecturers.map(lecturer => {
        LecturerOptions.push({value: lecturer.staff_id, label: lecturer.user.username });
    });

    function lecturerHandler(event) {
        if(event === null) {
            setSelectedLecturer("")
        } else {
            setSelectedLecturer(event.value)
        }
    }

    return (
        <div>
            {hasToken ?
                <React.Fragment>
                    <Select id={"selector"} className={"basic-single"} isSearchable={true} isClearable={true}
                            value={LecturerOptions.find(object => object.value === selectedLecturer)}
                            options={LecturerOptions}  onChange={lecturerHandler}  menuPortalTarget={document.querySelector('body')}/>
                </React.Fragment>
            :
                <React.Fragment>
                    ""
                </React.Fragment>
            }
        </div>
    );
}

export default SelectLecturer;