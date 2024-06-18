import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { mockDataRegistrants } from '../Components/Data/mockData'; // Import mockDataRegistrants from mockData.js

const DataTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Purpose</TableCell>
            <TableCell>Window No.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockDataRegistrants.map((row) => ( // Map over mockDataRegistrants
            <TableRow key={row.name}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.purpose}</TableCell>
              <TableCell>{row.windowNo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
