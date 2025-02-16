import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
import { Popup } from "react-leaflet";
import { GeoJSON } from "react-leaflet/GeoJSON";
import {FeatureCollection, Geometry, GeoJsonProperties, Feature} from "geojson";
import * as d3 from "d3";
import AggregationData from "./Aggregation/AggregationVis.tsx";
import { MeteorologicalEventRecord } from "../../types/response.ts";

const DBSCAN: React.FC<{ data: FeatureCollection<Geometry, GeoJsonProperties> }> = ({data}) => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // This effect will run whenever `data` changes
    setReloadKey(prevKey => prevKey + 1);
  }, [data]);




  // Determine the domain for both properties
  const impactValuesSum = data.features.map(f => 
  {
    const sum = f.properties?.cluster_points?.reduce((sum:number, point: MeteorologicalEventRecord) => sum + (point.event.impacts?.length || 0), 0) ?? 0;
    return sum / (f.properties?.cluster_points?.length || 1);
  }
  );
  const precipValuesSum = data.features.map(f => 
    {
      const sum = f.properties?.cluster_points?.reduce((sum:number, point: MeteorologicalEventRecord) => sum + (+(point.event.precipitation_amount || 0)), 0) ?? 0;
      return sum / (f.properties?.cluster_points?.length || 1);
    }
  );

  const minImpacts = d3.min(impactValuesSum) || 0;
  const maxImpacts = d3.max(impactValuesSum) || 1;
  const minPrecip = d3.min(precipValuesSum) || 0;
  const maxPrecip = d3.max(precipValuesSum) || 1;

    // Number of quantile bins per dimension (3x3 grid)
    const n = 3;

    // Create quantile scales for each variable.
  // These scales will return an index in the range [0, 1, 2]
  const x = d3.scaleQuantile()
    .domain([minImpacts, maxImpacts])
    .range(d3.range(n));

  const y = d3.scaleQuantile()
    .domain([minPrecip, maxPrecip])
    .range(d3.range(n));

  // Define the 3x3 RdBu color scheme
  const rdBu = {
    name: "RdBu",
    colors: [
      "#e8e8e8", "#e4acac", "#c85a5a",
      "#b0d5df", "#ad9ea5", "#985356",
      "#64acbe", "#627f8c", "#574249"
    ]
  };
   
  // The bivariate color function.
  const twoDimColor = (feature: Feature<Geometry, GeoJsonProperties>) => {
    const impacts_sum = feature.properties?.cluster_points?.reduce((sum:number, point: MeteorologicalEventRecord) => sum + (point.event.impacts?.length || 0), 0) || 0;
    const precip_sum = feature.properties?.cluster_points?.reduce((sum:number, point: MeteorologicalEventRecord) => sum + (+(point.event.precipitation_amount || 0)), 0) || 0;
    const ix = x(precip_sum / (feature.properties?.cluster_points?.length || 1));
    const iy = y(impacts_sum / (feature.properties?.cluster_points?.length || 1));
    const index = ix * n + iy;
    console.log(impacts_sum, precip_sum, index, rdBu.colors[index])
    return rdBu.colors[index];
  };

  return (
    <>
      {data.features.map((feature, index) => (
        <GeoJSON
          key={`${index}-${reloadKey}`}
          data={feature}
          style={() => ({
            fillColor: twoDimColor(feature),
            weight: 1,
            opacity: 1,
            color: "white", // Border color
            fillOpacity: 0.7,
          })}
        >
          <Popup
            minWidth={1000}
            maxWidth={1000}
            maxHeight={500}
            pane="popupPane" // Force popup to render on top
          >
            <div style={{ overflow: "auto" }}>
              <AggregationData
                points={feature.properties?.cluster_points as MeteorologicalEventRecord[]}
                country={feature.properties?.cluster_points[0]?.location.country}
                name={feature.properties?.cluster_points[0]?.location.place}
              />
            </div>
          </Popup>
        </GeoJSON>
      ))}
    </>
  );
};

export default DBSCAN;
