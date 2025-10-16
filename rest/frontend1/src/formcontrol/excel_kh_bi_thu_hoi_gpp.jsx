/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext';
import {
    // ButtonGroup,
    Modal,
    Button,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Table,
    ListGroup
} from "react-bootstrap";
const Excel_kh_bi_thu_hoi_gpp = ( {history} ) => {

  const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);

  // const fetch_initial_data = async (manv) => {
  //   SetLoading(true)
    
  //   const response = await fetch(`https://bi.meraplion.com/local/get_all_pg_tables/`)
  //   if (!response.ok) {
  //       SetLoading(false)
  //   }
  //   else {
  //   const data = await response.json()
  //   setDbFiles(data['db_files'])
  //   console.log(data);
  //   SetLoading(false);

  //   }
  // }

  const [count, setCount] = useState(0);
  useEffect(() => {
      if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      // userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
      set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
      // fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
      } else {
          history.push(`/login?redirect=${location.pathname}`);
      };
  }, [count]);
  const [dbFiles, setDbFiles] = useState([
    // { name: "/app/thumuc/crm_hcp.db", last_modified: "2025-04-18 20:56:27" },
    // { name: "/app/thumuc/update_thu_hoi.db", last_modified: "2025-04-18 20:35:08" },
    // { name: "/app/thumuc/chi_phi_mkt_tp.db", last_modified: "2025-04-18 17:30:20" }
  ]);

  // Example table data (replace this with actual fetched data)
  const [dataTable, setDataTable] = useState([
    {
      'table_name': 'sales',
      'schema': {
        'col1': 'TEXT',
        'col2': 'FLOAT',
        'col3': 'TIMESTAMP'
      }
    },
    {
      'table_name': 'customer',
      'schema': {
        'id': 'FLOAT',
        'name': 'TEXT',
        'created_at': 'TIMESTAMP'
      }
    }
  ]);

  const [manv, set_manv] = useState("");
  // States for managing selected file, selected table, query, and result
  const [currentFile, setCurrentFile] = useState("");
  const [selectedTable, setSelectedTable] = useState({});
  const [sqlQuery, setSqlQuery] = useState("");
  const [excelUrl, setExcelUrl] = useState("");
  const [newDbFile, setNewDbFile] = useState({ name: "" });
  const [showDbFiles, setShowDbFiles] = useState(false);  // Toggle for .db files

  // States for modals
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [excelFileName, setExcelFileName] = useState("");
  const [tableName, setTableName] = useState("");
  const [schemaColumns, setSchemaColumns] = useState([]);  // Default type is TEXT
  const [excelFile, setExcelFile] = useState(""); // State to store the uploaded Excel file
  const [actionType, setActionType] = useState('create');
  // const [bq_table, set_bq_table] = useState("");
  // const [db_table, set_db_table] = useState("");
  // Handle SQL query input change
  const handleSqlChange = (e) => {
    setSqlQuery(e.target.value);
  };

  // Handle editing a file (set current file to edit

  // Handle Excel file change (when file is selected)
  const handleExcelFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setExcelFile(file);
      const formData = new FormData();
      formData.append("excelFile", file);

    } else {
      window.alert("Please upload a valid Excel file.");
    }
  };

  // Handle submitting Excel file, table name, and db file path
  const handle_submit = async (e) => {
    e.preventDefault();
    if (!excelFile ) {
      window.alert("Please fill in all fields.");
      return;
    }

    // Prepare the data to send to the backend
    const formData = new FormData();
    formData.append("excelFile", excelFile);
    formData.append("data", JSON.stringify({"manv": manv }) );
    try {
      const response = await fetch("https://bi.meraplion.com/local/sync_thu_hoi_gpp_to_dms/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        window.alert("Excel file and table name successfully submitted.");
      // ✅ Reset state
      setExcelFile(null);
      // setCount(count+1);

      } else {
        window.alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      window.alert("Error occurred while uploading the Excel file.");
    }
  };

  return (
    <div>
          <Form onSubmit={handle_submit} >
            <Form.Group controlId="formExcelFile">
              <Form.Label>Upload Excel File</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelFileChange}
              />
            </Form.Group>
          <Button disabled={ false } className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
          </Form>
    </div>
  );
};

export default Excel_kh_bi_thu_hoi_gpp;