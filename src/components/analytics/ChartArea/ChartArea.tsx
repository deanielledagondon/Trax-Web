import BarChartBox from "../barChartBox/BarChartBox";
import React from "react";
import BigChartBox from "../bigChartBox/BigChartBox";
import ChartBox from "../chartBox/ChartBox";
import TopBox from "../topBox/TopBox"
import PieChartBox from "../pieCartBox/PieChartBox";
import AreaTable from "../../dashboard/areaTable/AreaTable";
import CurrentQueue from "../../../screens/queue/CurrentQueue";
import AreaBarChart from "../../dashboard/areaCharts/AreaBarChart";
import {
  barChartBoxRevenue,
  barChartBoxVisit,
  chartBoxConversion,
  chartBoxProduct,
  chartBoxRevenue,
  chartBoxUser,
} from "../data";
import "./ChartArea.scss";

const ChartArea= () => {
  return (
    <div className="home">
      <div className="box box1">
      
      <CurrentQueue />
      </div>

      <div className= "Chartbox1">
      <div className="box box2">
        <ChartBox  icon={""} {...chartBoxUser} />
      </div>
      <div className="box box3">
        <ChartBox icon={""} {...chartBoxProduct} />
      </div>
      <div className="box box4">
        <ChartBox icon={""} {...chartBoxConversion} />
      </div>
      <div className="box box5">
      <ChartBox  icon={""} {...chartBoxRevenue} />
      </div>
     
    </div>
    <div className="box box3">
        <TopBox/>
      </div>
      <div className="box box6">
      <AreaBarChart />
      </div>
      <div className="box box7">
       <AreaTable/>
      </div>
      <div className="box box8">
      <PieChartBox />
      </div>
      <div className="box box9">
      <BarChartBox {...barChartBoxRevenue} />
      </div>

      <div className="box box11">
       <BigChartBox />
      </div>
      <div className="box box12">
     
      </div>
    </div>
  );
};

export default ChartArea;
