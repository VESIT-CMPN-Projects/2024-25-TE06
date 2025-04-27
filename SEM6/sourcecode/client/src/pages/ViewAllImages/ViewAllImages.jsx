import React, { useEffect, useMemo, useState } from "react";
import "./ViewAllImages.css";
import { toast } from "react-toastify";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";

const ViewAllImages = () => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
  const [imageData, setImageData] = useState([]);
  //   const [table, setTable] = useState();
  const columns = useMemo(
    () => [
      {
        accessorKey: "classifications", //simple recommended way to define a column
        accessorFn: (row) =>
          row.classifications &&
          Object.keys(row.classifications)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(", "),
        header: "Classifications",
        muiTableHeadCellProps: { style: { color: "green" } }, //custom props
        enableHiding: false, //disable a feature for this column
      },
      {
        accessorKey: "count", //simple recommended way to define a column
        header: "Count",
        muiTableHeadCellProps: {
          align: "center",
          style: { color: "green" },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        enableHiding: false, //disable a feature for this column
      },
      {
        accessorKey: "percentage", //simple recommended way to define a column
        header: "Percentage Cover(%)",
        muiTableHeadCellProps: {
          align: "center",
          style: { color: "green" },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "image", //simple recommended way to define a column
        header: "Image",
        Cell: ({ row }) => (
          // <a href={`data:image/png;base64,${row.original.url}`} target="_blank">
          <img
            className="table-image"
            src={`data:image/png;base64,${row.original.url}`}
            onClick={() => {
              // window.open(
              //   `data:image/png;base64,${row.original.url}`,
              //   "_blank"
              // );
              const win = window.open();
              win.document.write(
                `<iframe src="' + ${row.original.url} + '"  ><\/iframe>`
              );
            }}
          />
          // </a>
        ),
        muiTableHeadCellProps: { style: { color: "green" } }, //custom props
        enableHiding: false, //disable a feature for this column
      },
    ],
    []
  );

  const fetchProject = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/project/fetchproject",
        { project_id: selectedProject["_id"] },
        config
      );
      // console.log(response);
      console.log(response.data);
      setImageData(response.data.project_data.annotated_images);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Error loading project Analysis"
      );
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);
  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={imageData}
        enablePagination={true}
        enableSorting={true}
        enableGlobalFilter={true}
      />
    </div>
  );
};

export default ViewAllImages;
