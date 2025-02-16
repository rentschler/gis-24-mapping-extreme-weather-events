import "leaflet/dist/leaflet.css";
import React, {useState, useEffect} from "react";
import {Popup} from "react-leaflet";
import {GeoJSON} from "react-leaflet/GeoJSON";
import {FeatureCollection, Geometry, GeoJsonProperties, Feature} from "geojson";
import * as d3 from "d3";
import AggregationData from "./Aggregation/AggregationVis.tsx";
import {MeteorologicalEventRecord} from "../../types/response.ts";
import BivariateLegend from "../legend/BivariateLegend.tsx";

const DBSCAN: React.FC<{ data: FeatureCollection<Geometry, GeoJsonProperties> }> = ({data}) => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // This effect will run whenever `data` changes
    setReloadKey(prevKey => prevKey + 1);
  }, [data]);


  // Determine the domain for both properties
  const impactValuesSum = data.features.map(f => {
        const sum = f.properties?.cluster_points?.reduce((sum: number, point: MeteorologicalEventRecord) => sum + (point.event.impacts?.length || 0), 0) ?? 0;
        return sum / (f.properties?.cluster_points?.length || 1);
      }
  );
  const precipValuesSum = data.features.map(f => {
        const sum = f.properties?.cluster_points?.reduce((sum: number, point: MeteorologicalEventRecord) => sum + (+(point.event.precipitation_amount || 0)), 0) ?? 0;
        return sum / (f.properties?.cluster_points?.length || 1);
      }
  );

  const minImpacts = 0;
  const maxImpacts = d3.max(impactValuesSum) || 1;
  const minPrecip = 0;
  const maxPrecip = d3.max(precipValuesSum) || 1;

  console.log("minmax", minImpacts, maxImpacts, minPrecip, maxPrecip);

  // Number of quantile bins per dimension (3x3 grid)
  const n = 3;

  // Create threshold scales for each variable.
  const x = d3.scaleThreshold<number, number>()
      .domain([minImpacts, maxImpacts/2])
      .range([0.1, 1, 2]);

  const y = d3.scaleThreshold<number, number>()
  .domain([0.1, maxPrecip/2])
  .range([0, 1, 2]);

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
    const impacts_sum = feature.properties?.cluster_points?.reduce((sum: number, point: MeteorologicalEventRecord) => sum + (point.event.impacts?.length || 0), 0) || 0;
    const impacts_avg = impacts_sum / (feature.properties?.cluster_points?.length || 1);
    const precip_sum = feature.properties?.cluster_points?.reduce((sum: number, point: MeteorologicalEventRecord) => sum + (+(point.event.precipitation_amount || 0)), 0) || 0;
    const precip_avg = precip_sum / (feature.properties?.cluster_points?.length || 1);
    const ix = x(impacts_avg);
    const iy = y(precip_avg);
    const index = ix  + iy * n;
    console.log(feature.properties?.cluster_points?.length + "\nprecip", precip_avg, ix + "\nimpacts", impacts_avg, iy + "\nindex", index, "\n", rdBu.colors[index]);
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
                  fillOpacity: 0.8,
                })}
            >
              <Popup
                  minWidth={1000}
                  maxWidth={1000}
                  maxHeight={500}
                  pane="popupPane" // Force popup to render on top
              >
                <div style={{overflow: "auto"}}>
                  <AggregationData
                      points={feature.properties?.cluster_points as MeteorologicalEventRecord[]}
                      country={"Cluster"}
                      name={feature.properties?.cluster_points[0]?.location.place}
                  />
                </div>
              </Popup>
            </GeoJSON>
        ))}
        <BivariateLegend colors={rdBu.colors}  

    title = "Cluster Legend"
    impactLabel = "Impacts"
    precipLabel = "Precipitation"

    ></BivariateLegend>
      </>
  );
};

export default DBSCAN;
