import React from "react";
import LogHistoryTable from '../../components/logbook/logHistoryTable'
import './logHistory.scss'
const LogHistory = () => {
  const data = [
    { date: "5-13-24", name: "Mikaelson, Elijah", purpose: "Graduation", priority: "W1007" },
    { date: "5-13-24", name: "Mikaelson, Klaus", purpose: "Transfer", priority: "W1006" },
    { date: "5-13-24", name: "Sanderson, Jeremy", purpose: "Graduation", priority: "W1005" },
    { date: "5-13-24", name: "Hamilton, Lexi", purpose: "Enrollment", priority: "W1004" },
    { date: "5-13-24", name: "Domingo, Elena", purpose: "Transfer", priority: "W1003" },
    { date: "5-13-24", name: "Bennett, Bonnie", purpose: "Graduation", priority: "W1002" },
    { date: "5-13-24", name: "Claire, Kol", purpose: "Enrollment", priority: "W1001" }
  ];
  return (

    <LogHistoryTable logData={data} />

  )
}

export default LogHistory