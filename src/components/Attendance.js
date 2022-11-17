import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {useLocation} from "react-router-dom";
import ClassAttendance from "./ClassAttendance";
import StudentClassAttendance from "./StudentClassAttendance";

function Attendance(props) {
    const location=useLocation();
    const class_id = location.state.class_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [checker, setChecker] = useState("");
    const [collegeDays, setCollegeDays] = useState([]);
    const [userGroup, setUserGroup] = useState("");
    const [classDates, setClassDates] = useState([]);
    const [classStudents, setClassStudents] = useState([]);
    const [selectedDate, setSelectedDate] = useState("summary");

    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "class_viewset/" + class_id +"/.",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setClassStudents(response.data.student);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken]);


    useEffect(() => {
        let tempCollegeDay = [];
        let tempClassDate = [];
        collegeDays.map( collegeDay => {
            if(collegeDay.theClass === class_id) {
                if(!tempClassDate.includes(collegeDay.date)) {
                    tempClassDate.push(collegeDay.date)
                }
                tempCollegeDay.push(collegeDay)
            }
        })
        tempClassDate.sort((a,b) => a < b ? 1: -1);
        setClassDates(tempClassDate);
    }, [collegeDays]);


    useEffect(() => {
        if(hasToken) {
            axios.get(BaseUrl + "usergroup/",
                {
                    headers: {
                        "Authorization": "Token " + token
                    }
                })
                .then(response => {
                    setUserGroup(response.data[0].name);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [hasToken]);

    
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
    },[hasToken, checker])

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    let today = new Date();
    let defaultDate = today.toISOString().substring(0,10);

    function addNewDate() {
        let newCollegeDay = [];
        let newDate = document.getElementById("newDate").value;
        classStudents.map(student => {
            newCollegeDay.push({
                date: newDate,
                student: student,
                attendance: false,
                theClass: class_id
            })
        })
        Promise.all(
            newCollegeDay.map(collegeDay => {
                axios.post(BaseUrl+"collegeday_viewset/",
                    collegeDay,
                    {headers:{
                    "Authorization": "Token "+token
                }})
            })
        )
            .then(response => {
                alert("New date is created");
                setChecker(checker + 1);
            })
            .catch(error=> {
                console.log(error);
                alert("Failed to add new date");
            });
    }

    function selectDayHandler(event) {
        setSelectedDate(event.target.value)
    }

    function deleteDate(event) {
        let deleteCollegeDays = [];
        let deleteDate = event.target.value;
        collegeDays.map(collegeDay => {
            if(collegeDay.theClass === class_id && collegeDay.date === deleteDate) {
                deleteCollegeDays.push(collegeDay.id)
            }
        })

        Promise.all(
            deleteCollegeDays.map(collegeDay => {
                axios.delete(BaseUrl+"collegeday_viewset/" + collegeDay + "/",
                    {headers:{
                    "Authorization": "Token "+token
                }})
            })
        )
            .then(response => {
                alert("The date is deleted");
                setChecker(checker + 1);
            })
            .catch(error=> {
                console.log(error);
                alert("Failed to add new date");
            });
    }

    return (
        <div>
            {hasToken?
                <React.Fragment>
                    {userGroup === "Student" ?
                        <React.Fragment>
                            <StudentClassAttendance class_id={class_id}/>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <h2>{location.state.class_number} Class Attendance</h2>
                            <div className={"row"}>
                                <div className="col-3  m-2">
                                    {userGroup === "Lecturer" ?
                                        <div className={"card"} style={{margin: 5}}>
                                            <input type="date" name="new_college_day" id={"newDate"} style={{margin: 5}}
                                                   defaultValue={defaultDate}/>
                                            <button className={"btn btn-success"} onClick={addNewDate}
                                                    style={{margin: 5}}>Create new Date
                                            </button>
                                        </div> :
                                        <p></p>}

                                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                                         style={{margin: 5}} name={"dateButton"}
                                         aria-orientation="vertical">

                                        <button className="btn btn-warning" style={{margin: 5}} id={"summary"}
                                                value={"summary"} onClick={selectDayHandler}>
                                            Summary
                                        </button>
                                        {classDates.map(classDate =>
                                            <button key={classDate} className=" btn btn-outline-primary"
                                                    style={{margin: 5}} id={classDate} name={"dateButton"}
                                                    value={classDate} onClick={selectDayHandler}>
                                                {classDate}
                                                <button className={"float-end btn btn-danger"} value={classDate}
                                                        onClick={deleteDate}>×
                                                </button>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="col-8 tab-content" id="v-pills-tabContent">
                                    <div className={"tab-pane fade show active"} id={"panel"}
                                         aria-labelledby={"v-pills-home-tab"}>
                                        <ClassAttendance state={{
                                            class_id: class_id,
                                            selected_date: selectedDate,
                                            total_day: classDates.length
                                        }}/>
                                    </div>
                                </div>

                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
            :
                <React.Fragment>
                    You don't have permission
                </React.Fragment>
            }
        </div>
    );
}

export default Attendance;