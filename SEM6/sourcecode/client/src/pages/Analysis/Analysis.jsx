import "./Analysis.css";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { UserState } from "../../Context/UserContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import MyLoader from "../../components/misc/MyLoader";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useReactToPrint } from "react-to-print";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import React from "react";
import Plot from "react-plotly.js";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";

function Analysis() {
  //   const markdown = `
  // # Tree Enumeration Analysis 🌳📊

  // ### A Deep Dive into the Key Metrics of Our Platform

  // Tree enumeration plays a crucial role in understanding the state of our environment. By counting, categorizing, and analyzing trees, we can provide important insights on biodiversity, carbon sequestration, and forest health. This dashboard gives you a snapshot of the key statistics from our latest enumeration efforts.

  // ![Forest Overview](https://raw.githubusercontent.com/vipulchaturvedi/treesense-imaging/refs/heads/main/screenshots/tree_count.png)

  // ---

  // ## 🌲 Total Trees Counted: **10,245**

  // Our platform has successfully enumerated over 10,000 trees across various regions. This comprehensive count provides a baseline for understanding the growth, distribution, and health of forests in different areas.

  // ![Trees Counted Graph](https://www.researchgate.net/profile/Malcolm-North-2/publication/45513775/figure/fig3/AS:306089284390933@1449988780757/A-graph-of-the-number-of-trees-established-each-year-between-1760-and-1920-by-species.png)

  // ---

  // ## 📏 Average Tree Height: **8.2 meters**

  // The average height of the trees recorded is 8.2 meters, reflecting a healthy, mature population across surveyed regions. Taller trees are often an indication of healthy forest ecosystems.

  // ![Tree Height Distribution](https://via.placeholder.com/600x300.png?text=Tree+Height+Distribution)

  // ---

  // ## 🌍 Carbon Absorption Rate: **12,000 kg CO2**

  // One of the key benefits of a healthy tree population is carbon sequestration. Our enumeration data shows that these trees absorb approximately **12,000 kg** of carbon dioxide annually, contributing significantly to climate mitigation efforts.

  // ---

  // ## 📈 Growth Rate Over Time

  // Below is a sample graph representing the growth rate of trees in the last five years. The chart illustrates how new saplings have grown into mature trees, steadily increasing the total tree count and height over time.

  // ![Tree Growth Graph](https://8billiontrees.com/wp-content/uploads/2023/02/Basswood-Tree-Growth-Charts.png)

  // ---

  // ## 🌿 Tree Species Breakdown

  // Our analysis also reveals the diversity of tree species in the regions surveyed. The pie chart below represents the percentage distribution of major tree species, with **Oak** and **Pine** making up the largest portions.

  // ![Species Breakdown Pie Chart](https://www.frontiersin.org/files/Articles/1136289/frsen-04-1136289-HTML/image_m/frsen-04-1136289-g002.jpg)

  // ---

  // ## 🚧 Solutions to Avoid Tree Cutting and Promote Conservation 🌳🚫

  // One of the key concerns in forestry management is minimizing unnecessary tree cutting while encouraging conservation and sustainable forestry practices. Here are some potential solutions:

  // ### 1. **Sustainable Forestry Practices**

  // - **Selective Logging**: Encourage selective logging practices where only certain trees are cut, based on their maturity and ecological value. This avoids large-scale deforestation and allows forests to regenerate naturally.

  // - **Replanting Initiatives**: Mandate replanting programs for every tree that is cut down, ensuring that forest areas remain productive and sustainable.

  // \`\`\`javascript
  // const plantNewTrees = (cutDownCount) => {
  //   const replantingRatio = 3; // Replant 3 trees for each one cut down
  //   return cutDownCount * replantingRatio;
  // };
  // console.log(plantNewTrees(100)); // Outputs 300 new trees to plant
  // \`\`\`

  // ---

  // ### 2. **Remote Sensing for Monitoring Illegal Logging**

  // Using satellite imagery and drones, the platform can detect unauthorized logging activities in real-time. Combining this with machine learning algorithms will enable the detection of illegal tree felling and provide immediate alerts to local authorities.

  // - **Solution**: Integrate AI-powered tools for continuous monitoring.
  // - **Outcome**: Timely interventions to prevent unauthorized logging and safeguard forests.

  // ### 3. **Carbon Credit Programs for Forest Preservation**

  // Introduce carbon credit programs where individuals or companies can buy credits to support forest conservation projects. These programs incentivize landowners and governments to keep forests intact by rewarding them financially for not cutting down trees.

  // - **Solution**: Allow users of the platform to calculate the carbon offset from conserving a given number of trees.
  // - **Outcome**: Provide economic incentives to avoid tree cutting and preserve ecosystems.

  // ---

  // ### 4. **Community-Based Conservation Efforts**

  // Empowering local communities to become custodians of forests can lead to more sustainable conservation practices:

  // - **Education Programs**: Educate communities about the long-term environmental and economic benefits of forest conservation.
  // - **Alternative Livelihoods**: Provide alternative livelihood options, such as eco-tourism or agroforestry, to reduce the economic dependence on tree-cutting activities.

  // ---

  // ### 5. **Policy Advocacy and Legal Frameworks**

  // Work with governments and policymakers to strengthen laws that limit tree cutting, particularly in sensitive areas like rainforests or biodiversity hotspots. The platform can provide data that demonstrates the ecological value of forested areas, making a stronger case for conservation.

  // - **Protected Zones**: Create legally protected zones where tree cutting is entirely prohibited.
  // - **Green Taxes**: Implement taxes on industries that excessively cut down trees, encouraging them to explore sustainable alternatives.

  // ---

  // ## 📊 Conclusion

  // This dashboard provides an overview of the key metrics from our tree enumeration project, and we have outlined several ways to reduce tree cutting and promote forest conservation. Implementing sustainable forestry practices, leveraging technology for monitoring, and involving communities in conservation efforts are essential strategies.

  // Our goal is to ensure forests remain healthy, diverse, and intact for future generations while balancing human needs and economic activities.

  // Together, we can make a significant impact in protecting our natural resources and curbing deforestation.
  // `;

  const [markdown, setMarkDown] = useState("");
  const analysisRef = useRef();

  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
  const [lat, lng] = selectedProject.location.split(",").map(Number);
  console.log(lat, lng);

  const totalClassifications = {};

  selectedProject.annotated_images.forEach((item) => {
    const classes = item.classifications;
    var counter = 0;
    for (const key in classes) {
      totalClassifications[key] =
        (totalClassifications[key] || 0) + classes[key];
    }
  });

  function PlotlyChart({ data, layout }) {
    return (
      <Plot
        data={JSON.parse(data)}
        layout={JSON.parse(layout)}
        style={{ width: "100%", height: "400px" }}
      />
    );
  }

  const treeColorMapping = {
    amla: "#8BC34A", // Light green
    asopalav: "#4CAF50", // Green
    babul: "#795548", // Brown
    bamboo: "#A5D6A7", // Light mint green
    banyan: "#2E7D32", // Dark green
    bili: "#F9A825", // Amber
    cactus: "#66BB6A", // Light green
    champa: "#FFEB3B", // Yellow
    coconut: "#8D6E63", // Brown
    garmalo: "#9CCC65", // Light green
    gulmohor: "#F44336", // Red
    gunda: "#81C784", // Medium green
    jamun: "#673AB7", // Deep purple
    kanchan: "#FFC107", // Amber
    kesudo: "#FF9800", // Orange
    khajur: "#A1887F", // Brown
    mango: "#FBC02D", // Yellow
    motichanoti: "#7CB342", // Light green
    neem: "#388E3C", // Green
    nilgiri: "#26A69A", // Teal
    other: "#9E9E9E", // Grey
    pilikaren: "#CDDC39", // Lime
    pipal: "#33691E", // Dark green
    saptaparni: "#558B2F", // Light green
    shirish: "#C8E6C9", // Very light green
    simlo: "#8BC34A", // Light green
    sitafal: "#AED581", // Light green
    sonmahor: "#FFD54F", // Amber light
    sugarcane: "#DCE775", // Lime light
    vad: "#1B5E20", // Very dark green
  };

  const getSpeciesColor = (species) => {
    return treeColorMapping[species.toLowerCase()] || "#9E9E9E"; // Default to grey if species not found
  };

  const [pieChartSchema, setPieChartSchema] = useState({
    labels: Object.keys(totalClassifications).map((data) => data),
    datasets: [
      {
        label: "Trees",
        data: Object.values(totalClassifications).map((data) => data),
        backgroundColor: Object.keys(totalClassifications).map((species) =>
          getSpeciesColor(species)
        ),
        borderColor: "lightslategray",
        borderWidth: 1,
      },
    ],
  });

  console.log(totalClassifications);

  const handleDownloadPdf = useReactToPrint({
    contentRef: analysisRef,
    documentTitle: `MapMyForest Analysis - ${selectedProject.project_name}`,

    removeAfterPrint: true,

    // onBeforePrint: () => console.log("Printing"),
  });

  const fetchAnalysis = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/project/fetchAnalysis",
        { project_id: selectedProject["_id"] },
        config
      );
      console.log(response);
      setMarkDown(response.data.analysis_json.analysis || "# No data loaded");
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Error loading project Analysis"
      );
    }
  };

  useEffect(() => {
    fetchAnalysis();
    console.log(selectedProject.annotated_images);
  }, []);

  const numColumns = 3; // Define number of columns
  let zData = [];
  for (
    let i = 0;
    i < selectedProject.annotated_images.length;
    i += numColumns
  ) {
    zData.push(
      selectedProject.annotated_images
        .slice(i, i + numColumns)
        .map((img) => img.count)
    );
  }

  return (
    <>
      <div ref={analysisRef} className="analysis-container printable-content">
        <div className="auxiliary-report-information">
          <div className="report-title">
            <div>
              Detailed Report for <span>{selectedProject.project_name}</span>
            </div>
            <button
              onClick={handleDownloadPdf}
              className="download-report-button"
            >
              Download as PDF
            </button>
          </div>
          <div className="info-map-wrapper">
            <div className="report-info">
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
                Project Area: <span>{selectedProject.project_area}</span>
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
            </div>
            <div className="report-map">
              <MapContainer
                center={[lat, lng]}
                zoom={10}
                scrollWheelZoom={true}
              >
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
        <div className="analysis-charts">
          <DoughnutChart
            chartData={pieChartSchema}
            title={"Tree Classifications"}
            className="classification-chart"
          />

          <Plot
            className="density-chart"
            data={[
              {
                z: zData,
                type: "heatmap",
                colorscale: "Greens",
                colorbar: {
                  title: "Tree Count",
                  // tickvals: [0, 100], // Set the ticks to range from 0 to maxValue
                  // ticktext: ["0", "100"], // Labels for ticks
                },
                reversescale: true,
                zmin: 0,
              },
            ]}
            layout={{
              title: "Tree Count Heatmap per Image",
              autosize: true,
              padding: 0,
            }}
          />
        </div>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            div: (props) => {
              if (props["data-plotly"]) {
                console.log("data-plotly", props["data-plotly"]);
                const { data, layout } = JSON.parse(props["data-plotly"]);
                console.log(data, "\n", layout);
                const { width, height, ...cleanedLayout } = layout;
                const extendedLayout = {
                  ...cleanedLayout,
                  autosize: true,
                  padding: 0,
                  // width: "80vw",
                  // height: "100px",
                };
                return (
                  <div className="inline-chart-wrapper">
                    <Plot
                      className="inline-analysis-chart"
                      data={data}
                      layout={extendedLayout}
                      style={{
                        // width: "100%",
                        // height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      config={{ responsive: true }}
                    />
                  </div>
                );
              }
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </>
  );
}

export default Analysis;
