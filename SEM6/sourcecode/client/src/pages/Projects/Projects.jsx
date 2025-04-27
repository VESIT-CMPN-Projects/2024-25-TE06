import { useState, useEffect } from "react";
import "./Projects.css";
import ProjectCard from "../../components/misc/ProjectCard";
import { IoMdAdd } from "react-icons/io";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import Footer from "../../components/Footer/Footer";
import MyLoader from "../../components/misc/MyLoader";
import { toast } from "react-toastify";
import axios from "axios";
import { UserState } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import states from "../../utils/states.json";
import intentions from "../../utils/intentions.json";
import Form from "react-bootstrap/Form";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

function ClickMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

function Projects() {
  const [projects, setProjects] = useState([]); // State for projects array
  const [ProjectName, setProjectName] = useState("");
  const [MoreProjects, setMoreProjects] = useState(false);
  const [loading, setLoading] = useState(false);
  //modal handling
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [project_name, setProjectname] = useState("");
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState({ lat: 23, lng: 80 });
  const [selectedState, setSelectedState] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIntention, setSelectedIntention] = useState("deforestation");
  const [selectedArea, setSelectedArea] = useState({
    amount: 0,
    unit: "hectares",
  });
  const [customPrompt, setCustomPrompt] = useState("");
  // const [selectedLocation, setSelectedLocation] = useState("");

  const { user, setSelectedProject } = UserState();
  const navigate = useNavigate();
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("MapMyForestUser"));
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const loadProjects = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/project/accessallproject",
        config
      );
      setProjects(response.data.project_group || []);
      console.log(response.data.project_group);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const projectsToShow = MoreProjects ? projects : projects.slice(0, 4);

  const handleCardSelect = (project) => {
    setSelectedProject(project);
    var temp = project;
    temp.annotated_images = project.annotated_images.map(
      ({ url, ...rest }) => rest
    );
    localStorage.setItem("selectedProject", JSON.stringify(temp));
    navigate("/home/info");
  };

  const newProjectCreation = async () => {
    const jurisdiction = `${selectedLocation}, ${selectedState}`;
    const landArea = `${selectedArea.amount} ${selectedArea.unit}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    try {
      setLoading(true);
      const locationFormatted = `${location.lat}, ${location.lng}`;
      const response = await axios.post(
        "http://localhost:5000/api/v1/project/createproject",
        {
          project_name,
          location: locationFormatted,
          jurisdiction,
          project_area: landArea,
          project_intention: selectedIntention,
          custom_prompt: customPrompt,
        },
        config
      );
      setSelectedProject(response.data.project);
      localStorage.setItem(
        "selectedProject",
        JSON.stringify(response.data.project)
      );
      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Error Creating projects");
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    const selectedStateObj = states.find((state) => state.name === stateId);
    setLocations(selectedStateObj?.GoverningBodies || []);
    setSelectedLocation(""); // Reset location on state change
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const position = [51.505, -0.09];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  return (
    <>
      <HomeHeader />
      <section className="ProjectSection">
        <div className="TopProjectDiv">
          <h3>Projects</h3>
          <div className="search-wrapper">
            <input
              placeholder="Search For Project"
              value={ProjectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        </div>
        <div className="LoadingDiv">
          <h6>Recent</h6>
          <p onClick={() => setMoreProjects(!MoreProjects)}>
            {MoreProjects ? "See Less" : "See More"}
          </p>
        </div>

        {loading ? (
          <MyLoader />
        ) : (
          <>
            <div className="projects-grid">
              {projectsToShow.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  handleCardSelect={handleCardSelect}
                />
              ))}
            </div>
            <MapContainer
              center={[23, 80]}
              zoom={5}
              scrollWheelZoom={true}
              style={{
                height: "400px",
                width: "85%",
                margin: "auto",
                borderRadius: "25px",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {projects.map((project) => (
                <Marker
                  key={project._id}
                  position={project.location.split(",").map(Number)}
                >
                  <Popup>
                    <div className="MapContainer">
                      <h4>{project.project_name}</h4>
                      <p>
                        Created on:{" "}
                        {new Date(project.created_at).toDateString()}
                      </p>
                      <button onClick={() => handleCardSelect(project)}>
                        View Project
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </>
        )}
        <div className="actions_button_div">
          <button className="create-btn" onClick={handleShow}>
            <IoMdAdd className="action_button_icons" />
            Create New Project
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="Create_project_box">
                <div className="input_project_div">
                  <label htmlFor="">Project Name</label>
                  <input
                    type="text"
                    id="project_name"
                    value={project_name}
                    onChange={(e) => setProjectname(e.target.value)}
                    placeholder="Enter your project name"
                  />
                </div>
                <div className="input_project_div">
                  <label htmlFor="">Location (latitude, longitude)</label>
                  <input
                    type="text"
                    id="project_name"
                    value={`${location.lat}, ${location.lng}`}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="16.4, 72.1"
                  />
                  <div className="input_project_map_wrapper">
                    <MapContainer
                      center={[23, 80]}
                      zoom={5}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ClickMarker setPosition={setLocation} />
                      {location && (
                        <Marker position={location}>
                          <Popup>
                            Latitude: {position.lat} <br /> Longitude:{" "}
                            {position.lng}
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                </div>
                <div className="input_project_div">
                  <label htmlFor="state">State</label>
                  <Form.Select
                    id="state"
                    value={selectedState}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="input_project_div">
                  <label htmlFor="location">Governing Body</label>
                  <Form.Select
                    id="location"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    disabled={!selectedState}
                  >
                    <option value="">Select Government Body</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="input_project_div">
                  <label htmlFor="intention">Project Intention</label>
                  <Form.Select
                    id="intention"
                    value={selectedIntention}
                    onChange={(e) => setSelectedIntention(e.target.value)}
                  >
                    <option value="">Select Intention</option>
                    {intentions.map((intention) => (
                      <option key={intention.id} value={intention.key}>
                        {intention.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="input_project_div">
                  <label htmlFor="project_size">Approximate Project Area</label>
                  <div className="size_input_wrapper">
                    <input
                      type="number"
                      value={selectedArea.amount}
                      onChange={(e) =>
                        setSelectedArea({
                          ...selectedArea,
                          amount: e.target.value,
                        })
                      }
                    />

                    <Form.Select
                      value={selectedArea.unit}
                      onChange={(e) =>
                        setSelectedArea({
                          ...selectedArea,
                          unit: e.target.value,
                        })
                      }
                    >
                      <option value="hectares">Hectares</option>
                      <option value="acres">Acres</option>
                      <option value="sq_km">Square Kilometers</option>
                      <option value="sq_miles">Square Miles</option>
                    </Form.Select>
                  </div>
                </div>
                <div className="input_project_div">
                  <label htmlFor="custom_prompt">
                    Anything specific you aim to do?
                  </label>
                  <textarea
                    type="text"
                    id="custom_prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="I want an emphasis on how I can protect the biodiversity of my land."
                    rows={7}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={newProjectCreation}>
                {loading ? <Spinner animation="grow" /> : "Create Project"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Projects;
