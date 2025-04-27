/* eslint-disable react/prop-types */
import './AlternateSection.css';
import GetStartedButton from '../GetStartedButton/GetStartedButton';

function AlternateSection ({ title, description, imageSrc, reverse }) {
  return (
    <div className={`section-container ${reverse ? 'reverse' : ''}`}>
      <div className="content">
        <h2 className="title">{title}</h2>
        <p className="description">{description}</p>
       
      </div>
      <div className="image-container">
        <img src={imageSrc} alt={title} className="image" />
      </div>
    </div>
  );
};

export default AlternateSection;
