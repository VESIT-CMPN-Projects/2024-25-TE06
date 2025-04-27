import AlternateSection from '../AlternateSection/AlternateSection';
import tree from "../../assets/illustration_1.png";
import drone from "../../assets/illustration_2.png";
import tech from "../../assets/illustration_3.png";

function FunctionContainer() {
  return (
    <div className="App">
      <AlternateSection 
        title="Create Project" 
        description="Easily start new tree enumeration projects by setting up locations, timelines, and objectives. Organize all your data in one place, making it simple to manage and track progress across multiple sites." 
        imageSrc={tree}
        reverse={false} 
      />
      <AlternateSection 
        title="Upload Aerial Media" 
        description="Enhance your projects with aerial photos and videos. Upload media files to get a bird’s-eye view of the terrain, helping you accurately map and analyze tree populations." 
        imageSrc={drone} 
        reverse={true} 
      />
      <AlternateSection 
        title="Manage Enumerations" 
        description="Keep your data organized and accessible. Efficiently manage your tree enumeration data, including species, sizes, and health status, to gain insights and make informed decisions" 
        imageSrc={tech}
        reverse={false} 
      />
    </div>
  );
}

export default FunctionContainer;
