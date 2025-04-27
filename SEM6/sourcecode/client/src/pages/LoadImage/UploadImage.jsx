/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import "./upload.css";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

function UploadImage() {
  const [selectedName, setSelectedName] = useState("");
  const [ImageBase64, setImageBase64] = useState("");
  const [text, setText] = useState("# Hello world, we are good");
  const [selectedImages, setSelectedImages] = useState([]); // State for multiple images
  const [responseObjects, setResponseObjects] = useState([]); // {"annotated": base64, "count": int}
  const [detectionConf, setDetectionConf] = useState(0.15);
  const [detectionIOU, setDetectionIOU] = useState(0.5);
  const [detectionPatchSize, setDetectionPatchSize] = useState(10000);
  const [responseStatus, setResponseStatus] = useState("None");

  const handleImages = async (e) => {
    setResponseStatus("None");
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(
      files.map((file) =>
        convertToBase64(file).then((base64) => base64.split(",")[1])
      )
    );

    setSelectedImages(base64Images);
    setSelectedName(`${files.length} file(s) selected`);
  };

  const saveDataToProject = async (responseData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    console.log(responseData);
    const toSend = {
      project_id: JSON.parse(localStorage.getItem("selectedProject"))._id,
      annotated_data: JSON.stringify(responseData),
    };
    try {
      // const response = await fetch(
      //   "http://localhost:5000/api/v1/project/addannotatedimages",
      //   {
      //     method: "POST",
      //     body: JSON.stringify(toSend),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      const response = axios.post(
        "http://localhost:5000/api/v1/project/addannotatedimages",
        toSend,
        config
      );

      // const responseData = await response.json();
    } catch (error) {
      console.error(error.message);
      toast.error("Error saving to DB. Please try again later.");
    }
  };

  const handleSubmit = async () => {
    setResponseObjects([]);
    setResponseStatus("Wait");
    // console.log(detectionConf, detectionIOU);
    const endpoint = "http://localhost:5000/enumerate";
    try {
      let formData = new FormData();
      formData.append("imagesb64", JSON.stringify(selectedImages));
      formData.append("confidence", detectionConf);
      formData.append("iou", detectionIOU);
      formData.append("patch_size", detectionPatchSize);

      const toSend = {
        images: JSON.stringify(selectedImages),
        confidence: detectionConf,
        iou: detectionIOU,
        patch_size: detectionPatchSize,
      };

      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      };

      // const response = await fetch(endpoint, {
      //   method: "POST",
      //   body: ,
      //   headers: {
      //     "Access-Control-Allow-Origin": "*",
      //     "Access-Control-Allow-Headers": "*",
      //   },
      // });

      const response = await axios.post(endpoint, toSend, config);

      const responseData = await response.data;
      console.log(response);
      // Extract response images and tree counts
      // const newResponseImages = responseData.map((res) => res["annotated"]);
      // const newResponseCounts = responseData.map((res) => res["count"]);

      setResponseObjects(responseData);
      // setResponseCounts(newResponseCounts);
      setResponseStatus("Done");
      saveDataToProject(responseData);
    } catch (error) {
      setResponseStatus("None");
      console.error(error.message);
      toast.error("An error has occurred. Please try again later.");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      <section className="uploadImageSection">
        <div className="uploadImageSectionParent">
          <div className="uploadImageSectionFileUpload">
            <MdOutlineFileUpload size={50} />
            <h3 className="dynamic-message">
              {selectedName || "Browse any file here"}
            </h3>
            <p>Maximum file size 10MB</p>
            <input
              type="file"
              className="default-file-input"
              onChange={handleImages}
              multiple
            />
          </div>
        </div>
        {/* <div className="upload-section-detection-sliders">
          <p>Confidence: {detectionConf}</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="0.15"
            className="slider"
            id="detection-conf"
            onChange={(e) => setDetectionConf(e.target.value)}
          />
          <br />
          <p>Intersection over Union: {detectionIOU}</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="0.5"
            className="slider"
            id="detection-iou"
            onChange={(e) => setDetectionIOU(e.target.value)}
          />
        </div> */}
        <div className="uploadImageSectionFileSubmitButton">
          <button
            className="uploadImageSectionSubmitButton"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {/* {responseStatus === "None" && (
          <div className="UploadSection_Analysis_Output_MarkDown">
            <ReactMarkdown>{`#### Add Images to get started.`}</ReactMarkdown>
          </div>
        )} */}
        {responseStatus === "Wait" && (
          <div className="UploadSection_Analysis_Output_MarkDown">
            <ReactMarkdown>{`### Computing... Please Wait...`}</ReactMarkdown>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {responseStatus === "Done" && responseObjects.length > 0 && (
          <div className="UploadSection_Analysis_Output_MarkDown">
            <ReactMarkdown>{`## **Tree Enumeration Results:**`}</ReactMarkdown>
            <div className="upload-section-analysis-output-images">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="upload-section-analysis-output-object"
                >
                  <ReactMarkdown
                    children={`## Image ${index + 1} \n #### Count : **${
                      responseObjects[index]["count"]
                    }** trees \n #### Area Covered: **${
                      responseObjects[index]["percentage"]
                    }%** \n #### Possible Tree Species: **${Object.keys(
                      responseObjects[index]["classifications"]
                    )}**`}
                  />
                  <div className="output-image-wrappers">
                    <img
                      src={"data:image/jpg;base64," + image}
                      alt={`uploaded-image-${index}`}
                    />
                    <img
                      src={
                        "data:image/jpg;base64," + responseObjects[index]["url"]
                      }
                      alt={`annotated-image-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default UploadImage;
