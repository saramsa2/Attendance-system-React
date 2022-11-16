import logo from './logo.svg';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import SemesterList from "./components/SemesterList";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import CourseList from "./components/CourseList";
import StudentList from "./components/StudentList";
import LecturerList from "./components/LecturerList";
import ClassList from "./components/ClassList";
import AddSemester from "./components/AddSemester";
import SemesterDetail from "./components/SemesterDetail";
import AddCourse from "./components/AddCourse";
import CourseDetail from "./components/CourseDetail";
import LecturerDetail from "./components/LecturerDetail";
import StudentDetail from "./components/StudentDetail";
import ClassDetail from "./components/ClassDetail";
import SelectSemester from "./components/SelectSemester";
import SelectCourse from "./components/SelectCourse";
import SelectLecturer from "./components/SelectLecturer";
import SelectStudents from "./components/SelectStudents";
import AddClass from "./components/AddClass";
import Attendance from "./components/Attendance";
import SendEmail from "./components/sendEmail";

function AddStudent() {
  return null;
}

function StudentDetail_backup() {
  return null;
}

function App() {
  return (
    <div className="App">
        <Navigation />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="SemesterList" element={ <SemesterList /> } />
        <Route path="SemesterDetail" element={ <SemesterDetail />} />
        <Route path="ClassList" element={ <ClassList /> } />
        <Route path="CourseList" element={ <CourseList /> } />
        <Route path="StudentList" element={ <StudentList /> } />
        <Route path="LecturerList" element={ <LecturerList /> } />
        <Route path="Login" element={ <Login /> } />
        <Route path="CourseDetail" element={ <CourseDetail />} />
        <Route path="LecturerDetail" element={ <LecturerDetail />} />
        <Route path="StudentDetail" element={ <StudentDetail />} />
        <Route path="ClassDetail" element={ <ClassDetail />} />
        <Route path="Attendance" element={ <Attendance />} />
        <Route path="SendEmail" element={ <SendEmail />} />

      </Routes>
    </div>
  );
}

export default App;
