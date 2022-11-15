import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import Select from "react-select";

function SelectSemester(props) {
    const semester_id = props.state.semester_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const SemesterOptions = [];

    useEffect(() => {
        setSelectedSemester(semester_id);
    }, [semester_id]);

    useEffect(() => {
        props.parentCallback(selectedSemester);
    }, [selectedSemester]);


    useEffect(() =>{
        axios.get(BaseUrl+"semester_viewset/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setSemesters(response.data);
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

    semesters.map(semester => {
        SemesterOptions.push({value: semester.id, label: semester.semester +"("+ semester.year +")"});
    });

    function semesterHandler(event) {
        setSelectedSemester(event.value);
    }

    return (
        <div>
            {hasToken ?
                <React.Fragment>
                    <Select id={"selector"} className={"basic-single"} isSearchable={true}
                            value={SemesterOptions.find(object => object.value === selectedSemester)}
                            options={SemesterOptions}  onChange={semesterHandler}  menuPortalTarget={document.querySelector('body')}/>
                </React.Fragment>
            :
                <React.Fragment>
                    ""
                </React.Fragment>
            }
        </div>
    );
}

export default SelectSemester;