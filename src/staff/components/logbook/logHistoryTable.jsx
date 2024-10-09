import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import { supabase } from "../../components/helper/supabaseClient";
import './logHistoryTable.scss';

const LogHistoryTable = ({ logData, showWindowColumn, onDataChange, updateLogData }) => {

    const [editingLog, setEditingLog] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;
    const [localLogData, setLocalLogData] = useState(logData);


    useEffect(() => {
        setLocalLogData(logData);
    }, [logData]);

    const pageCount = Math.ceil(localLogData.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = currentPage * itemsPerPage;
    const displayItems = localLogData.slice(indexOfFirstItem, indexOfLastItem);

    const handleEditClick = (log) => {
        setEditingLog({ ...log });
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

   
    const confirmDelete = useCallback(async () => {
        try {
            const { error } = await supabase
                .from('log_history')
                .delete()
                .eq('id', deleteId);
            
            if (error) throw error;
        
            const updatedData = localLogData.filter(log => log.id !== deleteId);
            setLocalLogData(updatedData);
            onDataChange(updatedData);
        } catch (error) {
            console.error('Error deleting log:', error);
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    }, [deleteId, localLogData, onDataChange]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditingLog(prevLog => ({
            ...prevLog,
            [name]: value
        }));
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('log_history')
                .update(editingLog)
                .eq('id', editingLog.id)
                .select();
        
            if (error) throw error;
            if (!data || data.length === 0) throw new Error('No data returned after update');
        
            const updatedData = localLogData.map(log => 
                log.id === editingLog.id ? data[0] : log
              );
              setLocalLogData(updatedData);
              updateLogData(updatedData);
              onDataChange(updatedData);
              setHighlightedRowId(editingLog.id); // highlight the row after saving
              setTimeout(() => setHighlightedRowId(null), 2000); // highlight for 2 seconds
              
            } catch (error) {
              console.error('Error updating log:', error);
            } finally {
              setEditingLog(null);
            }
          }, [editingLog, localLogData, onDataChange, updateLogData]);
    
    return (
        <div className="log-history-container">
          
            <div className="log-table-container">
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Queue No.</th>
                            {showWindowColumn && <th>Window No.</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((log) => (
                            <tr key={log.id}>
                                <td>{log.transaction_date}</td>
                                <td>{log.name}</td>
                                <td>{log.purpose}</td>
                                <td><a href="#">{log.queue_no}</a></td>
                                {showWindowColumn && <td>{log.window_no}</td>}
                                <td className="actions-column">
                                    <button className="action-btn edit" onClick={() => handleEditClick(log)} title="Edit">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClick(log.id)} title="Delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-container">
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            
                <div className="entries">
                    {`${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, localLogData.length)} of ${localLogData.length} entries`}
                </div>
            </div>    
            {editingLog && (
                <div className="modal edit-modal">
                    <div className="modal-content">
                        <h2><FontAwesomeIcon icon={faEdit} /> Edit Log Entry</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <label>
                                Date:
                                <input type="text" name="transaction_date" value={editingLog.transaction_date} readOnly onChange={handleChange} required />
                            </label>
                            <label>
                                Name:
                                <input type="text" name="name" value={editingLog.name} onChange={handleChange} required />
                            </label>
                            <label>
                                Purpose:
                                <input type="text" name="purpose" value={editingLog.purpose} readOnly onChange={handleChange} required />
                            </label>
                            <label>
                                Queue No:
                                <input type="text" name="queue_no" value={editingLog.queue_no} readOnly onChange={handleChange} required />
                            </label>
                            <label>
                                Window No:
                                <input type="text" name="window_no" value={editingLog.window_no} readOnly onChange={handleChange} required />
                            </label>
                            <div className="button-group">
                                <button type="submit" className="save-btn">Save</button>
                                <button type="button" className="cancel-btn" onClick={() => setEditingLog(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal delete-modal">
                    <div className="modal-content">
                        <h2 style={{ color: 'red' }}>
                            <FontAwesomeIcon icon={faTrash} /> Delete Entry
                        </h2>                   
                        <p>Are you sure you want to delete this entry?</p>
                        <div className="button-group">
                            <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="delete-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

LogHistoryTable.propTypes = {
    logData: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        transaction_date: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        purpose: PropTypes.string.isRequired,
        queue_no: PropTypes.string.isRequired,
        window_no: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    showWindowColumn: PropTypes.bool.isRequired,
    onDataChange: PropTypes.func.isRequired,
};

export default LogHistoryTable;