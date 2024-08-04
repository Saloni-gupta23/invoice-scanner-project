import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import { db } from './firebase'; // Ensure this is correctly pointing to your Firebase config
import { ref, set } from 'firebase/database'; // Ensure these are correctly imported

function App() {
    const [data, setData] = useState(null);
    const [displayTable, setDisplayTable] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = {
                billTo: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "A5:A10" }).map(item => item[0]),
                invoiceNumber: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F5:F5" })[0][0],
                date: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "H5:H5" })[0][0],
                customerId: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F8:F8" })[0][0],
                terms: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "H8:H8" })[0][0],
                description: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "A16:A18" }).map(item => item[0]),
                qty: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F16:F17" }).map(item => item[0]),
                unitPrice: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "G16:G18" }).map(item => item[0]),
                amount: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "H16:H18" }).map(item => item[0]),
                extraDescription: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "A31:A31" })[0][0],
                subtotal: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F31:F31" })[0][0],
                taxRate: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F32:F32" })[0][0],
                tax: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F33:F33" })[0][0],
                total: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "F34:F34" })[0][0],
                extraAmount: XLSX.utils.sheet_to_json(worksheet, { header: 1, range: "H31:H34" }).map(item => item[0])
            };
            setData(data);
        };

        reader.readAsBinaryString(file);
    };

    const handleUploadClick = () => {
        setDisplayTable(true);
    };

    const saveToFirebase = () => {
        if (data) {
            const dataRef = ref(db, 'invoices/' + data.invoiceNumber); // Save using Invoice Number as the key
            set(dataRef, data)
                .then(() => {
                    alert('Data saved to Firebase!');
                })
                .catch((error) => {
                    alert('Error saving data: ' + error.message);
                });
        }
    };

    return (
        <div className="App">
            <h1>INVOICE SCANNER</h1>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button onClick={handleUploadClick}>Upload</button>

            {displayTable && data && (
                <>
                    <h2>INVOICE DETAILS</h2>
                    <table className="invoice-details">
                        <tbody>
                            <tr>
                                <th>BILL TO</th>
                                <td>{data.billTo.join(", ")}</td>
                            </tr>
                            <tr>
                                <th>INVOICE NUMBER</th>
                                <td>{data.invoiceNumber}</td>
                            </tr>
                            <tr>
                                <th>DATE</th>
                                <td>{data.date}</td>
                            </tr>
                            <tr>
                                <th>CUSTOMER ID</th>
                                <td>{data.customerId}</td>
                            </tr>
                            <tr>
                                <th>TERMS</th>
                                <td>{data.terms}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>INVOICE ITEMS</h2>
                    <table className="invoice-items">
                        <thead>
                            <tr>
                                <th>DESCRIPTION</th>
                                <th>QUANTITY</th>
                                <th>UNIT PRICE</th>
                                <th>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.description.map((desc, index) => (
                                <tr key={index}>
                                    <td>{desc}</td>
                                    <td>{data.qty[index] || ""}</td>
                                    <td>{data.unitPrice[index] || ""}</td>
                                    <td>{data.amount[index] || ""}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>{data.extraDescription}</td>
                                <td colSpan="2">
                                    {data.subtotal} <br />
                                    {data.taxRate} <br />
                                    {data.tax} <br />
                                    {data.total}
                                </td>
                                <td>
                                    {data.extraAmount.map((amt, index) => (
                                        <div key={index}>{amt}</div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

            <button onClick={saveToFirebase}>Save to Firebase</button>
        </div>
    );
}

export default App;
