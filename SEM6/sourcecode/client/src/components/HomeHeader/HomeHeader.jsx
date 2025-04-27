import './HomeHeader.css';
import { useState } from 'react';
import { FaHome } from 'react-icons/fa'; 
import { IoLogOutSharp  } from 'react-icons/io5';
import { FaRegUserCircle } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Profile from '../../pages/Profile/Profile'
import Logo from '../../assets/Logo_png.png';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../../Context/UserContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function HomeHeader() {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {user,setUser} = UserState();
  const navigate = useNavigate();

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

    const handleHome = () => {
    navigate('/')
  }

  return (
    <header className="header-container">
      <div className="brand-container">
        <img src={Logo} alt="logo" className="logo" />
        <h1 className="brand-title" onClick={()=>(navigate('/'))}>MAPMYFOREST</h1>
      </div>
      <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/project" className="nav-link">Projects</a>
        <a href="/about" className="nav-link">About</a>
        <a href="/contact" className="nav-link">Contact</a>
      </nav>
      {user ? <div className="nav-icons">
        <IoLogOutSharp  className="icon" onClick={handleLogout}/>
        <FaHome className="icon" onClick={handleHome}/>
        <FaRegUserCircle className="profile-image" onClick={handleShow}/>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body><Profile /></Modal.Body>
      </Modal>
      </div>: null}
    </header>
  );
}

export default HomeHeader;
