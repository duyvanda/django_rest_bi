import React, { useState } from "react";
import { Form, Button, Table } from "react-bootstrap";

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

const DataForm = () => {
  const [formData, setFormData] = useState({
    tableName: "",
    sheetId: "",
    dataRange: "",
    dataColumns: "",
    googleLink: "",
    dropIfNa: "",
    schema: [],
  });

  const [showTable, setShowTable] = useState(false); // State to control table visibility

  const [tableData, setTableData] = useState([
    { tableName: "Customers", googleLink: "https://www.google.com" },
    { tableName: "Orders", googleLink: "https://www.example.com" },
    { tableName: "Products", googleLink: "https://www.sample.com" },
    { tableName: "Employees", googleLink: "https://www.company.com" },
    { tableName: "Sales", googleLink: "https://www.sales.com" },
  ]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clean the dataColumns input before updating state
    if (name === "dataColumns") {
      setFormData({ ...formData, [name]: cleanDataColumn(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSchemaChange = (index, field, value) => {
    const updatedSchema = [...formData.schema];
    updatedSchema[index][field] = value;
    setFormData({ ...formData, schema: updatedSchema });
  };

  const addSchemaRow = () => {
    setFormData({
      ...formData,
      schema: [...formData.schema, { column: "", dataType: "STRING" }],
    });
  };

  const removeSchemaRow = (index) => {
    const updatedSchema = formData.schema.filter((_, i) => i !== index);
    setFormData({ ...formData, schema: updatedSchema });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const schemaObject = formData.schema.reduce((acc, item) => {
      acc[item.column.toLowerCase()] = item.dataType.toLowerCase();
      return acc;
    }, {});

    console.log(formData);
    clear_data();
  };

  const handleAddTableData = () => {
    // Add the current Table Name and Google Link to the tableData state
    const newTableData = [...tableData, { tableName: formData.tableName, googleLink: formData.googleLink }];
    setTableData(newTableData);
  };

  const toggleTable = () => {
    setShowTable(!showTable); // Toggle the visibility of the table
  };

  

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      {/* Button to toggle table visibility */}

    <Button
    onClick={toggleTable}
    variant="info"
    className="mt-2 d-inline-block"
    >
    Show Table
    </Button>

      {/* Conditionally render table */}
      {showTable && (
        <Table striped bordered hover className="mt-2">
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Google Link</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.tableName}</td>
                <td>{row.googleLink}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h2>Create more table: </h2>

      <Form.Control
        type="text"
        name="googleLink"
        value={formData.googleLink}
        onChange={handleChange}
        placeholder="Google Link"
        className="mt-2"
      />
      <Form.Control
        type="text"
        name="tableName"
        value={formData.tableName}
        onChange={handleChange}
        placeholder="Table Name"
        className="mt-2"
      />
      <Form.Control
        type="text"
        name="sheetId"
        value={formData.sheetId}
        onChange={handleChange}
        placeholder="Sheet ID"
        className="mt-2"
      />
      <Form.Control
        type="text"
        name="dataRange"
        value={formData.dataRange}
        onChange={handleChange}
        placeholder="Data Range"
        className="mt-2"
      />
      <Form.Control
        type="text"
        name="dataColumns"
        value={formData.dataColumns}
        onChange={handleChange}
        placeholder="Data Columns"
        className="mt-2"
      />

      {/* DropIfNa Input */}
      <Form.Control
        type="text"
        name="dropIfNa"
        value={formData.dropIfNa}
        onChange={handleChange}
        placeholder="Drop If Na"
        className="mt-2"
      />

      <Table striped bordered hover className="mt-2">
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
                  <option value="STRING">STRING</option>
                  <option value="FLOAT">FLOAT</option>
                  <option value="TIMESTAMP">TIMESTAMP</option>
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

export default DataForm;