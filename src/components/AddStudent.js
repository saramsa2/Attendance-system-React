import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {Dropdown} from "react-bootstrap";
import * as XLSX from "xlsx"


function AddStudent(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [myFile, setMyFile] = useState("");
    const [fileData, setFileData] = useState([]);

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            setHasToken(true);
        }
    },[token])

    function addStudent() {
        debugger
        if(hasToken){
            let login_token = token;
            axios.post(BaseUrl+"student_viewset/",
                {
                    user: {
                        username:document.getElementById("username").value,
                        password:document.getElementById("password").value,
                        first_name: document.getElementById("first_name").value,
                        last_name: document.getElementById("last_name").value,
                        email:document.getElementById("email").value
                    },
                    DOB:document.getElementById("dob").value,
                },
                {headers:{
                    "Authorization": "Token "+token
                }})
                .then(response => {
                    alert("New student is created");
                    props.parentCallback();
                    window.location.reload(false)
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to add new student");
                });
        }
    }

    function uploadFile() {
        if(myFile != "") {
            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(myFile);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, {type:"buffer"});
                    const wsName = wb.SheetNames[0];
                    const ws = wb.Sheets[wsName];
                    const data = XLSX.utils.sheet_to_json(ws);

                    resolve(data);
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
            });

            promise.then((data) => {
                setFileData(data);
            });
        }
    }

    useEffect(() => {

        if(fileData.length > 0) {
            Promise.all(
                fileData.map(student => {
                    // let date = new Date (student["DOB"]);
                    let day = ExcelDateToJSDate(student["DOB"]);
                    debugger
                    axios.post(BaseUrl + "student_viewset/",
                        {
                            user: {
                                username: student["Username"],
                                password: student["Username"],
                                first_name: student["First Name"],
                                last_name: student["Last Name"],
                                email: student["Email"]
                            },
                            DOB: day,
                        },
                        {
                            headers: {
                                "Authorization": "Token " + token
                            }
                        })
                })
            )
                .then(response => {
                    alert("New student is created");
                    props.parentCallback();
                    window.location.reload(false)
                })
                .catch(error=> {
                    console.log(error);
                    alert("Failed to add new student");
                });
        }

    }, [fileData]);

    function ExcelDateToJSDate(serial) {
        let utc_days  = Math.floor(serial - 25569);
        let utc_value = utc_days * 86400;
        let date_info = new Date(utc_value * 1000);

        // let fractional_day = serial - Math.floor(serial) + 0.0000001;
        //
        // let total_seconds = Math.floor(86400 * fractional_day);

        // let seconds = total_seconds % 60;

        // total_seconds -= seconds;

        // let hours = Math.floor(total_seconds / (60 * 60));
        // let minutes = Math.floor(total_seconds / 60) % 60;

        // return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
        return date_info.getFullYear() +"-"+ (date_info.getMonth()+1) +"-"+ date_info.getDate()
}

    function fileHandler(event) {
        setMyFile(event.target.files[0])
    }

    return (
        <div>
            {hasToken ?
                <React.Fragment>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width:"100%"}}><h3>New Student</h3></td>
                                    <td>
                                        <Dropdown autoClose="outside">
                                            <Dropdown.Toggle type="button" className="p-2 m-2 btn btn-primary" aria-haspopup="true">
                                                Upload from file
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <h4 className={"mb-0 text-center"}>Select an excel file</h4>
                                                <div className={"m-2"}>
                                                    <input type={"file"} className={"btn btn-primary"} onChange={fileHandler}/>
                                                </div>
                                                <div className={"m-2 float-sm-end"}>
                                                    <button className={"btn btn-primary "} onClick={uploadFile}>Upload</button>
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                    <div className={"table-responsive"}>
                        <table className={"table table-striped mb-0 card-body p-0 table-hover table-fixed"}>
                            <tbody>
                            <tr>
                                <th><p>Username</p></th>
                                <th><p>Password</p></th>
                                <th><p>First Name</p></th>
                                <th><p>Last Name</p></th>
                                <th><p>Email</p></th>
                                <th><p>Date of Birth</p></th>
                                <th></th>
                            </tr>
                            <tr>
                                <td><input type={"text"} id={"username"}/></td>
                                <td><input type={"password"} id={"password"}/></td>
                                <td><input type={"text"} id={"first_name"}/></td>
                                <td><input type={"text"} id={"last_name"}/></td>
                                <td><input type={"text"} id={"email"}/></td>
                                <td><input type={"date"} id={"dob"}/></td>
                                <td>
                                    <button className={"btn btn-info form-control text-reset"}
                                            onClick={addStudent}>Create
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                </React.Fragment>
            :
                <div>You don't have permission</div>
            }
        </div>
    );
}

export default AddStudent;