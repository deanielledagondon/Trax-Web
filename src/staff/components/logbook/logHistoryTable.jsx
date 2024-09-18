import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import './logHistoryTable.scss';

const LogHistoryTable = ({ logData, showWindowColumn }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [editedLog, setEditedLog] = useState({
        transaction_date: '',
        name: '',
        purpose: '',
        queue_no: '',
        window_no: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;
    const pageCount = Math.ceil(logData.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = currentPage * itemsPerPage;
    const displayItems = logData.slice(indexOfFirstItem, indexOfLastItem);

    const handleEditClick = (index, log) => {
        setEditIndex(index);
        setEditedLog(log);
    };

    const handleDeleteClick = (index) => {
        setDeleteIndex(index);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        logData.splice(deleteIndex, 1);
        setShowDeleteConfirm(false);
        setDeleteIndex(null);
        setSuccessMessage('Entry successfully deleted.');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLog(prevLog => ({
            ...prevLog,
            [name]: value
        }));
    };

    const handleSave = () => {
        logData[editIndex] = editedLog;
        setEditIndex(null);
        setSuccessMessage('Entry successfully edited.');
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div className="log-history-container">
            {successMessage && (
                <div className="success-message">
                    <FontAwesomeIcon icon={faCheckCircle} /> {successMessage}
                </div>
            )}
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
                        {displayItems.map((log, index) => (
                            <tr key={index}>
                                <td>{log.transaction_date}</td>
                                <td>{log.name}</td>
                                <td>{log.purpose}</td>
                                <td><a href="#">{log.queue_no}</a></td>
                                {showWindowColumn && <td>{log.window_no}</td>}
                                <td className="actions-column">
                                    <button className="action-btn edit" onClick={() => handleEditClick(index, log)} title="Edit">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClick(index)} title="Delete">
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
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
                <div className="entries">
                    {`${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, logData.length)} of ${logData.length} entries`}
                </div>
            </div>
            {editIndex !== null && (
                <div className="modal edit-modal">
                    <div className="modal-content">
                        <h2><FontAwesomeIcon icon={faEdit} /> Edit Log Entry</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <label>
                                Date:
                                <input type="text" name="transaction_date" value={editedLog.transaction_date} readOnly onChange={handleChange} required />
                            
                            </label>
                            <label>
                                Name:
                                <input type="text" name="name" value={editedLog.name} onChange={handleChange} required />
                            </label>
                            <label>
                                Purpose:
                                <input type="text" name="purpose" value={editedLog.purpose} readOnly onChange={handleChange} required />
                            </label>
                            <label>
                                Queue No:
                                <input type="text" name="queue_no" value={editedLog.queue_no} readOnly onChange={handleChange} required />
                            </label>
                            <label>
                                Window No:
                                <input type="text" name="window_no" value={editedLog.window_no} readOnly onChange={handleChange} required />
                            </label>
                            <div className="button-group">
                                <button type="submit" className="save-btn" >Save</button>
                                <button type="button" className="cancel-btn" onClick={() => setEditIndex(null)}>Cancel</button>
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
        date: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        purpose: PropTypes.string.isRequired,
        queue_no: PropTypes.string.isRequired,
        window: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    showWindowColumn: PropTypes.bool.isRequired,
    onUpdateLog: PropTypes.func.isRequired,
    onDeleteLog: PropTypes.func.isRequired,
};

export default LogHistoryTable;