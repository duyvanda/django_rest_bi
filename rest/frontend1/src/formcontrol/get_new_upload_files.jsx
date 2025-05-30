/* eslint-disable */
import { useContext, useEffect, useState } from "react";
// import { v4 as uuid } from 'uuid';
import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
  Button,
  // Col,
  // Row,
  // Container,
  // Dropdown,
  Form,
  InputGroup,
  Modal,
  Spinner,
  // InputGroup,
  // Stack,
  // FloatingLabel,
  // Card,
  // Modal,
  Table
} from "react-bootstrap";

const cleanDataColumn = (input) => {
  const normalized = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const corrected = normalized.replace(/Đ/g, "d").replace(/đ/g, "d");
  const lowercased = corrected.toLowerCase();
  // Remove spaces after commas and replace spaces with underscores
  const noSpacesAfterComma = lowercased.replace(/,\s+/g, ","); // Remove spaces after commas
  // const noSpacesAfterComma_2 = noSpacesAfterComma.replace(/,\s+/g, ",");
  const replacedSpaces = noSpacesAfterComma.replace(/\s+/g, "_"); // Replace spaces with underscores
  // Remove any non-alphanumeric characters except for commas and underscores
  const cleaned = replacedSpaces.replace(/[^a-z0-9,_]/g, "");
  // Replace ",_" with ","
  const noUnderscoreAfterComma = cleaned.replace(/,_/g, ",");
  // Remove trailing comma if it exists
  const finalCleaned = noUnderscoreAfterComma.replace(/,$/, "");
  return finalCleaned;
};

const Get_new_upload_files = () => {
    const location = useLocation();

  const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_initial_data = async (manv) => {
      SetLoading(true)
      const response = await fetch(`https://bi.meraplion.com/local/get_google_sync_data/`)
      
      if (!response.ok) {
          SetLoading(false)
      }
      else {
      const data_arr = await response.json()
      setTableData(data_arr)
      SetLoading(false)
      }
    }
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, [count]);

  const [formData, setFormData] = useState({
    tableName: "",
    sheetId: "",
    dataRange: "",
    dataColumns: "",
    googleLink: "",
    dropIfNa: "",
    schema: [],
  });
    const [manv, set_manv] = useState("");
    const [showTable, setShowTable] = useState(false); // State to control table visibility

    const [tableData, setTableData] = useState([]);

  const clear_data = () => {
    setFormData({
      tableName: "",
      sheetId: "",
      dataRange: "",
      dataColumns: "",
      googleLink: "",
      dropIfNa: "",
      schema: [],
    });
  };

  // Function to handle row edit and populate form with row data
