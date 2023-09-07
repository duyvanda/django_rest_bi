import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MapContext from "../context/MapContext";
import FeedbackContext from '../context/FeedbackContext'
import {
  Button,
  Dropdown,
  Form,
  Spinner,
} from "react-bootstrap";

// import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

function Routes({history}) {

  const {userLogger, SetRpScreen, fetchFilerReports, shared } = useContext(FeedbackContext)

  const fetch_manv_role = async (manv) => {
    const response = await fetch(`https://bi.meraplion.com/local/manv_role/?manv=${manv}`)
    const data = await response.json()
    set_lst_manv_check(data)
  }

  useEffect(() => {
		if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, '10', isMB, dv_width);
      SetRpScreen(true);
      fetch_manv_role(JSON.parse(localStorage.getItem("userInfo")).manv);
      fetchFilerReports("10", isMB);
		} else {
            history.push('/login');
        };
	}, []);

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

  // function reverseString(str) {
  //   var newString = "";
  //   for (var i = str.length - 1; i >= 0; i--) {
  //       newString += str[i];
  //   }
  //   return newString;
  // }

  


  const current_date = formatDate(Date())
  const [onDate, setDate] = useState(current_date);
  const { routes, fetchRoutes, loading } = useContext(MapContext);

  // const [tinh, setTinh] = useState("Ha Nam,Ninh Binh,Nam Dinh");
  
  // const [kenh, SetKenh] = useState("TP,INS,CLC,PCL,MT");
  // const [manv, SetManv] = useState("MR0000");
  const [lst_manv_check, set_lst_manv_check] = useState([])
  const [search, set_search] = useState('')
    // [
      // {id: "MR2143", name:"Đinh Thị Hoa", checked: false },
      // {id: "MR2524", name:"Nguyễn Tiến Tân", checked: true },
      // {id: "MR2676", name:"Phạm Công Diễn", checked: true },
      // {id: "MR2902", name:"Hoàng Văn Thành", checked: true },
      // {id: "MR2913", name:"Lê Thị Thơm", checked: false },
      // {id: "MR2954", name:"L Đ Tùng", checked: true },
      // {id: "MR2953", name:"P Đ Cẩn", checked: true },
    // ]
  

  const [lst_makenh, set_lst_makenh] = useState(
    [
      {id: "TP" ,checked: true},
      {id: "PCL" ,checked: true},
      {id: "INS" ,checked: true},
      {id: "CLC" ,checked: true},
      {id: "MT" ,checked: true},
    ]
  
  );
  // const handleTextChange = (e) => {
  //   setTinh(e.target.value.toUpperCase());
  // };

  // const handleKenhChange = (e) => {
  //   SetKenh(e.target.value.toUpperCase());
  // };

  // const handleOnDateChange = (e) => {
  //   SetOnDate(e.target.value.toUpperCase());
  // };

  const handleSearchParam=(e)=>{
    set_search(e.target.value.toLowerCase())
  }

  const handleClickNV = () => {
    let lst = [];
    for (const i of lst_manv_check) {
      i.checked = false
      lst.push(i);
    };
    set_lst_manv_check(lst)
  }

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
      if(element.manv === e.target.id) {
        element.checked = e.target.checked
        // console.log("ele manv", element.manv)   
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

const handleRoutesSubmit = (e) => {
  const manv = []
  const fg = []
  for (let i of lst_manv_check) {
    if (i.checked === true) 
    // console.log(i)
    {manv.push(i.manv); fg.push(i.tencvbh)}
  }

  const kenh = []
  for (let i of lst_makenh) {
    if (i.checked === true) {kenh.push(i.id)}
  }

  e.preventDefault();
  const routesdata = {
    kenh,
    manv,
    fg,
    onDate,
  };
  fetchRoutes(routesdata);
  console.log(routesdata);
  set_search('');
  // SetFromDate('');
  // SetToDate('');
};

  if (!shared) {
    return (
      <div className="container">
        <h1>Bạn chưa được cấp quyền truy cập</h1>
        <Link to="/reports">Đi Đến Danh Sách Reports</Link>
      </div>
      )
  }

  else if (!loading) {

    return (
      <div>
        <Form className='ml-5 mt-2' onSubmit={handleRoutesSubmit}>
        <Stack direction="horizontal" gap={2} className="col-md-2">
        
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="text-dark bg-warning border border-warning">
            Chọn Nhân Viên
            </Dropdown.Toggle>
            <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}}>
            <div align="center">
              <Button variant="warning" size="sm" style={{width:"200px"}} onClick={handleClickNV}>Clear All Nhân Viên</Button>
            </div>
            <Form.Control className="mt-2" type="text" onChange={handleSearchParam} placeholder="Tìm Mã Hoặc Tên" />
                {lst_manv_check
                .filter( el =>
                  el.ma_va_ten.includes(search)
                  )
                // .slice(0, 100)
                .map( el =>
                  <Form.Check key={el.manv} className="text-nowrap" type="switch" checked={el.checked} onChange={handeClick} id={el.manv} label={el.tencvbh}/>
                  )
                }
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="text-dark bg-warning border border-warning">
            Chọn Kênh
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {lst_makenh
                .map( el =>
                  <Form.Check key={el.id} className="text-nowrap" type="switch" checked={el.checked} onChange={handeClickChannel} id={el.id} label={el.id}/>
                    )
                }
            </Dropdown.Menu>
          </Dropdown>

            <Form.Control className="text-dark bg-warning border border-warning" type="date" value={onDate} htmlSize={8} onChange={(e) => setDate(e.target.value)} placeholder="DateRange"></Form.Control>

          <Button className="ml-2 border-0"  type="submit" variant="warning">Submit</Button>

          </Stack>
        </Form>
        <div align="center" className="mt-2" >
        <iframe  className="border border-dark mt-2" src={routes}  style={{ border: 1, height: "80vh", frameBorder:"0", width: "94vw"  }} allowFullScreen></iframe>
        </div>
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

{/* <ListGroup horizontal gap={2} className="col-md-2"> */}
{/* </ListGroup> */}
