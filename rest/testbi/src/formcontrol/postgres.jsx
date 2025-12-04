/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
// import './myvnp.css';
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
import { useNavigate } from "react-router-dom";

const Postgres = () => {
    const navigate = useNavigate();

  const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);

  const fetch_initial_data = async (manv) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/get_all_pg_tables/`)
    if (!response.ok) {
        SetLoading(false)
    }
    else {
    const data = await response.json()
    setDbFiles(data['db_files'])
    console.log(data);
    SetLoading(false);

    }
  }

  const [count, setCount] = useState(0);
  useEffect(() => {
      if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      // userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
      // set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
      fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
      } else {
          navigate(`/login?redirect=${location.pathname}`);
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

  // Handle editing a file (set current file to edit)
  const handleEdit = async (table) => {
    console.log("dataTable", table)
    setCurrentFile(table);
    setSqlQuery(""); // Reset SQL query input
    setSelectedTable(""); // Reset the selected table
    setExcelUrl(""); // Reset the excel URL

    try {
      // Send POST request with file_path:filename to get tables and schema
      const response = await fetch("https://bi.meraplion.com/local/get_pg_tables_and_schemas/", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_path: table.name
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data);
        setDataTable(data.tabledata);
        setSelectedTable(data.tabledata[0]);
      } else {
        console.error("Error fetching tables and schema.");
        window.alert("Failed to fetch tables and schema.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      window.alert("An error occurred while fetching the file details.");
    }

        // Focus on the Tables section when a file is selected using the id
        const tablesHeading = document.getElementById("tables-heading");
        if (tablesHeading) {
          tablesHeading.scrollIntoView({ behavior: 'smooth' });
        }
  };

  // Handle selecting a table
  const handleTableSelect = (table) => {
    console.log("handleTableSelect", table)
    setSelectedTable(table);
  };

  // Handle running the SQL query
  const handleRunQuery = async () => {
    if (!sqlQuery) {
      window.alert("Please enter an SQL query.");
      return;
    }
    setExcelUrl("")
    SetLoading(true); // Set loading to true before sending the request

    // Send the SQL query to the backend (this is just an example)
    try {
      const response = await fetch("https://bi.meraplion.com/local/get_pg_query_result/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: get_id(),
          query: sqlQuery,
          file_path: currentFile.name,
          // bq_table: bq_table,
          // db_table: db_table
        })
      });

      const data = await response.json();

      if (response.ok) {
        setExcelUrl(data.excel_url);
        window.alert("Thành công !!!");
        setCount(count+1);
      } else {
        window.alert(data.error_message);
      }
    } catch (error) {
      console.error("Error running query:", error);
      window.alert(error);
    }

    finally {
      SetLoading(false); // Ensure loading is turned off regardless of success or failure
    }

    // SetLoading(false);
  };

  // Handle adding a new .db file
  // const handleAddDbFile = () => {
  //   if (!newDbFile.name) {
  //     window.alert("Please provide a valid .db file name.");
  //     return;
  //   }
  //   const newFile = { name: newDbFile.name, last_modified: new Date().toISOString() };
  //   setDbFiles([...dbFiles, newFile]);
  //   setNewDbFile({ name: "" });
  // };

  // Toggle visibility of the .db files table
  // const toggleDbFilesVisibility = () => {
  //   setShowDbFiles(!showDbFiles);
  // };

  // Modal for adding Excel file and table name
  const handleExcelModalClose = () => setShowExcelModal(false);
  const handleExcelModalShow = () => setShowExcelModal(true);

  // Handle Excel file change (when file is selected)
  const handleExcelFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setExcelFile(file);
      const formData = new FormData();
      formData.append("tablename", tableName);
      formData.append("excelFile", file);

    try {
      const response = await fetch("https://bi.meraplion.com/local/check_excel_pg/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setSchemaColumns(data['column_info'])
      } else {
        window.alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      window.alert("Error occurred while uploading the Excel file.");
    }

    } else {
      window.alert("Please upload a valid Excel file.");
    }
  };

  // Handle submitting Excel file, table name, and db file path
  const handleExcelSubmit = async () => {
    if (!excelFile || !tableName ) {
      window.alert("Please fill in all fields.");
      return;
    }

    // Prepare the data to send to the backend
    const formData = new FormData();
    formData.append("excelFile", excelFile);
    formData.append("tablename", tableName);
    formData.append("actiontype", actionType);
    formData.append("schema", JSON.stringify(schemaColumns));
    try {
      const response = await fetch("https://bi.meraplion.com/local/create_table_pg/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        window.alert("Excel file and table name successfully submitted.");
      // ✅ Reset state
      setExcelFile(null);
      setTableName('');
      setSchemaColumns([]);
      setCount(count+1);

      } else {
        window.alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      window.alert("Error occurred while uploading the Excel file.");
    }

    handleExcelModalClose(); // Close the modal after submission
  };

  // Modal for adding schema manually
  const handleSchemaModalClose = () => setShowSchemaModal(false);
  const handleSchemaModalShow = () => setShowSchemaModal(true);

  const handleAddSchema = async () => {
    console.log("Schema Columns:", schemaColumns);
  
    // Prepare data to send to backend
    const schemaData = {
      file_path: currentFile.name,
      table_name: tableName,  // Add the table name to the data
      columns: schemaColumns.map((col) => ({
        column_name: col.columnName,
        data_type: col.dataType,
        is_primary_key: col.isPrimaryKey
      }))
    };
  
    try {
      // Send POST request to backend to create table
      const response = await fetch("https://bi.meraplion.com/local/create_table_manually/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schemaData),
      });
  
      // Check if the response status is OK
      if (!response.ok) {
        // If response is not ok, throw an error (this will be caught in the catch block)
        throw new Error(`Backend returned status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      
      // Check if the backend response indicates success
      if (data.success) {
        console.log("Table created successfully:", data);
        // alert("Table created successfully.");
      } else {
        console.error("Error in backend response:", data.message);
        // alert(`Error: ${data.message}`);
      }
  
    } catch (error) {
      // This block will only be triggered if there is an issue with the network or response
      console.error("Error sending data to backend:", error);
      // alert("An error occurred while sending data to the backend.");
    }
  
    // Close the schema modal after submitting
    setShowSchemaModal(false); // Hide modal
  };
  

  const handleSchemaChange = (index, field, value) => {
    const newColumns = [...schemaColumns];
    newColumns[index][field] = value;
    setSchemaColumns(newColumns);
  };

  const handleAddColumn = () => {
    setSchemaColumns([...schemaColumns, { columnName: "", dataType: "FLOAT", isPrimaryKey: false }]);
  };

  const handleRemoveColumn = (index) => {
    const newColumns = schemaColumns.filter((_, i) => i !== index);
    setSchemaColumns(newColumns);
  };

  return (
    <div>
      {/* Button to toggle visibility of the .db files table */}
      {/* <Button variant="primary" onClick={toggleDbFilesVisibility} className="mt-3">
        {showDbFiles ? "Hide Tables" : "Show Tables"}
      </Button> */}

 {/* Row with two columns: Left for .db Files Table, Right for Add .db File Form */}
 <Row className="mt-4">
        <Col md={6}>
          {/* .db Files Table */}
            <>
              <h4>Available Tables</h4>
              <Table striped bordered hover className="compact-table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbFiles.map((table, index) => (
                    <tr key={index}>
                      <td>{table.name}</td>
                      <td>
                      <Button variant="info" size="sm" onClick={() => handleEdit(table)}>
                          Show Schema
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
        </Col>

        <Col md={6}>
          {/* Enter New .db File Path Part */}
          <h4>Upload new excel file</h4>
          
            <Button variant="outline-secondary" size="sm" onClick={handleExcelModalShow} className="mt-2">
            + Add Excel File and Table
            </Button>

            <h4>SQL Query </h4>
            <Form>
              <Form.Group controlId="formSqlQuery">
                <Form.Control
                  style={{ height: '300px' }}
                  as="textarea"
                  rows={5}
                  value={sqlQuery}
                  onChange={handleSqlChange}
                  placeholder="Enter your SQL query here"
                />
              </Form.Group>
            <div className="d-flex align-items-center mt-3">
              <Button variant="success" onClick={handleRunQuery} disabled={loading}>
                Run Query
              </Button>
            </div>
            </Form>

            {excelUrl && (
              <div className="mt-3">
                <h5>Excel File Available:</h5>
                <a href={excelUrl} target="_blank" rel="noopener noreferrer">
                  {excelUrl}
                </a>
              </div>
            )}

        </Col>
      </Row>

      {/* Left Section: Tables and Schema Modals */}
      {currentFile && (
        <Row className="mt-4">
          <Col md={6}>
            {/* <h4 id="tables-heading" >Tables in {currentFile.name}</h4> */}
            <ListGroup>
              {dataTable.map((table, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => handleTableSelect(table)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedTable === table ? "#e0f7fa" : "white"
                  }}
                >
                  {table.table_name}
                </ListGroup.Item>
              ))}
            </ListGroup>

            {/* Show Schema when a table is selected */}
            {selectedTable && (
              <>
                <h5>Schema for {selectedTable.table_name}</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>Data Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedTable.schema).map(([colName, colType], index) => (
                      <tr key={index}>
                        <td>{colName}</td>
                        <td>{colType}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}

            {/* Add Excel File and Table Name Modal Trigger */}
            {/* <Button variant="outline-secondary" size="sm" onClick={handleExcelModalShow} className="mt-2">
            + Add Excel File and Table
            </Button> */}

            {/* Add Schema Manually Modal Trigger */}
            {/* <Button variant="outline-secondary" size="sm" onClick={handleSchemaModalShow} className="mt-2">
              + Add Schema Manually
            </Button> */}
          </Col>

          {/* <Col md={6}>
            <h4>SQL Query for {currentFile.name}</h4>
            <Form>
              <Form.Group controlId="formSqlQuery">
                <Form.Control
                  style={{ height: '300px' }}
                  as="textarea"
                  rows={5}
                  value={sqlQuery}
                  onChange={handleSqlChange}
                  placeholder="Enter your SQL query here"
                />
              </Form.Group>
            <div className="d-flex align-items-center mt-3">
              <Button variant="success" onClick={handleRunQuery} disabled={loading}>
                Run Query
              </Button>
            </div>
            </Form>

            {excelUrl && (
              <div className="mt-3">
                <h5>Excel File Available:</h5>
                <a href={excelUrl} target="_blank" rel="noopener noreferrer">
                  {excelUrl}
                </a>
              </div>
            )}

          </Col> */}
        </Row>
      )}

      {/* Modals */}
      {/* Excel File and Table Name Modal */}
      <Modal show={showExcelModal} onHide={handleExcelModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Excel File and Table Name</Modal.Title>
        </Modal.Header>

        {/* New Select for CREATE / INSERT */}
        <Form.Group controlId="formActionType" className="mb-3">
          <Form.Select value={actionType} onChange={(e) => setActionType(e.target.value)}  >
            <option value="create">CREATE New Table</option>
            <option value="insert">INSERT Into Existing Table</option>
          </Form.Select>
        </Form.Group>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formExcelFile">
              <Form.Label>Upload Excel File</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formTableName">
              <Form.Label>Table Name</Form.Label>
              <Form.Control
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Enter table name"
              />
            </Form.Group>

            {/* Schema Columns */}
            {schemaColumns.map((column, index) => (
              <Row key={index} className="mb-2 mt-2">
                <Col>
                  <Form.Control
                    type="text"
                    value={column.columnName}
                    onChange={(e) => handleSchemaChange(index, "columnName", e.target.value)}
                    placeholder="clean_column_name"
                  />
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={column.dataType}
                    onChange={(e) => handleSchemaChange(index, "dataType", e.target.value)}
                  >
                    <option value="FLOAT">FLOAT</option>
                    <option value="TIMESTAMP">TIMESTAMP</option>
                    <option value="INTEGER">INTEGER</option>
                    <option value="STRING">STRING</option>
                  </Form.Control>
                </Col>
                <Col md="auto">
                  <Form.Check
                    type="checkbox"
                    label="Primary Key"
                    checked={column.isPrimaryKey || false}
                    onChange={(e) => handleSchemaChange(index, "isPrimaryKey", e.target.checked)}
                  />
                </Col>
                <Col md="auto">
                  <Button variant="danger" onClick={() => handleRemoveColumn(index)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
              <Button hidden={actionType==="insert"} className="mt-1" variant="success" size="sm" onClick={handleAddColumn}>
                + Add Column
              </Button>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExcelModalClose}>
            Close
          </Button>
          <Button disabled={tableName===""} variant="primary" onClick={handleExcelSubmit}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

        {/* Schema Manual Modal */}
        <Modal show={showSchemaModal} onHide={handleSchemaModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Schema Manually</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Table Name Input */}
            <Form.Group controlId="formTableName" className="mb-2">
              <Form.Label>Table Name</Form.Label>
              <Form.Control
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Enter table name"
              />
            </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSchemaModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSchema}>
            Save Schema
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Postgres;









// const response = await fetch("https://bi.meraplion.com/local/create_duckdb_file/", {