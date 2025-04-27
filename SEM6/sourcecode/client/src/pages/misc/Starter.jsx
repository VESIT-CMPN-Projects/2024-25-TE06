/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useNavigate } from "react-router-dom";
import "./Starter.css";
import { UserState } from "../../Context/UserContext";
import { useEffect } from "react";
import MyLoader from "../../components/misc/MyLoader";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import axios from "axios";

function Starter() {
  const navigate = useNavigate();
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
  const [lat, lng] = selectedProject.location.split(",").map(Number);
  console.log(selectedProject);

  if (!selectedProject) {
    return (
      <div>
        <MyLoader />
      </div>
    );
  }

  const markProjectComplete = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/project/completedstatus",
        { project_id: selectedProject["_id"] },
        config
      );
      toast.success(response.data.message);
      navigate("/project");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Error hitting endpoint!");
    } finally {
      console.log("Done");
    }
  };

  return (
    <div className="starter-container">
      {/* <div className="project-starter-card">
        <h1 className="project-title">{selectedProject.project_name}</h1>
        <p>
          <strong>Creation Date:</strong> {selectedProject.created_at}
        </p>
        <p>
          <strong>Selected State:</strong> {selectedProject.location}
        </p>

        <div className="navigation-buttons">
          <Link to="/home/manage" className="manage-link">
            Manage Project
          </Link>
          <Link to="/home/analysis" className="analysis-link">
            Data Analysis
          </Link>
        </div>
        <div className="uploaded-images-section">
          <h2>Uploaded Images</h2>
          <div className="gallery-container">
            <div className="image-stack">
              {selectedProject.annotated_images.length > 0 ? (
                <>
                  {selectedProject.annotated_images.map((image, index) => (
                    <div className="image-wrapper" key={index}>
                      <img
                        src={image.image_url}
                        alt={`Uploaded ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button className="add-button" onClick={handleNavigate}>
                    <div className="plus-icon"></div>
                  </button>
                </>
              ) : (
                <p>No images uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div> */}
      <div className="auxiliary-report-information">
        <div className="info-map-wrapper">
          <div className="report-info">
            <div className="report-title">
              <div>{selectedProject.project_name}</div>
            </div>
            {/* <div className="total-count">Project Status: <span>{selectedProject.}</span></div> */}
            <div className="report-info-item">
              Total Tree Count:{" "}
              <span className="green">
                {selectedProject.annotated_images.reduce(
                  (sum, img) => sum + img.count,
                  0
                )}{" "}
                trees
              </span>
            </div>
            <div className="report-info-item">
              Jurisdiction: <span>{selectedProject.jurisdiction}</span>
            </div>
            <div className="report-info-item">
              Project Area:{" "}
              <span>
                {selectedProject.project_area
                  ? selectedProject.project_area
                  : "Not defined"}
              </span>
            </div>
            <div className="report-info-item">
              Project Intention:{" "}
              <span className="green">
                {selectedProject.project_intention &&
                  selectedProject.project_intention.charAt(0).toUpperCase() +
                    selectedProject.project_intention.slice(1)}
              </span>
            </div>
            <div className="report-info-item">
              Project Status:{" "}
              <span
                className={
                  selectedProject.currentStatus === "Completed"
                    ? "green"
                    : "red"
                }
              >
                {selectedProject.currentStatus}
              </span>
            </div>
            <div className="report-info-item">
              Custom Analysis Prompt:
              <br />
              <span>
                {selectedProject.custom_prompt && selectedProject.custom_prompt
                  ? selectedProject.custom_prompt
                  : "Not defined"}
              </span>
            </div>
            <div className="report-info-item">
              Creation Date:{" "}
              <span>{selectedProject.created_at.split("T")[0]}</span>
            </div>
          </div>
          <div className="report-map">
            <MapContainer center={[lat, lng]} zoom={10} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {lat && lng && (
                <Marker position={[lat, lng]}>
                  <Popup>
                    Latitude: {lat} <br /> Longitude: {lng}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
      <div className="project-actions">
        <div className="actions-title">Project Actions:</div>
        <div className="project-actions-container">
          <div className="project-action">
            <button onClick={markProjectComplete}>Mark as Completed</button>
          </div>
          <div className="project-action">
            <button onClick={() => navigate("/home/manage")}>
              Edit Project
            </button>
          </div>
          <div className="project-action">
            <button onClick={() => navigate("/home/view-images")}>
              View Images
            </button>
          </div>
          <div className="project-action">
            <button onClick={() => navigate("/home/analysis")}>
              Get Analytics
            </button>
          </div>
          <div className="project-action">
            <button onClick={() => navigate("/home/uploadimage")}>
              Add an Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Starter;
