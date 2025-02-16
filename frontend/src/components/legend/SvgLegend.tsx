import React from "react";
import * as d3 from "d3";

// Base props used by both legend implementations
interface BaseLegendProps {
  colorScale: d3.ScaleSequential<string, never>;
  domain: [number, number];
  title: string | null;
  type: "impact" | "precipitation";
}

/**
 * SVG version of the legend – renders an inline SVG.
 * @param colorScale - d3 color scale
 * @param domain - min and max values for the color scale
 * @param title - title of the legend
 * @param type - type of the legend, either "impact" or "precipitation"
 * @constructor
 */
const SvgLegend: React.FC<BaseLegendProps> = ({ colorScale, domain, title, type= "precipitation" }) => {
  const [min, max] = domain;
  const steps = max - min > 5 ? 5 : max - min;
  const stepValues = d3.range(min, max, (max - min) / (steps-1)).map(value => Math.round(value))
  // Include the max value as the last item in the legend.
  const allValues = stepValues.concat(max);

  // Layout constants for the SVG legend
  const margin = 5;
  const titleHeight = title ? 20 : -5;
  const rectSize = 20;
  const spacing = 5;
  const n = allValues.length;
  const svgHeight = margin + titleHeight + n * (rectSize + spacing) + margin - spacing;
  const svgWidth = 100;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        // backgroundColor: "white",
        // borderRadius: "5px",
        // boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
        padding: "1px",
      }}
    >
      {title &&
        <text
          x={margin}
          y={margin + titleHeight - 5}
          style={{ fontSize: "14px", fontWeight: "bold" }}
        >
        {title}
        </text>
      }
      {allValues.map((value, index) => (
        <g
          key={index}
          transform={`translate(${margin}, ${
            margin + titleHeight + index * (rectSize + spacing)
          })`}
        >
          <rect width={rectSize} height={rectSize} fill={colorScale(value)} />
          <text
            x={rectSize + 8}
            y={rectSize - 5}
            style={{ fontSize: "12px", alignmentBaseline: "middle" }}
          >
            {value.toFixed(0)} {type === "precipitation" ? "mm" : ""}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default SvgLegend;