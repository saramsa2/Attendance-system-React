import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import Select from "react-select";

function SelectCourse(props) {
    const course_id = props.state.course_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const CourseOptions = [];

    useEffect(() => {
        setSelectedCourse(course_id);
    }, [course_id]);

    useEffect(() => {
        props.parentCallback(selectedCourse);
    }, [selectedCourse]);


    useEffect(() =>{
        axios.get(BaseUrl+"course_viewset/",
            {
                headers: {
                        "Authorization": "Token " + token
                    }
            })
            .then(response => {
                setCourses(response.data);
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

    courses.map(couse => {
        CourseOptions.push({value: couse.id, label: couse.name});
    });

    function courseHandler(event) {
        setSelectedCourse(event.value);
    }

    return (
        <div>
            {hasToken ?
                <React.Fragment>
                    <Select id={"selector"} className={"basic-single"} isSearchable={true}
                            value={CourseOptions.find(object => object.value === selectedCourse)}
                            options={CourseOptions}  onChange={courseHandler}/>
                </React.Fragment>
            :
                <React.Fragment>
                    ""
                </React.Fragment>
            }
        </div>
    );
}

export default SelectCourse;