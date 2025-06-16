import React, { useState, useEffect, useCallback } from 'react';
import initSqlJs from 'sql.js';

function InvoiceClaimsProcessor() {
  const [db, setDb] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);
  const [rawData, setRawData] = useState([]); // State for raw data from API
  const [adjustedData, setAdjustedData] = useState([]); // State for processed data
  const [loadingApi, setLoadingApi] = useState(false);
  const [processingData, setProcessingData] = useState(false);
  const [error, setError] = useState(null);

  // 1. Initialize SQLite DB once on component mount
  useEffect(() => {
    async function initDatabase() {
      try {
        const SQL = await initSqlJs({
          locateFile: file => `/${file}`
        });
        const newDb = new SQL.Database();
        setDb(newDb);
        setLoadingDb(false);
      } catch (err) {
        console.error("Failed to load SQL.js:", err);
        setError("Failed to load database. Check console for details.");
        setLoadingDb(false);
      }
    }
    initDatabase();
    return () => {
      if (db) {
        db.close();
        console.log("SQLite database closed when unmounts. Because you navigated to a different page. If you didn't close it, the connection could remain open and consuming memory");
      }
    };
  }, []); // Empty dependency array means this runs only once

  // 2. Simulate API Call to get rawData
  useEffect(() => {
    async function fetchData() {
      setLoadingApi(true);
      setError(null);
      try {
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 0));

        const apiData = [
          {"recordid":1,"claim_money":300000,"invoice_number":2,"invoice_number_original_budget":1000000},
          {"recordid":2,"claim_money":300000,"invoice_number":2,"invoice_number_original_budget":1000000},
          {"recordid":3,"claim_money":500000,"invoice_number":2,"invoice_number_original_budget":1000000},
          {"recordid":4,"claim_money":500000,"invoice_number":3,"invoice_number_original_budget":600000},
          {"recordid":5,"claim_money":500000,"invoice_number":"","invoice_number_original_budget":""}
        ];
        setRawData(apiData);
      } catch (err) {
        console.error("API call failed:", err);
        setError("Failed to fetch data from API.");
      } finally {
        setLoadingApi(false);
      }
    }

    if (loadingDb===false && db) { // Fetch data once DB is ready
      fetchData();
    }
  //If you used [] (empty array):
  //The API useEffect would run only once, immediately after the initial component mount.
  //At that time, loadingDb WOULD STILL be true, and db would be null/undefined.
  //The condition if (loadingDb === false && db) would be false.
  //fetchData() would NEVER be called
  // Refetch if db loading state changes or db instance becomes available
  }, [loadingDb, db] ); 


  // 3. Function to process data when button is clicked
  const processClaims = async () => {
    if (!db || rawData.length === 0) {
      console.warn("Database not ready or no raw data to process.");
      return;
    }

    setProcessingData(true);
    setError(null);

    try {
      // **Important**: Re-initialize the table and insert data
      // This is crucial because `db.run()` operations are persistent on the *current* DB instance.
      // If you don't drop/recreate, subsequent clicks would add duplicate data or sum it up incorrectly.
      db.run(`DROP TABLE IF EXISTS claims;`);
      db.run(`
        CREATE TABLE claims (
          recordid INTEGER PRIMARY KEY,
          claim_money REAL,
          invoice_number INTEGER,
          invoice_number_original_budget REAL
        );
      `);

      // Prepare values for insertion, converting to numbers and handling empty strings
      const insertStmt = db.prepare(`
        INSERT INTO claims (recordid, claim_money, invoice_number, invoice_number_original_budget)
        VALUES (?, ?, ?, ?);
      `);

      rawData.forEach(row => {
        insertStmt.run([
          row.recordid,
          parseFloat(row.claim_money),
          row.invoice_number,
          row.invoice_number_original_budget === ""
            ? null
            : parseFloat(row.invoice_number_original_budget)
        ]);
      });
      insertStmt.free(); // Release the prepared statement

      // SQL Query with Window Function
      const query = `
        SELECT
          c.recordid,
          c.claim_money,
          c.invoice_number,
          c.invoice_number_original_budget,
          SUM(c.claim_money) OVER (PARTITION BY c.invoice_number) AS total_claim_money,
          CASE
            WHEN c.invoice_number_original_budget IS NOT NULL AND
                 SUM(c.claim_money) OVER (PARTITION BY c.invoice_number) > c.invoice_number_original_budget
            THEN 1
            ELSE 0
          END AS overbudget
        FROM claims AS c
        ORDER BY c.recordid;
      `;

      const res = db.exec(query);

      if (res.length > 0) {
        const columns = res[0].columns;
        const values = res[0].values;
        const formattedResults = values.map(row => {
          const rowObject = {};
          columns.forEach((col, i) => {
            rowObject[col] = row[i]
          }
          //   rowObject[col] = (col === 'claim_money' && typeof row[i] === 'number')
          //                     ? String(row[i])
          //                     : row[i];

          //   if (col === 'invoice_number_original_budget' && rowObject.recordid === 5) {
          //     rowObject[col] = '';
          //   } else if (col === 'invoice_number_original_budget' && row[i] === null) {
          //       rowObject[col] = ''; 
          //   }
          // }
        )
        ;
          return rowObject;
        });
        console.log(formattedResults)
        setAdjustedData(formattedResults);
      } else {
        setAdjustedData([]);
      }
    } catch (processErr) {
      console.error("Error processing data:", processErr);
      setError("Failed to process data. Check console for details.");
    } finally {
      setProcessingData(false);
    }
  } // Dependencies: db instance and rawData

  const handleProcessButtonClick = () => {
    processClaims();
  };

  // --- Render Logic ---
  if (loadingDb || loadingApi) {
    return <div>{loadingDb ? "Loading database..." : "Fetching raw data..."}</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Invoice Claims Processor</h1>

      <button onClick={handleProcessButtonClick} disabled={processingData || rawData.length === 0}>
        {processingData ? "Processing..." : "Process Claims"}
      </button>

      <h2>Raw Data (from API)</h2>
      {rawData.length > 0 ? (
        <pre>{JSON.stringify(rawData, null, 2)}</pre>
      ) : (
        <p>No raw data fetched yet.</p>
      )}

      <h2>Adjusted Data (Processed)</h2>
      {adjustedData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Claim Money</th>
              <th>Invoice Number</th>
              <th>Original Budget</th>
              <th>Total Claim Money</th>
              <th>Overbudget</th>
            </tr>
          </thead>
          <tbody>
            {adjustedData.map((row) => (
              <tr key={row.recordid}>
                <td>{row.recordid}</td>
                <td>{row.claim_money}</td>
                <td>{row.invoice_number}</td>
                <td>{row.invoice_number_original_budget !== null ? row.invoice_number_original_budget : ''}</td>
                <td>{row.total_claim_money}</td>
                <td>{row.overbudget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Click "Process Claims" to see adjusted data.</p>
      )}
    </div>
  );
}

export default InvoiceClaimsProcessor;