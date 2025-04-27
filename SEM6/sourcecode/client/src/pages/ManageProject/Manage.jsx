import { UserState } from '../../Context/UserContext';
import './Manage.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Form from "react-bootstrap/Form";
import intentions from "../../utils/intentions.json";
import { toast } from 'react-toastify';

function Manage() {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const { selectedProject } = UserState();
    const [selectedArea, setSelectedArea] = useState({
      amount: 0,
      unit: "hectares",
    });
  
  const [formData, setFormData] = useState({
    project_name: '',
    location: '',
    jurisdiction: '',
    created_at: '',
    currentStatus: '',
    project_area: `${selectedArea.amount} ${selectedArea.unit}`,
    project_intention: '',
    custom_prompt: '',
    tree_images: [],
    videoURL: '',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const project_id = selectedProject?._id;
    if (!project_id) return;

    const fetchProject = async () => {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      };
      try {
        const response = await axios.post('http://localhost:5000/api/v1/project/fetchproject', { project_id }, config);
        const projectData = response.data.project_data;

        setFormData({
          project_name: projectData.project_name,
          location: projectData.location,
          jurisdiction: projectData.jurisdiction,
          currentStatus: projectData.currentStatus,
          project_area: projectData.project_area,
          project_intention: projectData.project_intention || '',
          custom_prompt: projectData.custom_prompt,
          tree_images: projectData.tree_images || [],
          videoURL: projectData.videoURL || '',
          created_at: formatDate(projectData.created_at),
        });

        setSelectedArea({
          amount: projectData.project_area?.split(" ")[0] || 0,
          unit: projectData.project_area?.split(" ")[1] || 'hectares',
        });
      } catch (error) {
        console.error("Error fetching project data", error);
      }
    };

    fetchProject();
  }, [selectedProject]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, project_area: `${selectedArea.amount} ${selectedArea.unit}` });
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      };
      await axios.post('http://localhost:5000/api/v1/project/findoneprojectandupdate', formData, config);
      toast.success("Project details updated successfully");
    } catch (error) {
      console.error("Error updating project", error);
      toast.error("Failed to update project details, Try again later");
    }
  };

  return (
    <div className="new-project-container">
      <form onSubmit={handleSubmit} className="new-project-form">
        <h1>Manage Project</h1>

        <div className="form-group">
          <label>Project Name</label>
          <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Location (Latitude, Longitude)</label>
          <input type="text" name="location" value={formData.location} readOnly />
        </div>

        <div className="form-group">
          <label>Governing Authority</label>
          <input type="text" name="jurisdiction" value={formData.jurisdiction} readOnly />
        </div>

        <div className="form-group">
          <label>Project Area</label>
          <div className="size_input_wrapper">
            <input
              type="number"
              name="amount"
              value={selectedArea.amount}
                      onChange={(e) =>
                        setSelectedArea({
                          ...selectedArea,
                          amount: e.target.value,
                        })
                      }
            />
            <Form.Select
              name="unit"
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

        <div className="form-group">
          <label>Project Intention</label>
          <Form.Select
            name="project_intention"
            value={formData.project_intention}
            onChange={handleChange}
          >
            <option value="">Select Intention</option>
            {intentions.map((intention) => (
              <option key={intention.id} value={intention.key}>{intention.name}</option>
            ))}
          </Form.Select>
        </div>

        <div className="form-group">
          <label>Custom Prompt</label>
          <input type="text" name="custom_prompt" value={formData.custom_prompt} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Created At</label>
          <input type="date" name="created_at" value={formData.created_at} readOnly />
        </div>

        <button type="submit" className="submit-btn">Save & Continue</button>
      </form>
    </div>
  );
}

export default Manage;