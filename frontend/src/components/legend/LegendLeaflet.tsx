import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';
import * as d3 from "d3";
import L from "leaflet";

const LegendLeaflet: React.FC<{ colorScale: d3.ScaleSequential<string, never>; domain: [number, number] }> = ({ colorScale, domain }) => {
    const map = useMap();

    useEffect(() => {
        const [min, max] = domain;
        const steps = 5; // Number of legend steps
        const stepValues = d3.range(min, max, (max - min) / steps);

        // Create a new control for the legend
        const legend = new L.Control({ position: "bottomleft" });

        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            div.style.backgroundColor = "white";
            div.style.padding = "10px";
            div.style.color = "black";
            div.style.borderRadius = "5px";
            div.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.2)";
            div.innerHTML = `
                <div style="font-size:14px; margin-bottom:8px;"><strong>Precipitation</strong></div>
                ${stepValues
                    .map(
                        (value) =>
                            `<div style="display: flex; align-items: center; margin-bottom: 4px;">
                                <div style="width: 20px; height: 20px; background: ${colorScale(value)}; margin-right: 8px;"></div>
                                <span>${value.toFixed(1)} mm</span>
                            </div>`
                    )
                    .join("")}
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: ${colorScale(max)}; margin-right: 8px;"></div>
                    <span>${max} mm</span>
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
    }, [colorScale, domain, map]);

    return null;
}

export default LegendLeaflet