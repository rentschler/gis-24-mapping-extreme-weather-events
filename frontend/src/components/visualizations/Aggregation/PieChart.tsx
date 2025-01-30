import {useEffect, useRef} from "react";
import * as d3 from "d3";
import { MeteorologicalEventRecord } from "../../../types/response";

interface PieChartProps {
    points:  MeteorologicalEventRecord[]
}
const PieChart = ({points}:PieChartProps) => {
    const donutRef = useRef<SVGSVGElement | null>(null);

    // add donut chart
        useEffect(() => {
        if (!points || points.length === 0) return;
        const donutData = [
            {
              label: "Small",
              value: points.filter((p) => p.event.impacts && p.event.impacts.length <= 2).length,
            },
            {
              label: "Medium",
              value: points.filter(
                (p) => p.event.impacts && p.event.impacts.length > 2 && p.event.impacts.length <= 4
              ).length,
            },
            {
              label: "Large",
              value: points.filter((p) => p.event.impacts && p.event.impacts.length > 4).length,
            },
          ];


        const donutMargin = { top: 20, right: 0, bottom: 20, left: 20 };
        const donutWidth = 500 - donutMargin.left - donutMargin.right;
        const donutHeight = 500 - donutMargin.top - donutMargin.bottom;


        // const arc = d3.arc().outerRadius(radius).innerRadius(radius - 30);
        const pie = d3.pie<{ label: string; value: number }>().value((d) => d.value);
        // const pie = d3.pie().value((d: any) => d[1]);

        const svgDonut = d3
            .select(donutRef.current)
            .attr("width", donutWidth + donutMargin.left + donutMargin.right)
            .attr("height", donutHeight + donutMargin.top + donutMargin.bottom)
            .append("g")
            .attr("transform", `translate(60,50)`);


        // Create an arc generator with appropriate typing
        const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
            .innerRadius(30) // Set inner radius for a donut chart
            .outerRadius(50); // Set outer radius for the donut chart

        svgDonut
            .selectAll(".arc")
            .data(pie(donutData))
            .enter()
            .append("g")
            .attr("class", "arc")
            .append("path")
            .attr("d", arc)
            .attr("fill", (_, i) => (i === 0 ? "yellow" : i === 1 ? "orange" : "red"));

        // Add labels inside the donut chart
        svgDonut
            .selectAll(".label")
            .data(pie(donutData))
            .enter()
            .append("text")
            .attr("transform", (d: any) => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("fill", "black")
            .text((d) => `${d.data.value}`);

    }, [points])
    return <>
        <svg
            ref={donutRef}
            style={{width: "120px", height: "auto"}}
        ></svg>
    </>
}
export default PieChart