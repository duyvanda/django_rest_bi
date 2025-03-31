import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ManagerApprovalForm = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      generalCustomer: "000203 - BVĐK VẠN HẠNH - SG",
      customer: "HCP1000000140-H - NGUYỄN THỊ KIM LOAN",
      gift: "Quà tặng",
      channel: "CLC",
      content: "Chi phí quà tặng quà dịp 20/03",
      note: "hhhhhhhhhhhhhhhhhh",
      planningNumber: 500000,
      status: false,
      checked: true,
    },
    {
      id: 2,
      generalCustomer: "000204 - BVĐK TÂN PHÚ - SG",
      customer: "HCP1000000141-H - TRẦN VĂN AN",
      gift: "Quà tặng",
      channel: "CLC",
      content: "Chi phí quà tặng quà dịp 21/03",
      note: "nnnnnnnnnnnnnnnnnn",
      planningNumber: 600000,
      status: false,
      checked: true,
    },
  ]);


  const handleApproval = async (isApproved) => {
    // Create a new list of records with updated status
    const updatedRecords = records.map((record) => {
      if (record.checked) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.status = isApproved; // Update status
        return updatedRecord;
      }
      return record;
    });
  
    // Update state with the modified records list
    setRecords(updatedRecords);

    try {
      const response = await fetch("/api/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecords),
      });
      if (!response.ok) {
        console.error("Failed to send approval data");
      }
    } catch (error) {
      console.error("Error sending approval data:", error);
    }

  };
  

  const handleCheckboxChange = (id) => {
    // Create a new list of records with updated checked status
    const updatedRecords = records.map((record) => {
      if (record.id === id) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.checked = !updatedRecord.checked; // Toggle the checked status
        return updatedRecord;
      }
      return record;
    });
  
    // Update state with the modified records list
    setRecords(updatedRecords);

  };
  
  

  const handlePlanningNumberChange = (id, newValue) => {
    // Create a new list of records
    const updatedRecords = records.map((record) => {
      if (record.id === id) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.planningNumber = newValue; // Update the value
        return updatedRecord;
      }
      return record;
    });
  
    // Update state
    setRecords(updatedRecords);
  };
  
  

  return (
    <Container className="mt-4">
      <h3>Manager Approval</h3>
      <div className="d-flex gap-2 mb-3">
        <Button variant="success" onClick={() => handleApproval(true)}>
          Approve
        </Button>
        <Button variant="danger" onClick={() => handleApproval(false)}>
          Reject
        </Button>
      </div>
      <div className="d-flex flex-wrap gap-3">
        {records.map((record) => (
          <Card key={record.id} className="p-3 shadow" style={{ width: "350px" }}>
            <Card.Body className="p-0">
              <Form.Check 
                type="switch"
                id={`switch-${record.id}`}
                checked={record.checked}
                onChange={() => handleCheckboxChange(record.id)}
                className="mb-4"
              />
              <Card.Title>ID: {record.id}</Card.Title>
              <div><strong>Status:</strong> {record.status ? "Approved" : "Rejected"}</div>
              <div><strong>Customer:</strong>{record.customer}</div>
              <div><strong>Gift:</strong>{record.gift}</div>
              <div><strong>Channel:</strong>{record.channel}</div>
              <div><strong>Content:</strong>{record.content}</div>
              <div><strong>Note:</strong>{record.note}</div>
              <Form.Group>
              <Form.Label><strong>Planning Number:</strong></Form.Label>
              <Form.Control
                type="number"
                value={record.planningNumber} // Use record's value directly
                onChange={(e) => handlePlanningNumberChange(record.id, e.target.value)}
              />
            </Form.Group>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default ManagerApprovalForm;
