import { MeteorologicalEventRecord } from "../../../types/response.ts";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface AggregationLegendProps {
    points: MeteorologicalEventRecord[]
}

const AggregationLegend = ({ points }: AggregationLegendProps) => {
    const svgLegend = useRef<SVGSVGElement | null>(null);


    // add the legend
    useEffect(() => {
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

        const filtered = donutData.filter((d) => d.value > 0);

        if (filtered.length === 0) return;

        // Create legend
        const svg_legend = d3.select(svgLegend.current).append("g");

        // Add legend for impacts
        // svg_legend
        //     .append("circle")
        //     .attr("cx", 10)
        //     .attr("cy", 10)
        //     .attr("r", 6)
        //     .attr("fill", "blue");

        // svg_legend
        //     .append("text")
        //     .attr("x", 30)
        //     .attr("y", 14)
        //     .text("Impacts")
        //     .attr("font-size", "12px")
        //     .attr("text-anchor", "start");

        // // Add legend for precipitation
        // svg_legend
        //     .append("circle")
        //     .attr("cx", 10)
        //     .attr("cy", 30)
        //     .attr("r", 6)
        //     .attr("fill", "green");

        // svg_legend
        //     .append("text")
        //     .attr("x", 30)
        //     .attr("y", 34)
        //     .text("Precipitation")
        //     .attr("font-size", "12px")
        //     .attr("text-anchor", "start");
        // console.log("Donut Data", donutData);

        donutData.forEach((data, value) => {
            let color = "yellow";

            if (data.label == "Medium") {
                color = "orange";
            } else if (data.label == "Large") {
                color = "red";
            }
            svg_legend
                .append("circle")
                .attr("cx", 10)
                .attr("cy", 55 + value * 20)
                .attr("r", 6)
                .attr("fill", `${color}`);

            svg_legend
                .append("text")
                .attr("x", 30)
                .attr("y", 55 + value * 20)
                .text(`${data.label}`)
                .attr("font-size", "12px")
                .attr("text-anchor", "start");
        });

        return () => {
            svg_legend.remove();
        };
    }, [])

    return <>
        <svg
            ref={svgLegend}
            style={{ width: "80px", height: "auto", marginBottom: "10px" }} // Add space between legend and donut
        ></svg>
    </>
}
export default AggregationLegend