import React, { useState } from "react";
import { Table, Form, Button } from "react-bootstrap";

// Function to format date in dd-mm-yyyy format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // This will return the date in dd/mm/yyyy format
};

const MyForm = () => {
  // Sample data for the table
  const [data, setData] = useState([
    {
      manv: "mr001",
      ten_cvbh: "mr001",
      fromDate: "2025-04-15",
      toDate: "2025-04-15",
      days: "6",
      reason: "di nghi mat",
      uuid: "609e8c53-2d8b-4313-9ac7-a43847cbc8f4",
      status: "new",
      checked: true
    },
    {
      manv: "mr002",
      ten_cvbh: "mr002",
      fromDate: "2025-05-10",
      toDate: "2025-05-15",
      days: "5",
      reason: "vacation",
      uuid: "42f899e7-e6ab-493d-b1f3-cf5bc77f9d3e",
      status: "new",
      checked: false
    }
  ]);

  // Update the 'checked' status when the switch is toggled
  const handleSwitchChange = (uuid) => {
    const updatedData = data.map((item) => {
      if (item.uuid === uuid) {
        item.checked = !item.checked;
      }
      return item;
    });
    setData(updatedData);
  };

  // Handle approving selected items
  const handleApprove = () => {
    const updatedData = data.map((item) => {
      if (item.checked) {
        item.status = "approved";
      }
      return item;
    });
    setData(updatedData);
  };

  // Handle denying selected items
  const handleDeny = () => {
    const updatedData = data.map((item) => {
      if (item.checked) {
        item.status = "denied";
      }
      return item;
    });
    setData(updatedData);
  };

  return (
    <div>
      {/* Buttons for approving or denying */}
      <div className="mt-2" style={{ marginBottom: "20px" }}>
        <Button variant="success" onClick={handleApprove} style={{ marginRight: "10px" }}>
          Approve
        </Button>
        <Button variant="danger" onClick={handleDeny}>
          Deny
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered hover style={{ tableLayout: 'fixed', backgroundColor: '#f0f8ff' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Switch</th>
              <th>Tên NV</th>
              <th>Mã NV</th>
              <th>Lý do</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th>Số ngày</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.uuid}>
                
                <td>{item.uuid}</td>
                <td>
                  <Form.Check
                    type="switch"
                    checked={item.checked}
                    onChange={() => handleSwitchChange(item.uuid)}
                  />
                </td>
                <td>{item.ten_cvbh}</td>
                <td>{item.manv}</td>
                <td>{item.reason}</td>
                <td>{formatDate(item.fromDate)}</td>
                <td>{formatDate(item.toDate)}</td>
                <td>{item.days}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MyForm;
