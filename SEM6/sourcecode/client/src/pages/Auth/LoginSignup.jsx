import { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SignIn from "../../components/Auth/SignIn";
import SignUp from "../../components/Auth/SignUp";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import tree from "../../assets/illustration_1.png";
import Logo from '../../assets/Logo_png.png';

function LoginSignup() {
  const [key, setKey] = useState("login");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("MapMyForestUser"));
    if (user) navigate("/project");
  }, [navigate]);

  return (
    <>
    <header className="header-container">
      <div className="brand-container">
        <img src={Logo} alt="logo" className="logo" />
        <h1 className="brand-title">MAPMYFOREST</h1>
      </div>
    </header>
    <section className="login-signup-page">
      <div className="login-signup-image">
        <img src={tree} alt="Forest illustration" />
      </div>

      <div className="login-signup-form-container">
        <h2>{key === "login" ? "Login" : "Sign Up"}</h2>
        <Tabs
          id="login-signup-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          fill
        >
          <Tab eventKey="login" title="Login">
            <SignIn />
          </Tab>
          <Tab eventKey="signup" title="SignUp">
            <SignUp />
          </Tab>
        </Tabs>
      </div>
    </section>
    </>
    
  );
}

export default LoginSignup;
