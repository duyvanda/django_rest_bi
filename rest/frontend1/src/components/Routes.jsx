import React from "react";
import { useContext, useEffect, useState } from "react";
import MapContext from "../context/MapContext";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Spinner,
} from "react-bootstrap";

function Routes() {
  const { routes, fetchRoutes, loading } = useContext(MapContext);

  const [tinh, setTinh] = useState("Ha Nam,Ninh Binh,Nam Dinh");
  const [onDate, SetOnDate] = useState("01-06-2023");
  const [kenh, SetKenh] = useState("TP,INS,CLC,PCL,MT");
  const [manv, SetManv] = useState("MR0000");

  const handleTextChange = (e) => {
    setTinh(e.target.value.toUpperCase());
  };

  const handleKenhChange = (e) => {
    SetKenh(e.target.value.toUpperCase());
  };

  const handleOnDateChange = (e) => {
    SetOnDate(e.target.value.toUpperCase());
  };

  const handleRoutesSubmit = (e) => {
    e.preventDefault();
    const routesdata = {
      tinh,
      kenh,
      manv,
      onDate,
    };
    fetchRoutes(routesdata);
    console.log(routesdata);
    // setTinh('');
    // SetFromDate('');
    // SetToDate('');
  };

  return (
    <div>
      <Form className="d-flex ml-5 mt-2" onSubmit={handleRoutesSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            disabled={true}
            as="input"
            htmlSize={25}
            className="text-truncate"
            value={tinh}
            onChange={handleTextChange}
            placeholder="Tinh,Tinh,Tinh"
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            disabled={true}
            as="input"
            htmlSize={14}
            className="text-truncate"
            value={kenh}
            onChange={handleKenhChange}
            placeholder="Kenh,Kenh,Kenh"
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            disabled={true}
            as="input"
            htmlSize={14}
            className="text-truncate"
            value={manv}
            onChange={console.log("null")}
            placeholder="DS NV"
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            value={onDate}
            htmlSize={8}
            onChange={handleOnDateChange}
            placeholder="onDate: 01-06-2023"
          ></Form.Control>
        </Form.Group>

        <Button
          className="ml-2 border-0"
          type="submit"
          style={{ backgroundColor: "#00A79D" }}
        >
          Submit
        </Button>
      </Form>
      {loading && (
        <Spinner
          animation="border"
          role="status"
          style={{
            height: "100px",
            width: "100px",
            margin: "auto",
            display: "block",
          }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}

      <iframe
        className="mt-2"
        src={routes}
        style={{ border: 1, height: "100vh", frameBorder: "0", width: "100vw" }}
        allowFullScreen
      ></iframe>
    </div>
  );
}
export default Routes;
