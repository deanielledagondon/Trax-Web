import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { supabase } from "../../components/helper/supabaseClient"; // Ensure the path is correct
import "./logHistoryTable.scss";

const LogHistoryTable = ({ logData, onDataChange, updateLogData }) => {
    const [localLogData, setLocalLogData] = useState(logData);
    const [currentPage, setCurrentPage] = useState(0);
    const [editingLog, setEditingLog] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [highlightedRowId, setHighlightedRowId] = useState(null); // Highlight logic
    const itemsPerPage = 20;

    useEffect(() => {
        setLocalLogData(logData);
    }, [logData]);

    const pageCount = localLogData.length > 0 ? Math.ceil(localLogData.length / itemsPerPage) : 1;

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
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingLog((prevLog) => ({
            ...prevLog,
            [name]: value,
        }));
    };

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
            setHighlightedRowId(editingLog.id); // Highlight the updated row
            setTimeout(() => setHighlightedRowId(null), 2000); // Remove highlight after 2 seconds
        } catch (error) {
            console.error("Error updating log:", error);
        } finally {
            setEditingLog(null);
        }
    }, [editingLog, localLogData, onDataChange, updateLogData]);

    const confirmDelete = useCallback(async () => {
        if (!deletingId) return;

        try {
            const { error } = await supabase
                .from("log_history")
                .delete()
                .eq("id", deletingId);

            if (error) throw error;

            const updatedData = localLogData.filter((log) => log.id !== deletingId);
            setLocalLogData(updatedData);
            onDataChange(updatedData);
        } catch (error) {
            console.error("Error deleting log:", error);
        } finally {
            setShowDeleteConfirm(false);
            setDeletingId(null);
        }
    }, [deletingId, localLogData, onDataChange]);

    const formatDateToLocal = (utcDate) => {
        const localDate = new Date(utcDate);
        return localDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="log-history-container">
            <div className="log-table-container">
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Reason</th>
                            <th>Window No.</th>
                            <th>Queue No.</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((log) => (
                            <tr
                                key={log.id}
                                className={log.id === highlightedRowId ? "highlight-row" : ""}
                            >
                                <td>{formatDateToLocal(log.created_at)}</td>
                                <td>{log.name}</td>
                                <td>{log.purpose}</td>
                                <td>{log.reason || "N/A"}</td>
                                <td>{log.window_no}</td>
                                <td>
                                    <a href="#">{log.queue_no}</a>
                                </td>
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

            {editingLog && (
                <div className="edit-log-modal">
                    <div className="edit-log-content">
                        <h2>
                            <FontAwesomeIcon icon={faEdit} /> Edit Log Entry
                        </h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                Date:
                                <input
                                    type="text"
                                    name="created_at"
                                    value={formatDateToLocal(editingLog.created_at)}
                                    readOnly
                                />
                            </label>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={editingLog.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Purpose:
                                <input
                                    type="text"
                                    name="purpose"
                                    value={editingLog.purpose}
                                    readOnly
                                />
                            </label>
                            <label>
                                Queue No:
                                <input
                                    className="queue-label"
                                    type="text"
                                    name="queue_no"
                                    value={editingLog.queue_no}
                                    readOnly
                                />
                            </label>
                            <label>
                                Window No:
                                <input
                                    type="text"
                                    name="window_no"
                                    value={editingLog.window_no}
                                    readOnly
                                />
                            </label>
                            <div className="button-group">
                                <button
                                    type="button"
                                    className="save-button"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="save-cancel-btn"
                                    onClick={() => setEditingLog(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="delete-log-modal">
                    <div className="delete-log-content">
                        <h2>
                            <FontAwesomeIcon icon={faTrash} /> Delete Entry
                        </h2>
                        <p>Are you sure you want to delete this entry?</p>
                        <div className="button-group">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-btn"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

LogHistoryTable.propTypes = {
    logData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            created_at: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            purpose: PropTypes.string.isRequired,
            reason: PropTypes.string,
            window_no: PropTypes.string.isRequired,
            queue_no: PropTypes.string.isRequired,
        })
    ).isRequired,
    onDataChange: PropTypes.func.isRequired,
    updateLogData: PropTypes.func.isRequired,
};

export default LogHistoryTable;
