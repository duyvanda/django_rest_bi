/* eslint-disable */
import { useContext, useEffect, useState, useRef  } from "react";
import Select from "react-select";
import './myvnp.css';
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
const Excel_kh_bi_thu_hoi_gpp = ( {history} ) => {

  const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
  const fileInputRef = useRef(null); // ✅ Define the ref here
  // const fetch_initial_data = async (manv) => {
  //   SetLoading(true)
    
  //   const response = await fetch(`https://bi.meraplion.com/local/get_all_pg_tables/`)
  //   if (!response.ok) {
  //       SetLoading(false)
  //   }
  //   else {
  //   const data = await response.json()
  //   setDbFiles(data['db_files'])
  //   console.log(data);
  //   SetLoading(false);

  //   }
  // }

  const [count, setCount] = useState(0);
  useEffect(() => {
      if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);

      } else {
          history.push(`/login?redirect=${location.pathname}`);
      };
  }, [count]);

  const [manv, set_manv] = useState("");
  const [messages, setMessages] = useState([]);
  const [excelFile, setExcelFile] = useState(""); 
  const [recentFiles, setRecentFiles] = useState([]);
  const [ket_qua_url, set_ket_qua_url] = useState([]);

  const handleExcelFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setExcelFile(file);
      const formData = new FormData();
      formData.append("excelFile", file);

    } else {
      window.alert("Please upload a valid Excel file.");
    }
  };

  // Handle submitting Excel file, table name, and db file path
  const handle_submit = async (e) => {
    e.preventDefault();
    if (!excelFile ) {
      window.alert("Please fill in all fields.");
      return;
    }

    // Prepare the data to send to the backend
    const formData = new FormData();
    formData.append("excelFile", excelFile);
    formData.append("data", JSON.stringify({"manv": manv }) );
    SetLoading(true)
    try {
      const response = await fetch("https://bi.meraplion.com/local/sync_thu_hoi_gpp_to_dms/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        // window.alert("Excel file successfully submitted.");
      // ✅ Reset state

      setExcelFile(null);
      setMessages(data.message);
      setRecentFiles(data.files.slice(0, 3));
      set_ket_qua_url(data.ket_qua_url);

      console.log(typeof data.ket_qua_url, data.ket_qua_url);

      SetALert(true);
      SetALertType("alert-success");
      SetALertText( data.success_message );
      setTimeout(() => {
      SetALert(false);
      SetLoading(false);
      }, 2000);

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // 👈 clear file input manually
      }

      } else {
            
      SetALert(true);
      SetALertType("alert-danger");
      SetALertText(data.error_message);
      setTimeout(() => {
      SetALert(false);
      SetLoading(false);
      }, 2000);
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      window.alert("Error occurred while uploading the Excel file.");
    }
  };

  return (
    <div>

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
          <Form onSubmit={handle_submit} >
            <Form.Group controlId="formExcelFile">
              <Form.Label>Upload Excel File</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                ref={fileInputRef} // ✅ Attach the ref to the file input
                onChange={handleExcelFileChange}
              />
            </Form.Group>
          <Button disabled={ false } className='mt-2' variant="secondary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
          </Form>

          {recentFiles.length > 0 && (
            <div className="mt-4">
              <h6>3 files upload gần nhất:</h6>
              <ul className="list-unstyled">
                {recentFiles.map((fileUrl, index) => (
                  <li key={index}>
                    <a
                      href={fileUrl}
                      download // 👈 forces download instead of opening in browser
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      {fileUrl.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

            {messages.length > 0 && (
              <div className="mt-4">
                <h6>Kết quả xử lý:</h6>
                <a
                  href={ket_qua_url}
                  download // 👈 forces download instead of opening in browser
                  style={{ color: "#007bff", textDecoration: "underline" }}
                >
                  { ket_qua_url }
                </a>


                <Table bordered hover size="sm" className="text-center">
                  <thead>
                    <tr>
                      {/* ✅ Always show these three first */}
                      <th>File ID</th>
                      <th>Dòng</th>
                      <th>Kết Quả</th>

                      {/* ✅ Add any extra columns dynamically */}
                      {Object.keys(messages[0])
                        .filter(
                          (key) => !["file_id", "row_id", "result"].includes(key)
                        )
                        .map((extraKey) => (
                          <th key={extraKey}>{extraKey}</th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {messages.map((msg, index) => (
                      <tr key={index}>
                        {/* ✅ Always show these three */}
                        <td>{msg.file_id}</td>
                        <td>{msg.row_id}</td>
                        <td
                          style={{
                            color: msg.result?.includes("Không")
                              ? "red"
                              : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {msg.result}
                        </td>

                        {/* ✅ Add any extra values dynamically */}
                        {Object.keys(msg)
                          .filter(
                            (key) => !["file_id", "row_id", "result"].includes(key)
                          )
                          .map((extraKey) => (
                            <td key={extraKey}>{msg[extraKey]}</td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

    </div>

    
  );
};

export default Excel_kh_bi_thu_hoi_gpp;