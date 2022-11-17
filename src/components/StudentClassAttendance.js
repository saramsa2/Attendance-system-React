import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";

function StudentClassAttendance(props) {
    const class_id = props.class_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [collegeDays, setCollegeDays] = useState([]);
    const [classCollegeDays, setClassCollegeDays] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classNumber, setClassNumber] = useState("");

    useEffect(() => {
        if(classes.length > 0 && class_id != "") {
            setClassNumber(classes.find(obj => obj.id === class_id).number);
        }
    }, [classes, class_id]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "class_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setClasses(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },[hasToken])

    useEffect(() => {
        if(collegeDays.length > 0 && studentId != "") {
            let newCollegeDay = [];
            collegeDays.map( collegeDay => {
                if(collegeDay.theClass === class_id && collegeDay.student === studentId) {
                    newCollegeDay.push(collegeDay)
                }
                newCollegeDay.sort((a,b) => a.date > b.date ? 1 : -1);

            })
            setClassCollegeDays(newCollegeDay);
        }
    }, [collegeDays, studentId]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "collegeday_viewset/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setCollegeDays(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },[hasToken])

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "student_id/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setStudentId(response.data.student_id);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },[hasToken])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    return (
        <div className={"container"} >
            <div className={"table-responsive table-scroll"}>
                <h3>{classNumber} Class</h3>
                <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Attendance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {classCollegeDays.map( collegeDay =>
                        <tr key={collegeDay.id}>
                            <td>{collegeDay.date}</td>
                            {collegeDay.attendance ?
                            <td><label >Attended</label></td> :
                            <td><label >-</label></td>}
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                    <tr class="table-secondary">
                        <td>Total</td>
                        <td>{classCollegeDays.filter(obj => obj.attendance === true).length} / {classCollegeDays.length}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    );
}

export default StudentClassAttendance;