function handleEditRow(index) {
  // Get the selected row data from the table
  const selectedRow = tableData[index];

  // Set the formData state with the data from the selected row
  setFormData({
    tableName: selectedRow.tableName,
    sheetId: selectedRow.sheetId,
    dataRange: selectedRow.dataRange,
    dataColumns: selectedRow.dataColumns,
    googleLink: selectedRow.googleLink,
    dropIfNa: selectedRow.dropIfNa,
    schema: selectedRow.schema,  // Assuming schema is an array
  });
}


  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let newValue = value;
  
    if (name === "dataColumns") {
      newValue = cleanDataColumn(value);
    } else {
      if (
        name === "tableName" ||
        name === "googleLink" ||
        name === "sheetId" ||
        name === "dataRange" ||
        name === "dropIfNa"
      ) {
        newValue = value.trim();
      }
    }
    let updatedFormData = Object.assign({}, formData); // Clone the object
    updatedFormData[name] = newValue;
    setFormData(updatedFormData);
  }
  


  function handleSchemaChange(index, field, value) {
    let updatedSchema = [];
    for (let i = 0; i < formData.schema.length; i++) {
      let row = Object.assign({}, formData.schema[i]);
      updatedSchema.push(row);
    }
    updatedSchema[index][field] = value;
    //Object.assign({}, obj) safely clones objects (like Python's dict.copy())
    let updatedFormData = Object.assign({}, formData);
    updatedFormData.schema = updatedSchema;
    setFormData(updatedFormData);
  }
  

  function addSchemaRow() {
    let newSchema = [];
    for (let i = 0; i < formData.schema.length; i++) {
      let row = Object.assign({}, formData.schema[i]);
      newSchema.push(row);
    }
    newSchema.push({ column: "", dataType: "FLOAT" });
    let updatedFormData = Object.assign({}, formData);
    updatedFormData.schema = newSchema;
  
    setFormData(updatedFormData);
  }

  function removeSchemaRow(index) {
    let updatedSchema = [];
    for (let i = 0; i < formData.schema.length; i++) {
      if (i !== index) {
        let row = Object.assign({}, formData.schema[i]);
        updatedSchema.push(row);
      }
    }
    let updatedFormData = Object.assign({}, formData);
    updatedFormData.schema = updatedSchema;
    setFormData(updatedFormData);
  }
  

  const post_form_data = async (data) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/insert_google_sync_data/`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        SetLoading(false);
        const data = await response.json();
        console.log(data);
        SetALert(true);
        SetALertType("alert-danger");
        SetALertText("CHƯA TẠO ĐƯỢC");
        setTimeout(() => SetALert(false), 3000);
    } else {
        SetLoading(false);
        const data = await response.json();
        console.log(data);
        SetALert(true);
        SetALertType("alert-success");
        SetALertText("ĐÃ TẠO THÀNH CÔNG");
        setTimeout(() => SetALert(false), 3000);
        clear_data();
        setCount(count+1);

    }
}

  const handleSubmit = (e) => {
    e.preventDefault();
    // const schemaObject = formData.schema.reduce((acc, item) => {
    //   acc[item.column.toLowerCase()] = item.dataType.toLowerCase();
    //   return acc;
    // }, {});

    console.log(formData);
    post_form_data(formData);
    // clear_data();
  };

  // const handleAddTableData = () => {
  //   // Add the current Table Name and Google Link to the tableData state
  //   const newTableData = [...tableData, { tableName: formData.tableName, googleLink: formData.googleLink }];
  //   setTableData(newTableData);
  // };

  const toggleTable = () => {
    setShowTable(!showTable); // Toggle the visibility of the table
  };

  
  const inputLabelStyle = {
    minWidth: "150px", // Adjust width as needed
    justifyContent: "left"
  };

  return (
    
    <Form onSubmit={handleSubmit} className="p-3">

      {/* ALERT COMPONENT */}
      <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
          <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

      {alert &&
      <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
          </button>
          <span><strong>Cảnh Báo:  </strong>{alertText}</span>
      </div>
      }
      </Modal>
      {/* Button to toggle table visibility */}

    <Button
    onClick={toggleTable}
    variant="info"
    className="mt-2 d-inline-block"
    >
    Show Tables
    </Button>

      {/* Conditionally render table */}
      {showTable && (
        <Table bordered hover className="mt-2">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Google Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.tableName}</td>
              <td>{row.googleLink}</td>
              <td className="d-flex justify-content-center">
                {/* Edit Button */}
                <Button
                  variant="primary"
                  onClick={() => handleEditRow(index)}
                  className="mt-2"
                  aria-label={`Edit row ${index + 1}`}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}

      <h2>Create more table: </h2>


<InputGroup className="mt-2">
  <InputGroup.Text style={inputLabelStyle}>Link</InputGroup.Text>
  <Form.Control
    type="text"
    name="googleLink"
    value={formData.googleLink}
    onChange={handleChange}
    placeholder="Link"
  />
</InputGroup>

<InputGroup className="mt-2">
  <InputGroup.Text style={inputLabelStyle}>Sheet ID</InputGroup.Text>
  <Form.Control
    type="text"
    name="sheetId"
    value={formData.sheetId}
    onChange={handleChange}
    placeholder="Sheet ID"
  />
</InputGroup>

<InputGroup className="mt-2">
  <InputGroup.Text style={inputLabelStyle}>Table Name</InputGroup.Text>
  <Form.Control
    type="text"
    name="tableName"
    value={formData.tableName}
    onChange={handleChange}
    placeholder="Table Name"
  />
</InputGroup>


<InputGroup className="mt-2">
  <InputGroup.Text style={inputLabelStyle}>Data Range</InputGroup.Text>
  <Form.Control
    disabled={formData.googleLink.startsWith("https://eoffice")}
    type="text"
    name="dataRange"
    value={formData.dataRange}
    onChange={handleChange}
    placeholder="Data Range"
  />
</InputGroup>

<InputGroup className="mt-2">
  <InputGroup.Text style={inputLabelStyle}>Data Columns</InputGroup.Text>
  <Form.Control
    disabled={formData.googleLink.startsWith("https://eoffice")}
    type="text"
    name="dataColumns"
    value={formData.dataColumns}
    onChange={handleChange}
    placeholder="Data Columns"
  />
</InputGroup>

<InputGroup className="mt-2">
  <InputGroup.Text style={inputLabelStyle}>Drop If Na</InputGroup.Text>
  <Form.Control
    disabled={formData.googleLink.startsWith("https://eoffice")}
    type="text"
    name="dropIfNa"
    value={formData.dropIfNa}
    onChange={handleChange}
    placeholder="Drop If Na"
  />
</InputGroup>

      <Table bordered hover className="mt-2">
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Data Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {formData.schema.map((row, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={row.column}
                  onChange={(e) => handleSchemaChange(index, "column", e.target.value)}
                  placeholder="Column Name"
                  className="mt-2"
                />
              </td>
              <td>
                <Form.Select
                  value={row.dataType}
                  onChange={(e) => handleSchemaChange(index, "dataType", e.target.value)}
                  className="mt-2"
                >
                  <option value="FLOAT">FLOAT</option>
                  <option value="TIMESTAMP">TIMESTAMP</option>
                  <option value="INTERGER">INTERGER</option>
                  <option value="STRING">STRING</option>
                </Form.Select>
              </td>
              <td className="d-flex justify-content-center">
                <Button variant="danger" onClick={() => removeSchemaRow(index)} className="mt-2">
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex gap-3 mt-2">
        <Button onClick={addSchemaRow} variant="success" className="w-auto">
          Add Column
        </Button>
        <Button type="submit" variant="primary" className="w-100">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default Get_new_upload_files;