import React from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import './logHistoryTable.scss';

const LogHistoryTable = ({ logData }) => {
    return (
        <div className="log-history-container">
            <h1 className="log-history-title">Log History</h1>
            <div className="filters">
                <span>Filter by:</span>
                <button>Date</button>
                <button>All</button>
                <select>
                    <option value="college">College</option>
                </select>
                <select>
                    <option value="purpose">Purpose Type</option>
                </select>
                <input type="text" placeholder="Search ID Number" />
            </div>
            <div className="log-table-container">

                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Priority No.</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.map((log, index) => (
                            <tr key={index}>
                                <td>{log.date}</td>
                                <td>{log.name}</td>
                                <td>{log.purpose}</td>
                                <td><a href="#">{log.priority}</a></td>
                                <td className="actions-column">
                                    <button className="action-btn notify">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button className="action-btn delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="entries">1 of 1 entries</div>
        </div>
    );
};

LogHistoryTable.propTypes = {
    logData: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        purpose: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
    }).isRequired).isRequired
};

export default LogHistoryTable;
