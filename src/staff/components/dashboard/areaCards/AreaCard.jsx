import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import busiestWindowImage from "../../../assets/icons/overload.png";

const AreaCard = ({ colors, percentFillValue, cardInfo }) => {
  const filledValue = (percentFillValue / 100) * 360; // 360 degrees for a full circle
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Remaining", value: remainedValue },
    { name: "Achieved Transactions", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${(value / 360) * 100} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      {/* Conditionally render the image for the "Busiest Window" card */}
      {cardInfo.title === "Busiest Window" && (
        <div className="area-card-image">
          <img src={busiestWindowImage} alt="Busiest Window" />
        </div>
      )}
      {/* Conditionally render the chart only if the card is not the "Busiest Window" */}
      {cardInfo.title !== "Busiest Window" && (
        <div className="area-card-chart">
          <PieChart width={100} height={100}>
            <Pie
              data={data}
              cx={50}
              cy={45}
              innerRadius={20}
              fill="#e4e8ef"
              paddingAngle={0}
              dataKey="value"
              startAngle={-270}
              endAngle={150}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={renderTooltipContent} />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.object.isRequired,
};
