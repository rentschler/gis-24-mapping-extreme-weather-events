import {useEffect, useMemo, useRef, useState} from "react";
import * as d3 from "d3";
import {MeteorologicalEventRecord} from "../../../types/response";
import AggregationLegend from "./AggregationLegend.tsx";

interface PieChartProps {
    points: MeteorologicalEventRecord[],
    impactType?: boolean
}

export interface DonutData {
    label: string;
    value: number;
    color: string;
}

const PieChart = ({points, impactType = true}: PieChartProps) => {
    const donutRef = useRef<SVGSVGElement | null>(null);
    const [hasData, setHasData] = useState(false);

    const colors = !impactType ? d3.scaleOrdinal().domain(["Small", "Medium", "Large"]).range(["#98abc5", "#8a89a6", "#7b6888"]) :
        // d3.scaleOrdinal().domain(["Small", "Medium", "Large"]).range(["#d0743c", "#ff8c00", "#a05d56"]);
        d3.scaleOrdinal().domain(["Small", "Medium", "Large"]).range(["#d0743c", "#ff8c00", "#a05d56"]);

    const donutData = useMemo(() => {
        return [
            {
                label: "Small",
                value: impactType ?
                    points.filter((p) => p.event.impacts && p.event.impacts.length <= 2).length
                    : points.filter((p) => p.event.precipitation_amount && p.event.precipitation_amount <= 50).length,
                color: colors("Small") as string
            },
            {
                label: "Medium",
                value: impactType ?
                    points.filter(
                        (p) => p.event.impacts && p.event.impacts.length > 2 && p.event.impacts.length <= 4
                    ).length :
                    points.filter((p) => p.event.precipitation_amount && p.event.precipitation_amount > 50 && p.event.precipitation_amount <= 100).length,
                color: colors("Medium") as string
            },
            {
                label: "Large",
                value: impactType ?
                    points.filter((p) => p.event.impacts && p.event.impacts.length > 4).length :
                    points.filter((p) => p.event.precipitation_amount && p.event.precipitation_amount > 100).length,
                color: colors("Large") as string
            },
        ]
    }, [impactType, points, colors]);


// add donut chart
    useEffect(() => {
        if (!points || points.length === 0) return;

        const filtered = donutData.filter((data) => data.value > 0);
        if (filtered.length === 0) return;


        if (donutData.length === 0) return setHasData(false)
        setHasData(true)


        const donutMargin = {top: 120, right: 100, bottom: 20, left: 20};
        const donutWidth = 500 - donutMargin.left - donutMargin.right;
        const donutHeight = 500 - donutMargin.top - donutMargin.bottom;


        // const arc = d3.arc().outerRadius(radius).innerRadius(radius - 30);
        const pie = d3.pie<DonutData>().value((d) => d.value);
        // const pie = d3.pie().value((d: any) => d[1]);

        const svgDonut = d3
            .select(donutRef.current)
            .attr("width", donutWidth + donutMargin.left + donutMargin.right)
            .attr("height", donutHeight + donutMargin.top + donutMargin.bottom)
            .append("g")
            .attr("transform", `translate(60,50)`);


        // Create an arc generator with appropriate typing
        const arc = d3.arc<d3.PieArcDatum<DonutData>>()
            .innerRadius(30) // Set inner radius for a donut chart
            .outerRadius(50); // Set outer radius for the donut chart

        svgDonut
            .selectAll(".arc")
            .data(pie(filtered))
            .enter()
            .append("g")
            .attr("class", "arc")
            .append("path")
            .attr("d", arc)
            .attr("fill", (d) => d.data.color);

        // Add labels inside the donut chart
        svgDonut
            .selectAll(".label")
            .data(pie(filtered))
            .enter()
            .append("text")
            .attr("transform", (d: any) => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("fill", "black")
            .text((d) => `${d.data.value}`);

        return () => {
            svgDonut.selectAll("*").remove();
        };

    }, [colors, impactType, points]);


    return (
        <div className={"d-flex flex-column gap-1"}>
            {impactType ?
                hasData ? <p className={"m-0 text-center fw-bold"}>Impact Distribution</p> : <p>No Impact Data</p>
                : hasData ? <p className={"m-0 text-center fw-bold"}>Precipitation Distribution</p> :
                    <p>No Precipitation Data</p>}
            <div className={"d-flex flex-row gap-1 align-items-center"}>
                <svg
                    ref={donutRef}
                    style={{width: "120px", height: "auto"}}
                ></svg>
                <AggregationLegend donutData={donutData}/>
            </div>
        </div>
    )
}
export default PieChart