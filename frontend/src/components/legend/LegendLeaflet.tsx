import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';
import * as d3 from "d3";
import L from "leaflet";

interface BaseLegendProps {
  colorScale: d3.ScaleSequential<string, never>;
  domain: [number, number];
  title?: string;
  type?: "impact" | "precipitation";
}

const LegendLeaflet: React.FC<BaseLegendProps> = ({ colorScale, domain, title="Precipitation", type= "precipitation" }) => {
    const map = useMap();

    useEffect(() => {
        const [min, max] = domain;

        // check for undefined values
        if(!colorScale || !domain){
            return;
        }

        const steps = 5; // Number of legend steps
        const stepValues = d3.range(min, max, (max - min) / steps)

        // Create a new control for the legend
        const legend = new L.Control({ position: "bottomleft" });

        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            div.style.backgroundColor = "white";
            div.style.padding = "10px";
            div.style.color = "black";
            div.style.borderRadius = "5px";
            div.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.2)";
            div.style.width = "100%";
            div.innerHTML = `
                ${title ? `<div style="font-size:14px; margin-bottom:8px;"><strong>${title}</strong></div>` : ""}
                ${stepValues
                    .map(
                        (value) =>
                            `<div style="display: flex; align-items: center; margin-bottom: 4px;">
                                <div style="width: 20px; height: 20px; background: ${colorScale(value)}; margin-right: 8px;"></div>
                                <span>${value.toFixed(0)} ${type === "precipitation" ? "mm" : ""}</span>
                            </div>`
                    )
                    .join("")}
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: ${colorScale(max)}; margin-right: 8px;"></div>
                    <span>${(+max).toFixed(0)} ${type === "precipitation" ? "mm" : ""}</span>
                </div>
            `;
            return div;
        };
// ${max.toFixed(1)}
        // Add the legend to the map
        legend.addTo(map);

        // Cleanup: Remove the legend when the component unmounts
        return () => {
            legend.remove();
        };
    }, [colorScale, domain, map, title, type]);

    return null;
}

export default LegendLeaflet