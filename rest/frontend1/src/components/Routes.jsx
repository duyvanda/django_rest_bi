import React from "react";
import { useContext, useEffect, useState } from "react";
import MapContext from "../context/MapContext";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";

import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

function Routes() {
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
  }

  const current_date = formatDate(Date())
  const [onDate, setDate] = useState(current_date);
  const { routes, fetchRoutes, loading } = useContext(MapContext);

  const [tinh, setTinh] = useState("Ha Nam,Ninh Binh,Nam Dinh");
  
  const [kenh, SetKenh] = useState("TP,INS,CLC,PCL,MT");
  const [manv, SetManv] = useState("MR0000");
  const [lst_manv_check, set_lst_manv_check] = useState(
    [
      {id: "MR2143", name:"Đinh Thị Hoa", checked: false },
      {id: "MR2524", name:"Nguyễn Tiến Tân", checked: true },
      {id: "MR2676", name:"Phạm Công Diễn", checked: true },
      {id: "MR2902", name:"Hoàng Văn Thành", checked: true },
      {id: "MR2913", name:"Lê Thị Thơm", checked: false },
      {id: "MR2954", name:"L Đ Tùng", checked: true },
      {id: "MR2953", name:"P Đ Cẩn", checked: true },
    ]
  
  );

  const [lst_makenh, set_lst_makenh] = useState(
    [
      {id: "TP" ,checked: true},
      {id: "PCL" ,checked: true},
      {id: "INS" ,checked: true},
      {id: "CLC" ,checked: true},
      {id: "MT" ,checked: true},
    ]
  
  );

  const handleTextChange = (e) => {
    setTinh(e.target.value.toUpperCase());
  };

  const handleKenhChange = (e) => {
    SetKenh(e.target.value.toUpperCase());
  };

  // const handleOnDateChange = (e) => {
  //   SetOnDate(e.target.value.toUpperCase());
  // };

  const handleRoutesSubmit = (e) => {
    const manv = []
    for (let i of lst_manv_check) {
      if (i.checked === true) {manv.push(i.id)}
    }

    const kenh = []
    for (let i of lst_makenh) {
      if (i.checked === true) {kenh.push(i.id)}
    }

    e.preventDefault();
    const routesdata = {
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

  const handeClick = (e) => {
    // console.log("ID: " + e.target.id);
    // console.log("CHECKED: " + e.target.checked);
    // const data = {
    //   "id": e.target.id,
    //   "checked": e.target.checked
    // }
    // console.log("data", data)
    let lst = [];
    for (const [index, element] of lst_manv_check.entries()) {
      // console.log("index", index, "element", element)
      if(element.id === e.target.id) {
        element.checked = !element.checked      
        lst.push(element);
      }
      else {
        lst.push(element);
      }
    }
    set_lst_manv_check(lst)
}

const handeClickChannel = (e) => {
  let lst = [];
  for (const [index, element] of lst_makenh.entries()) {
    console.log("index", index, "element", element)
    if(element.id === e.target.id) {
      element.checked = !element.checked      
      lst.push(element);
    }
    else {
      lst.push(element);
    }
  }
  set_lst_makenh(lst)
}


  if (!loading) {

    return (
      <div>
        <Form className='d-flex ml-5 mt-2' onSubmit={handleRoutesSubmit}>
        <Stack direction="horizontal" gap={2}>

          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
            Chọn Nhân Viên
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {lst_manv_check
                .map( el =>
                  <Form.Check className="text-nowrap" type="switch" checked={el.checked} onChange={handeClick} id={el.id} label={el.name}/>
                    )
                }
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
            Chọn Kênh
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {lst_makenh
                .map( el =>
                  <Form.Check className="text-nowrap" type="switch" checked={el.checked} onChange={handeClickChannel} id={el.id} label={el.id}/>
                    )
                }
            </Dropdown.Menu>
          </Dropdown>

            <Form.Control style={{backgroundColor: "light"}} variant="dark" type="date" value={onDate} htmlSize={8} onChange={(e) => setDate(e.target.value)} placeholder="DateRange"></Form.Control>

          <Button className="ml-2 border-0"  type="submit" style={{backgroundColor:"#00A79D"}}>Submit</Button>
          </Stack>
        </Form>
        <iframe className="mt-2" src={routes}  style={{ border: 1, height: "100vh", frameBorder:"0", width: "100vw"  }} allowFullScreen></iframe>
      </div>
    );

  }
  else {
        return (
      <div>
        <h1>Loading Map</h1>
        <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
        <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
        )
  }
}
export default Routes;
