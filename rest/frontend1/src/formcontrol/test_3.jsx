import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { v4 as uuid } from "uuid";

const MyForm = () => {
  // Define states for the inputs
  const [manv, setManv] = useState("");
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);   // Default to today
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");

  // Sample list of employees
  const employees = [
    { value: 'mr001', label: 'Duy' },
    { value: 'mr002', label: 'John' },
    { value: 'mr003', label: 'Anna' }
  ];

  // Function to clear all input values
  const clear_data = () => {
    setManv("");
    setFromDate(new Date().toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
    setDays("");
    setReason("");
  };

  // Function to handle form submission
  const handle_submit = (e) => {
    e.preventDefault();

    const data = {
      manv: manv,
      fromDate: fromDate,
      toDate: toDate,
      days: days,
      reason: reason,
      uuid: uuid(),
    };

    console.log(data);
    clear_data();
  };

  return (
    <Form onSubmit={handle_submit}>
    <Row className="justify-content-center">
    <Col md={4} >

      {/* Select employee */}
       {/* Select employee */}
       <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Select
            options={employees}
            value={employees.find((emp) => emp.value === manv)}
            onChange={(selectedOption) => setManv(selectedOption ? selectedOption.value : "")}
            placeholder="Chọn nv"
            styles={{
              control: (base) => ({
                ...base,
                height: "60px",
                borderColor: "lightgray",
              }),
            }}
          />
        </Col>
      </Form.Group>

      {/* From Date */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Label>From Date</Form.Label>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="Từ ngày"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* To Date */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Label>To Date</Form.Label>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="Đến ngày"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* Number of Days */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Control
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Số ngày"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* Reason for Leave */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Control
            as="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* Submit Button */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Button variant="primary" type="submit" block>
            Submit
          </Button>
        </Col>
      </Form.Group>

      </Col>
      </Row>
    </Form>
  );
};

export default MyForm;