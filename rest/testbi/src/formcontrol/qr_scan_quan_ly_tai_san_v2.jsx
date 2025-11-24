import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const Qr_scan_quan_ly_tai_san_v2 = () => {
  const [scanResult, setScanResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (result, error) => {
    if (!!result) {
      setScanResult(result?.text);
      setShowScanner(false); // Stop scanning after a successful result
    }
    if (!!error) {
      // optional error logging
    }
  };

  return (
    <div>
      <h2>QR Code Scanner</h2>

      {!showScanner && (
        <button
          onClick={() => setShowScanner(true)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          📷 Start Scan (Back Camera)
        </button>
      )}

      {showScanner && (
        <div style={{ width: "100%", maxWidth: "400px", marginTop: "20px" }}>
          <QrReader
            constraints={{
              audio: false,
              video: {
                facingMode: { exact: "environment" }, // force rear camera
              },
            }}
            onResult={handleScan}
            style={{ width: "100%" }}
          />
        </div>
      )}

      {scanResult && (
        <p style={{ marginTop: "20px" }}>✅ Scanned Result: {scanResult}</p>
      )}
    </div>
  );
};

export default Qr_scan_quan_ly_tai_san_v2;
