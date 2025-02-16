import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface BivariateLegendProps {
  colors: string[]; // 9 colors, arranged row-major (impact × precip)
  title?: string;
  impactLabel?: string;
  precipLabel?: string;
}

const BivariateLegend: React.FC<BivariateLegendProps> = ({
  colors,
  title = "Bivariate Legend",
  impactLabel = "Impacts",
  precipLabel = "Precipitation",
}) => {
  const map = useMap();
  // Number of bins per dimension (3 for a 3×3 grid)
  const n = 3;

  // Optionally, you can derive quantile thresholds for each dimension:
  // For a quantile scale with n bins, quantiles() returns n-1 threshold values.
  // Here we simply label them as "Low", "Medium", and "High".
  const categoryLabels = ["Low", "Med", "High"];

  useEffect(() => {
    const legend = new L.Control({ position: "bottomleft" });

    legend.onAdd = () => {
      const container = L.DomUtil.create("div", "info legend");
      container.style.backgroundColor = "white";
      container.style.padding = "10px";
      container.style.color = "black";
      container.style.borderRadius = "5px";
      container.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.2)";
      container.style.width = "100%";


      let html = "";
      // Optional title
      if (title) {
        html += `<div style="font-size:14px; margin-bottom:8px;"><strong>${title}</strong></div>`;
      }

      // Build a table for the 3x3 color grid.
      // We display the "impact" dimension horizontally (columns)
      // and the "precipitation" dimension vertically (rows).
      html += `<table style="border-collapse: collapse;">`;

      //Header for Precipitation
      html += `<tr>`;
      html += `<td></td><td></td><td colspan="3" style="text-align: center; padding: 2px; font-size: 12px; font-weight: bold;">${precipLabel}</td>`;
      html += `</tr>`;

      // First row: empty top-left cells then column labels (Precipitation)
      html += `<tr>`;
      html += `<td style="width: 15px; height: 80px; position: relative; padding: 0; margin: 0;" rowspan="4">
                <div style="position: absolute; transform: rotate(-90deg) translate(-60%, 0); transform-origin: 0 0; width: 80px; text-align: center; font-size: 12px; font-weight: bold;">
                  ${impactLabel}
                </div>
              </td>`;
      html += `<td></td>`;
      for (let i = 0; i < n; i++) {
        html += `<td style="text-align: center; padding: 2px; font-size: 12px;">${categoryLabels[i]}</td>`;
      }
      html += `</tr>`;

      // Next rows: each row represents a precip category
      for (let j = 0; j < n; j++) {
        html += `<tr>`;
        // Empty cell for the rotated header
        // html += `<td></td>`;
        // Row label (precipitation)
        html += `<td style="text-align: center; padding: 2px; font-size: 12px;">${categoryLabels[j]}</td>`;
        for (let i = 0; i < n; i++) {
          // Calculate index into the color array.
          // Since colors are arranged row-major (impact × precip), 
          // we calculate: index = (i * n) + j, where:
          // i is the impact index (column)
          // j is the precip index (row)
          const colorIndex = (i * n) + j;
          console.log(colorIndex);
          
          html += `<td style="width: 20px; height: 20px; background: ${colors[colorIndex]}; padding: 0; margin: 0; border: 1px solid #ccc;"></td>`;
        }
        html += `</tr>`;
      }
      html += `</table>`;

      container.innerHTML = html;
      return container;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, colors, title, impactLabel, precipLabel, n, categoryLabels]);

  return null;
};

export default BivariateLegend;
