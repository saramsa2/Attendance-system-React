import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import UserName from "./UserName";
import Select from "react-select";

function SelectStudents(props) {
    const students_id = props.students_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const StudentOptions = [];

    useEffect(() => {
        setSelectedStudents(students_id);
    }, [students_id]);

    useEffect(() => {
        props.parentCallback(selectedStudents);
    }, [selectedStudents.length]);


    useEffect(() =>{
        axios.get(BaseUrl+"student_viewset/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setStudents(response.data);
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

    students.map(student => {

        let username = <UserName userId={student.user.id} />;
        StudentOptions.push({value: student.student_id, label: username });
    });

    function studentHandler(event) {
        let newSelect = []
        event.map(object => {
            newSelect.push(object.value);
        })
        setSelectedStudents(newSelect);
    }

    return (
        <div>
            {hasToken ?
                <React.Fragment>
                    <Select className={"basic-multi-select"} isSearchable={true} isMulti
                            value={StudentOptions.filter(object => selectedStudents.includes(object.value))}
                            options={StudentOptions} onChange={studentHandler} />
                </React.Fragment>
            :
                <React.Fragment>
                    ""
                </React.Fragment>
            }
        </div>
    );
}

export default SelectStudents;