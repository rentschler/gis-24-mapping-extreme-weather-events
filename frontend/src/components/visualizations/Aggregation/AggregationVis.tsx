import {MeteorologicalEventRecord} from "../../../types/response.ts";
import React, {useState} from 'react';
import Scatterplot from "./Scatterplot.tsx";
import PieChart from "./PieChart.tsx";
import BarChart from "./BarChart.tsx";

const AggregationData: React.FC<{
    points: MeteorologicalEventRecord[];
    country: string;
    name: string;
}> = ({points, country, name}) => {
    const [showBarChart, setShowBarChart] = useState(true)


    if (!points || points.length < 2) return (
        // header
        <div className={" d-flex flex-row gap-3"}>
            <p className="h5 m-0  my-auto">{country}: {name}</p>
        </div>
    )

    return (
        <div
            className={"d-flex flex-column gap-1"}
        >
            {/*header*/}
            <div className={"mb-1 pb-1 d-flex flex-row border-bottom gap-3"}>
                <p className="h5 m-0  my-auto">{country}: {name}</p>
                <p className="h5 m-0  my-auto">Total Points: {points.length} </p>
                <button className={"btn btn-primary btn-sm my-auto"}
                        onClick={() => setShowBarChart(!showBarChart)}>Toggle Chart
                </button>
            </div>

            <div
                className={"d-flex flex-row gap-1"}
            >

                {showBarChart ? <BarChart points={points}></BarChart> : <Scatterplot points={points}></Scatterplot>}


                {/* Legend and Donut Chart */}
                <div
                    className={"d-flex flex-row gap-1"}
                >
                    <div className={"d-flex flex-column gap-3"}>
                        {/* Donut Chart */}
                        <PieChart points={points} impactType={true}></PieChart>
                        <PieChart points={points} impactType={false}></PieChart>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AggregationData;