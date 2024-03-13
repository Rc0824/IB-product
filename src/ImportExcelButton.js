import React from 'react';
import * as XLSX from 'xlsx';

export class ImportExcelButton extends React.Component {
  handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (excelData.length > 0) {
        excelData.splice(0, 1);
      }

      // Send the data to the backend API
      fetch('http://localhost:5037/api/IBproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(excelData) // Assuming the backend API can handle this data format
      })
      .then(response => response.json())
      .then(data => {
        console.log(data); // The response from the backend
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };

    reader.readAsArrayBuffer(file);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
      </div>
    );
  }
}

export default ImportExcelButton;
