import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons"; // Add faEye for the button icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import ReactPaginate from "react-paginate";
import { supabase } from "../../components/helper/supabaseClient";
import "./logHistoryTable.scss";

const LogHistoryTable = ({ logData, onDataChange, updateLogData }) => {
    const [editingLog, setEditingLog] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;
    const [localLogData, setLocalLogData] = useState(logData);
    const navigate = useNavigate(); // Initialize navigate for redirection

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
                .from("log_history")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;

            const updatedData = localLogData.filter((log) => log.id !== deleteId);
            setLocalLogData(updatedData);
            onDataChange(updatedData);
        } catch (error) {
            console.error("Error deleting log:", error);
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    }, [deleteId, localLogData, onDataChange]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditingLog((prevLog) => ({
            ...prevLog,
            [name]: value,
        }));
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("log_history")
                .update(editingLog)
                .eq("id", editingLog.id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("No data returned after update");

            const updatedData = localLogData.map((log) =>
                log.id === editingLog.id ? data[0] : log
            );
            setLocalLogData(updatedData);
            updateLogData(updatedData);
            onDataChange(updatedData);
        } catch (error) {
            console.error("Error updating log:", error);
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
                            <th>Window No.</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((log) => (
                            <tr key={log.id}>
                                <td>{log.transaction_date}</td>
                                <td>{log.name}</td>
                                <td>{log.purpose}</td>
                                <td>
                                    <a href="#">{log.queue_no}</a>
                                </td>
                                <td>{log.window_no}</td>
                                <td className="actions-column">
                                    <button
                                        className="action-btn edit"
                                        onClick={() => handleEditClick(log)}
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDeleteClick(log.id)}
                                        title="Delete"
                                    >
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
                    {`${indexOfFirstItem + 1}-${Math.min(
                        indexOfLastItem,
                        localLogData.length
                    )} of ${localLogData.length} entries`}
                </div>
            </div>


            {/* Existing modals and functionalities */}
            {editingLog && (
                <div className="modal edit-modal">
                    {/* Edit modal content */}
                </div>
            )}
            {showDeleteConfirm && (
                <div className="modal delete-modal">
                    {/* Delete modal content */}
                </div>
            )}
        </div>
    );
};

LogHistoryTable.propTypes = {
    logData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            transaction_date: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            purpose: PropTypes.string.isRequired,
            queue_no: PropTypes.string.isRequired,
            window_no: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    onDataChange: PropTypes.func.isRequired,
};

export default LogHistoryTable;
