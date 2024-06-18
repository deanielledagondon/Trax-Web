import React, { useState, useEffect } from 'react'; 
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material'; // Import Button from @mui/material
import { supabase } from '../Components/Helper/supabaseClient';

const DataTable = () => {
  const [logHistory, setLogHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortAscending, setSortAscending] = useState(true); // State to track sort order

  useEffect(() => {
    const fetchRegistrants = async () => {
      try {
        let { data, error } = await supabase
          .from('log_history')
          .select()
          .order('transaction_date', { ascending: sortAscending }); // Apply sorting based on sortAscending state
        console.log('data: ', data);
        if (error) {
          console.log(error);
          throw error;
        }
        setLogHistory(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRegistrants();
  }, [sortAscending]); // Include sortAscending in the dependency array to re-fetch data when sorting changes

  const handleSort = () => {
    setSortAscending((prevSort) => !prevSort); // Toggle sort direction on button click
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Button onClick={handleSort} variant="contained" color="primary">
        {sortAscending ? 'Sort Descending' : 'Sort Ascending'}
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction Date</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Window No.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.transaction_date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.purpose}</TableCell>
                <TableCell>{row.window_no}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
