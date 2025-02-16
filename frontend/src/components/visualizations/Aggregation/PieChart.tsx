import {useEffect, useMemo, useRef, useState} from "react";
import * as d3 from "d3";
import {MeteorologicalEventRecord} from "../../../types/response";
import SvgLegend from "../../legend/SvgLegend.tsx";
import {PieArcDatum} from "d3";

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

    // Helper to extract the numeric value from a point
    const getValue = (p: MeteorologicalEventRecord) =>
        impactType ? p.event.impacts?.length || 0 : p.event.precipitation_amount || 0;

    const [minVal, maxVal] = useMemo(() => {
        return [0, Math.max(...points.map(getValue))];
    }, [getValue, points]);

    const colorScale = useMemo(() => {
        // d3.interpolateBlues for precipitation and d3.interpolateRdYlBu for impact
        return !impactType ? d3.scaleSequential(d3.interpolateBlues)
                .domain([minVal!, maxVal!]) :
            d3.scaleSequential(d3.interpolateReds)
                .domain([minVal!, maxVal!])
    }, [impactType, minVal, maxVal]);

    const donutData = useMemo(() => {
        const steps = maxVal - minVal > 5 ? 5 : maxVal - minVal;
        const stepValues = d3.range(minVal, maxVal, (maxVal - minVal) / (steps - 1)).map(value => Math.round(value))
        // Include the maxVal value as the last item in the legend.
        const allValues = stepValues.concat(maxVal);

        return allValues.map((value, index) => {
            const [min, max] = index === 0 ? [0, allValues[index]] : [allValues[index - 1], allValues[index]];
            const count = points.filter((p) => getValue(p) >= min && getValue(p) < max).length;
            const percent = count / points.length;
            return {
                label: percent > 0.05 ? `${count}` : "",
                value: count,
                color: colorScale(value)
            } as DonutData;
        });
    }, [maxVal, minVal, points, colorScale, getValue]);

    useEffect(() => {
        console.log("donutData", donutData)
    }, [donutData])


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
            .attr("fill", (d: PieArcDatum<DonutData>) => d.data.color);

        // Add labels inside the donut chart
        svgDonut
            .selectAll(".label")
            .data(pie(filtered))
            .enter()
            .append("text")
            .attr("transform", ((d: PieArcDatum<DonutData>) => `translate(${arc.centroid(d)})`))
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("fill", "black")
            .text((d: PieArcDatum<DonutData>) => `${d.data.label}`);

        return () => {
            svgDonut.selectAll("*").remove();
        };

    }, [colorScale, donutData, impactType, points]);

    if(!hasData) return <div className={"d-flex flex-column gap-3"} style={{height: "200px"}}>
        {impactType ?
            <p className={"m-0 text-center fw-bold"} style={{fontSize: "16px"}}>No Impact Data</p> :
            <p className={"m-0 text-center fw-bold"} style={{fontSize: "16px"}}>No Precipitation Data</p>}
    </div>


    return (
        <div className={"d-flex flex-column gap-3"} style={{height: "200px"}}>
            {impactType ?<p className={"m-0 text-center fw-bold"} style={{fontSize: "16px"}}>Impact Distribution</p> :
                <p className={"m-0 text-center fw-bold"} style={{fontSize: "16px"}}>Precipitation Distribution</p>
            }
            <div className={"d-flex flex-row gap-1 align-items-center"}>
                <svg
                    ref={donutRef}
                    style={{width: "120px", height: "auto"}}
                ></svg>
                {/*<Legend colorScale={colorScale} domain={[minPrecipitation, maxPrecipitation]} />*/}
                <SvgLegend title={null} colorScale={colorScale} domain={[minVal, maxVal]}
                           type={impactType ? "impact" : "precipitation"}/>
                {/* <AggregationLegend donutData={donutData}/>*/}
            </div>
        </div>
    )
}
export default PieChart