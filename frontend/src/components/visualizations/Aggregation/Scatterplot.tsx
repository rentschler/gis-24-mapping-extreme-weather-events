import {useEffect, useRef} from "react";
import * as d3 from "d3";
import { MeteorologicalEventRecord } from "../../../types/response";

interface ScatterplotProps {
    points:  MeteorologicalEventRecord[]
}

const Scatterplot = ({points}: ScatterplotProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    // draw scatterplot
    useEffect(() => {
        if (!points || points.length === 0) return;

        const margin = {top: 20, right: 100, bottom: 40, left: 60};
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Filter out points with undefined precipitation amount
        const impact_points = points.map((point) => ({
            time: new Date(point.event.time_event),
            impacts: point.event.impacts?.length || 0
        }));

        const precipitation_points = points.map((point) => ({
            time: new Date(point.event.time_event),
            precipitation: point.event.precipitation_amount,
        }))
            .filter((d) => d.precipitation !== null); // Filter out undefined precipitation values


        // Scales
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(impact_points, (d) => d.time) as [Date, Date])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(impact_points, (d) => d.impacts) || 0])
            .range([height, 0]);

        const y2Scale = d3
            .scaleLinear()
            .domain([0, d3.max(precipitation_points, (d) => d.precipitation) || 0])
            .range([height, 0]);

        // Axes
        svg
            .append("g")
            .call(d3.axisLeft(yScale))
            .attr("font-size", "12px");

        svg
            .append("g")
            .call(d3.axisRight(y2Scale))
            .attr("transform", `translate(${width}, 0)`)
            .attr("font-size", "12px");

        svg
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .attr("font-size", "12px");

        // Scatterplot for impacts
        svg
            .selectAll(".impact-dot")
            .data(impact_points)
            .enter()
            .append("circle")
            .attr("class", "impact-dot")
            .attr("cx", (d) => xScale(d.time))
            .attr("cy", (d) => yScale(d.impacts))
            .attr("r", 4)
            .attr("fill", "blue");

        // Scatterplot for precipitation
        svg
            .selectAll(".precip-dot")
            .data(precipitation_points)
            .enter()
            .append("circle")
            .attr("class", "precip-dot")
            .attr("cx", (d) => xScale(d.time))
            .attr("cy", (d) => y2Scale(d.precipitation || 0))
            .attr("r", 4)
            .attr("fill", "green");

        // Labels for the axes
        svg
            .append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom})`)
            .attr("text-anchor", "middle")
            .text("Time");

        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Number of Impacts");

        svg
            .append("text")
            .attr("transform", `rotate(-90)`)
            .attr("y", width + margin.right - 50)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Precipitation Amount");

        return () => {
            // cleanup
            svg.selectAll("*").remove();
        };

    }, [points])
    return <>
        <svg ref={svgRef} style={{flex: 1, marginRight: "20px"}}></svg>
    </>
}
export default Scatterplot