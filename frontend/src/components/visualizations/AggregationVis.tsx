
import { MeteorologicalEventRecord } from "../../types/response";
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { useDimensions } from "../helper/useDimensions";
const AggregationData: React.FC<{
    points: MeteorologicalEventRecord[];
}> = ({ points }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const svgLegend = useRef<SVGSVGElement | null>(null);
    const donutRef = useRef<SVGSVGElement | null>(null);
    if (!points || points.length === 0) return;

    const containerRef = useRef<HTMLDivElement>(null);
    const dimensions = useDimensions(containerRef);

    // adds the scatterplot 
    useEffect(() => {
        if (!points || points.length === 0) return;

        const margin = { top: 20, right: 100, bottom: 40, left: 60 };
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

    }, [points]);

    // Adds the donut chart
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

    }, [points]);

    // Adds the legend
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
        // Create legend
        const svg_legend = d3.select(svgLegend.current).append("g");

        // Add legend for impacts
        svg_legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 6)
            .attr("fill", "blue");

        svg_legend
            .append("text")
            .attr("x", 30)
            .attr("y", 14)
            .text("Impacts")
            .attr("font-size", "12px")
            .attr("text-anchor", "start");

        // Add legend for precipitation
        svg_legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 30)
            .attr("r", 6)
            .attr("fill", "green");

        svg_legend
            .append("text")
            .attr("x", 30)
            .attr("y", 34)
            .text("Precipitation")
            .attr("font-size", "12px")
            .attr("text-anchor", "start");
        console.log("Donut Data", donutData);

        donutData.forEach((data, value) => {
            var color = "yellow";

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
    }, []);

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
               width: "950px",
               borderRadius: "8px",
               height: "auto", // Let content adjust dynamically
               display: "flex", // Use flexbox for layout
               flexDirection: "column", // Stack elements vertically
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "black",
            }}
        >
            <p style={{ margin: "0", fontSize: "14px" }}>
                <strong>Total Points: </strong> {points.length}
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row", // Align chart and legend/scatter horizontally
                    justifyContent: "space-between",
                    width: "100%", // Ensure it takes full width
                }}
                ref={containerRef}
            >
                {/* Scatterplot */}
                <svg ref={svgRef} style={{ flex: 1, marginRight: "20px" }}></svg>

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
                    <svg
                        ref={svgLegend}
                        style={{ width: "120px", height: "auto", marginBottom: "10px" }} // Add space between legend and donut
                    ></svg>

                    {/* Donut Chart */}
                    <svg
                        ref={donutRef}
                        style={{ width: "120px", height: "auto" }}
                    ></svg>
                </div>
            </div>
        </div>
    );
};



export default AggregationData;