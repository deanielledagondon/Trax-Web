import React from "react";
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "ID",
  "Date",
  "Name",
  "Purpose",
  "Status",
  "Window No.",
  "Actions",
];

const TABLE_DATA = [
  {
    id: '1',
    date: '6-18-24',
    name: "A",
    purpose: "Enrollment",
    status: 'Completed',
    windowNo: 'W1001'
  },
  {
    id: 2,
    date: '6-18-24',
    name: "B",
    purpose: "Accreditation",
    status: 'Completed',
    windowNo: 'W1002'
  },
  {
    id: 3,
    date: '6-18-24',
    name: "C",
    purpose: "Transferee",
    status: 'Completed',
    windowNo: 'W1003'
  },
  {
    id: 4,
    date: '6-18-24',
    name: "D",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1004'
  },
  {
    id: 5,
    date: '6-18-24',
    name: "E",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1005'
  },
  {
    id: 6,
    date: '6-18-24',
    name: "F",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1006'
  },
  {
    id: 7,
    date: '6-18-24',
    name: "G",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1006'
  },
  {
    id: 8,
    date: '6-18-24',
    name: "H",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1007'
  },
  {
    id: 9,
    date: '6-18-24',
    name: "I",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1008'
  },
  {
    id: 10,
    date: '6-18-24',
    name: "J",
    purpose: "Graduation",
    status: 'Completed',
    windowNo: 'W1009'
  },
  {
    id: 11,
    date: '6-18-24',
    name: "K",
    purpose: "Graduation",
    status: 'Ongoing',
    windowNo: 'W10010'
  },
  {
    id: 12,
    date: '6-18-24',
    name: "L",
    purpose: "Graduation",
    status: 'Ongoing',
    windowNo: 'W10011'
  },
  {
    id: 13,
    date: '6-18-24',
    name: "M",
    purpose: "Graduation",
    status: 'Ongoing',
    windowNo: 'W50010'
  },
  {
    id: 14,
    date: '6-18-24',
    name: "N",
    purpose: "Graduation",
    status: 'Ongoing',
    windowNo: 'W60010'
  },
  {
    id: 15,
    date: '6-18-24',
    name: "O",
    purpose: "Graduation",
    status: 'Ongoing',
    windowNo: 'W20016'
  },
  {
    id: 16,
    date: '6-18-24',
    name: "P",
    purpose: "Graduation",
    status: 'Ongoing',
    windowNo: 'W10022'
  },
];

const AreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Transactions</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA.map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.id}</td>
                <td>{dataItem.date}</td>
                <td>{dataItem.name}</td>
                <td>{dataItem.purpose}</td>
                <td>
                  <div className="dt-status">
                    <span className={`dt-status-dot dot-${dataItem.status.toLowerCase()}`}></span>
                    <span className="dt-status-text">{dataItem.status}</span>
                  </div>
                </td>
                <td>{dataItem.windowNo}</td>
                <td className="dt-cell-action">
                  <AreaTableAction />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
