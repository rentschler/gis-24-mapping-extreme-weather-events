// Source: https://datahub.io/core/geo-nuts-administrative-boundaries?utm_source=chatgpt.com#NUTS_RG_60M_2024_4326_LEVL_3
// Lizenze: https://opendatacommons.org/licenses/pddl/
import { MeteorologicalEventRecord } from "../../types/response.ts";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState } from "react";

import { Popup } from "react-leaflet";
import { useEffect } from "react";
import AggregationData from "./Aggregation/AggregationVis.tsx";
import * as d3 from "d3";
import L from "leaflet";

import { useMap } from "react-leaflet";
interface AdministrativeProps {
    adminBoundaries: Feature<Geometry>[]
}

// Legend Component
const Legend: React.FC<{ colorScale: d3.ScaleSequential<string, never>; domain: [number, number] }> = ({ colorScale, domain }) => {
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
};



// Load geojson and map precipitation amount to feature
const Choropleth: React.FC<AdministrativeProps> = ({ adminBoundaries }: AdministrativeProps) => {
    
    const [geojson, setGeojson] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [maxPrecipitation, setMaxPrecipitation] = useState<number>(1);
    const [minPrecipitation, setMinPrecipitation] = useState<number>(1);

    // console.log("testing choropleth params", adminPoints, adminBoundaries);
    useEffect(() => {
        const fetchPoints = async () => {
            // open loading message
            setIsLoading(true);

            let max = -Infinity;
            let min = Infinity;
            
            adminBoundaries.forEach(feature => {
                var points : MeteorologicalEventRecord[] = (feature.properties as any).geometry_points;
                if(points){
                    const precipitationAmount = points.reduce((sum, point) => sum + (point.event.precipitation_amount || 0), 0);
                    
                    if(precipitationAmount < min){
                        min = precipitationAmount; 
                    }
                    if(precipitationAmount > max){
                        max = precipitationAmount; 
                    }
                }
            });
            
            setMaxPrecipitation(max);
            setMinPrecipitation(min);
            setGeojson(adminBoundaries as Feature<Geometry, GeoJsonProperties>[]);
            // console.log("loaded admin boundaries", adminBoundaries);
            // console.log("Min and max", min, max);
            }; 
            
            // after fetching all the data, set the loading state to false
            fetchPoints().then(() => {
                setIsLoading(false);
            }); 
            
        }, [adminBoundaries]); // Depend on the admin Boundaries from the backend

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([minPrecipitation!, maxPrecipitation!]); // Adjust the domain based on your data's expected range


    // Function to style each GeoJSON feature
    const getStyle = (records: MeteorologicalEventRecord[]) => {
        // collect the precipitation Amount
        if(!records ) return {};
        var precipitationAmount = 0;
        records.forEach(point => {
           precipitationAmount += point.event.precipitation_amount || 0; 
        });  
        
        // const precipitationAmount = feature.properties?.precipitationAmount || 0;
        return {
            fillColor: colorScale(precipitationAmount),
            weight: 1,
            opacity: 1,
            color: "white", // Border color
            fillOpacity: 0.5,
        };
    };


    return (<>
        {!isLoading && adminBoundaries && adminBoundaries.length > 0 && (adminBoundaries).map((feature, index) => {
            return <GeoJSON
                key={feature.properties?.NUTS_ID}
                data={feature}
                style={() => getStyle((feature.properties as any).geometry_points ) || {}}
            >
                <Popup minWidth={1000} maxWidth={1000} maxHeight={500}>
                    <div className="" style={{
                        overflow: "auto",
                    }}>
                        index {index}

                        {/*
                        Eff this: {feature as any}
                        */}
                        <AggregationData points={(feature.properties as any).geometry_points as MeteorologicalEventRecord[]} country={feature.properties?.CNTR_CODE} name={feature.properties?.NAME_LATN} /> 
                    </div>
                </Popup>
            </GeoJSON>
        })}
        {!isLoading && geojson && geojson.length > 0 &&
            <Legend colorScale={colorScale} domain={[minPrecipitation, maxPrecipitation]} />
        }

    </>);
}

export default Choropleth;