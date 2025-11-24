/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MapContext from "../context/MapContext";
import FeedbackContext from '../context/FeedbackContext'
import {
  Button,
  Container,
  Dropdown,
  Form,
  Spinner,
} from "react-bootstrap";

import Stack from 'react-bootstrap/Stack';

import {
  useNavigate
} from "react-router-dom";

function Routes() {
  const navigate = useNavigate();

  const {userLogger, SetRpScreen, fetchFilerReports, shared } = useContext(FeedbackContext)
  const { routes, fetchRoutes, loading, SetLoading } = useContext(MapContext);

  const fetch_manv_role = async () => {
    SetLoading(true);
    const response = await fetch(`https://bi.meraplion.com/local/manv_role/`)
    const data = await response.json()
    set_lst_manv_check(data)
    SetLoading(false)
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
            navigate('/login');
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

  const handleClearNV = () => {
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

// const clean = '<div style="width:100%;"><div style="position:relative;width:100%;height:0;padding-bottom:60%;"><span style="color:#565656">Make this Notebook Trusted to load map: File -> Trust Notebook</span><iframe srcdoc="&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n    \n    &lt;meta http-equiv=&quot;content-type&quot; content=&quot;text/html; charset=UTF-8&quot; /&gt;\n    \n        &lt;script&gt;\n            L_NO_TOUCH = false;\n            L_DISABLE_3D = false;\n        &lt;/script&gt;\n    \n    &lt;style&gt;html, body {width: 100%;height: 100%;margin: 0;padding: 0;}&lt;/style&gt;\n    &lt;style&gt;#map {position:absolute;top:0;bottom:0;right:0;left:0;}&lt;/style&gt;\n    &lt;script src=&quot;https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js&quot;&gt;&lt;/script&gt;\n    &lt;script src=&quot;https://code.jquery.com/jquery-1.12.4.min.js&quot;&gt;&lt;/script&gt;\n    &lt;script src=&quot;https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js&quot;&gt;&lt;/script&gt;\n    &lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js&quot;&gt;&lt;/script&gt;\n    &lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css&quot;/&gt;\n    &lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css&quot;/&gt;\n    &lt;link rel=&quot;stylesheet&quot; href=&quot;https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css&quot;/&gt;\n    &lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.0/css/all.min.css&quot;/&gt;\n    &lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css&quot;/&gt;\n    &lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdn.jsdelivr.net/gh/python-visualization/folium/folium/templates/leaflet.awesome.rotate.min.css&quot;/&gt;\n    \n            &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width,\n                initial-scale=1.0, maximum-scale=1.0, user-scalable=no&quot; /&gt;\n            &lt;style&gt;\n                #map_4ad3e0003c58a2cbb520c41bc838ac6a {\n                    position: relative;\n                    width: 94.0%;\n                    height: 80.0%;\n                    left: 3.0%;\n                    top: 0.0%;\n                }\n                .leaflet-container { font-size: 1rem; }\n            &lt;/style&gt;\n        \n&lt;/head&gt;\n&lt;body&gt;\n    \n    \n            &lt;div class=&quot;folium-map&quot; id=&quot;map_4ad3e0003c58a2cbb520c41bc838ac6a&quot; &gt;&lt;/div&gt;\n        \n&lt;/body&gt;\n&lt;script&gt;\n    \n    \n            var map_4ad3e0003c58a2cbb520c41bc838ac6a = L.map(\n                &quot;map_4ad3e0003c58a2cbb520c41bc838ac6a&quot;,\n                {\n                    center: [-33.925, 18.625],\n                    crs: L.CRS.EPSG3857,\n                    zoom: 10,\n                    zoomControl: true,\n                    preferCanvas: false,\n                }\n            );\n\n            \n\n        \n    \n            var tile_layer_e5cdc1ac1779328a830246043f19a459 = L.tileLayer(\n                &quot;https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png&quot;,\n                {&quot;attribution&quot;: &quot;Data by \\u0026copy; \\u003ca target=\\&quot;_blank\\&quot; href=\\&quot;http://openstreetmap.org\\&quot;\\u003eOpenStreetMap\\u003c/a\\u003e, under \\u003ca target=\\&quot;_blank\\&quot; href=\\&quot;http://www.openstreetmap.org/copyright\\&quot;\\u003eODbL\\u003c/a\\u003e.&quot;, &quot;detectRetina&quot;: false, &quot;maxNativeZoom&quot;: 18, &quot;maxZoom&quot;: 18, &quot;minZoom&quot;: 0, &quot;noWrap&quot;: false, &quot;opacity&quot;: 1, &quot;subdomains&quot;: &quot;abc&quot;, &quot;tms&quot;: false}\n            ).addTo(map_4ad3e0003c58a2cbb520c41bc838ac6a);\n        \n&lt;/script&gt;\n&lt;/html&gt;" style="position:absolute;width:100%;height:100%;left:0;top:0;border:none !important;" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe></div></div>'

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
            <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}} >
            <div align="center">
              <Button variant="warning" size="sm" style={{width:"200px"}} onClick={handleClearNV}>Clear All Nhân Viên</Button>
            </div>
            <Form.Control className="mt-2" type="text" onChange={handleSearchParam} placeholder="Tìm Mã Hoặc Tên" />
                {lst_manv_check
                .filter( el => el.ma_va_ten.includes(search))
                // .slice(0, 100)
                .map( el => <Form.Check key={el.manv} className="text-nowrap" type="switch" checked={el.checked} onChange={handeClick} id={el.manv} label={el.tencvbh}/>)
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

        <Container fluid >
          <div style={{ border: 1 }} className="mt-2" dangerouslySetInnerHTML={{__html: routes}} />
        </Container>
      </div>
    );

  }
  else {
    return (

        <div>
          <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
          <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
          </Spinner>
        </div>
      
    )
  }
}
export default Routes;

{/* <div align="center" className="mt-2" >
<iframe  className="border border-dark mt-2" src={routes}  style={{ border: 1, height: "80vh", frameBorder:"0", width: "94vw"  }} allowFullScreen></iframe>
</div> */}
