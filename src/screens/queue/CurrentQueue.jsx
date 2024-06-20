
const mockQueue = [
  {
    date: '6-18-24',
    name: "Jon Snow",
    purpose: "Enrollment",
    queueNo: 'W1001'
  },
  {
    date: '6-18-24',
    name: "Cersei Lannister",
    purpose: "Accreditation",
    queueNo: 'W1002'
  },
  {
    date: '6-18-24',
    name: "Jaime Lannister",
    purpose: "Transferee",
    queueNo: 'W1003'
  },
  {
    date: '6-18-24',
    name: "Anya Stark",
    purpose: "Graduation",
    queueNo: 'W1004'
  },
  {
    date: '6-18-24',
    name: "Daenerys Targaryen",
    purpose: "Graduation",
    queueNo: 'W1005'
  },
  {
    date: '6-18-24',
    name: "Ever Melisandre",
    purpose: "Graduation",
    queueNo: 'W1006'
  },
  {
    date: '6-18-24',
    name: "Ferrara Clifford",
    purpose: "Graduation",
    queueNo: 'W1006'
  },
  {
    date: '6-18-24',
    name: "Rossini Frances",
    purpose: "Graduation",
    queueNo: 'W1007'
  },
  {
    date: '6-18-24',
    name: "Harvey Roxie",
    purpose: "Graduation",
    queueNo: 'W1008'
  },
  {
    date: '6-18-24',
    name: "Abby Frances",
    purpose: "Graduation",
    queueNo: 'W1009'
  },
  {
    date: '6-18-24',
    name: "Klaus Mikaelson",
    purpose: "Graduation",
    queueNo: 'W10010'
  },
];

const CurrentQueue = () => {
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Current Queue</h4>
      </div>
      <div className="progress-bar-list">
        {mockQueue?.map((item) => (
          <div className="progress-bar-item" key={item.name}>
            <div className="bar-item-info">
              <p className="bar-item-info-value">{item.queueNo}</p>
              <p className="bar-item-info-name">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentQueue;
