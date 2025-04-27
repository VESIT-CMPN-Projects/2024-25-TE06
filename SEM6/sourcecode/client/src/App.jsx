import { Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import UploadImage from "./pages/LoadImage/UploadImage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./components/SideBar/SideBar";
import ProjectHeader from "./components/ProjectHeader/ProjectHeader";
import Projects from "./pages/Projects/Projects";
import Manage from "./pages/ManageProject/Manage";
import Analysis from "./pages/Analysis/Analysis";
import Error from "./pages/Error/Error";
import Starter from "./pages/misc/Starter";
import LoginSignup from "./pages/Auth/LoginSignup";
import ViewAllImages from "./pages/ViewAllImages/ViewAllImages";

function App() {
  const Layout = () => {
    return (
      <div className="MainContainer">
        <div className="MenuContainer">
          <SideBar />
        </div>
        <div className="contentMainContainer">
          <div className="ContentHeader">
            <ProjectHeader />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/home" element={<Layout />}>
          <Route path="/home/info" element={<Starter />} />
          <Route path="/home/manage" element={<Manage />} />
          <Route path="/home/view-images" element={<ViewAllImages />} />
          <Route path="/home/uploadimage" element={<UploadImage />} />
          <Route path="/home/analysis" element={<Analysis />} />
        </Route>
        <Route path="/*" element={<Error />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
