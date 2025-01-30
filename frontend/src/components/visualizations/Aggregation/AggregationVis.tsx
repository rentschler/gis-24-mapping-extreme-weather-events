import {MeteorologicalEventRecord} from "../../../types/response.ts";
import React, {useState} from 'react';
import Scatterplot from "./Scatterplot.tsx";
import PieChart from "./PieChart.tsx";
import AggregationLegend from "./AggregationLegend.tsx";
import BarChart from "./BarChart.tsx";

const AggregationData: React.FC<{
    points: MeteorologicalEventRecord[];
    country: string;
    name: string;
}> = ({points, country, name}) => {
    const [showBarChart, setShowBarChart] = useState(true)


    if (!points || points.length < 2) return <>
        <p style={{margin: "0", fontSize: "14px"}}>
            <p>{country}: {name}</p>
        </p>
    </>
    console.log("aggregation vis", points)


    return (
        <div
            style={{/* 
                position: "absolute",
                bottom: "20px",
                left: "20px", 
                boxShadow: "0 2px 6px rgb(0, 0, 0)",
                zIndex: 1000, // Ensure the box appears above the map
                maxWidth: "1000px", // Optional: Limit width for aesthetic purposes
                gap: "10px", // Add space between chart and legend
                */

                paddingBottom: "15px",
                width: "1000px",
                borderRadius: "8px",
                height: "auto", // Let content adjust dynamically
                display: "flex", // Use flexbox for layout
                flexDirection: "column", // Stack elements vertically
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "black",
            }}
        >
            <div className={"m-1 d-flex flex-row border-bottom gap-3"}>
                <p className="h5 m-0">{country}: {name}</p>
                <p className="h5 m-0">Total Points: {points.length} </p>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row", // Align chart and legend/scatter horizontally
                    justifyContent: "space-between",
                    width: "100%", // Ensure it takes full width
                }}
            >

                {showBarChart ? <BarChart points={points}></BarChart> : <Scatterplot points={points}></Scatterplot>}


                {/* Legend and Donut Chart */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column", // Stack legend and donut vertically
                        alignItems: "center", // Center align items
                        width: "150px", // Set a fixed width for the legend/donut container
                    }}
                >
                    {/* Legend */}
                    <AggregationLegend points={points}></AggregationLegend>

                    {/* Donut Chart */}
                    <PieChart points={points}></PieChart>
                    <button className={"btn btn-primary"} onClick={() => setShowBarChart(!showBarChart)}>Toggle Chart</button>
                </div>
            </div>
        </div>
    );
};


export default AggregationData;