/* eslint-disable react/prop-types */
import { FaCircle } from "react-icons/fa";

function ProjectCard({ project, handleCardSelect }) {
  //   const getStatusColor = () => {
  //   switch (project.Status.toLowerCase()) {
  //     case 'in progress':
  //       return '#61FF00'; // Green
  //     case 'completed':
  //       return '#0075FF'; // Blue
  //     case 'on hold':
  //       return '#ff9800'; // Orange
  //     default:
  //       return '#888'; // Default Gray
  //   }
  // };

  return (
    <div className={`project-card`} onClick={() => handleCardSelect(project)}>
      <div className="project-card-header">
        <h3>{project.project_name}</h3>
        <p>Location: {project.location}</p>
      </div>
      <div className="project_card_footer">
        <p>
          Status: <span className={`status`}>{project.currentStatus}</span>
        </p>
        <FaCircle className="status-icon" style={{ color: "#61FF00" }} />
      </div>
    </div>
  );
}

export default ProjectCard;
