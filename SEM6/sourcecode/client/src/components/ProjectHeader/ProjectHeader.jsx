import './ProjecHeader.css'
import { FaHome } from "react-icons/fa";
import { IoLogOutSharp  } from 'react-icons/io5';
import { FaRegUserCircle } from "react-icons/fa";
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Profile from '../../pages/Profile/Profile'
import { useNavigate } from 'react-router-dom';
import { UserState } from '../../Context/UserContext';
import { toast } from 'react-toastify';
import axios from 'axios';


function ProjectHeader() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const {setUser} = UserState();
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/project')
  }

  const handleLogout = async() => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/user/logout",{withCredentials: true});
      if(response.status === 200){
        localStorage.clear()
        toast.success(response.data.message);
        navigate('/');
        setUser()
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }
  return (
    <header className="projectheader-container">
      <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/project" className="nav-link">Projects</a>
        <a href="/about" className="nav-link">About</a>
        <a href="/contact" className="nav-link">Contact</a>
      </nav>
      <div className="nav-icons">
        <IoLogOutSharp  className="icon" onClick={handleLogout}/>
        <FaHome className="icon" onClick={handleHome}/>
        <FaRegUserCircle className="profile-image" onClick={handleShow}/>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body><Profile /></Modal.Body>
      </Modal>
      </div>
      </header>
  )
}

export default ProjectHeader