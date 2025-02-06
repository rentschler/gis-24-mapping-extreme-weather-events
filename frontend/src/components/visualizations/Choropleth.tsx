// Source: https://datahub.io/core/geo-nuts-administrative-boundaries?utm_source=chatgpt.com#NUTS_RG_60M_2024_4326_LEVL_3
// Lizenze: https://opendatacommons.org/licenses/pddl/
import { MeteorologicalEventRecord, AdminPoint } from "../../types/response.ts";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState } from "react";

import geojsonData from "../../europe_admin.geo.json";
import { Popup } from "react-leaflet";
import { useEffect } from "react";
import AggregationData from "./Aggregation/AggregationVis.tsx";
import { MessageInstance } from "antd/es/message/interface";
import * as d3 from "d3";
import L from "leaflet";

import { useMap } from "react-leaflet";
interface AdministrativeProps {
    messageApi: MessageInstance,
    adminPoints : AdminPoint[],
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
                    <span>${max.toFixed(1)} mm</span>
                </div>
            `;
            return div;
        };

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
const Choropleth: React.FC<AdministrativeProps> = ({ messageApi, adminPoints, adminBoundaries }: AdministrativeProps) => {
    const displayLoadingMessage = () => {
        messageApi.open({
            type: 'loading',
            content: 'Loading data for choropleth map...',
            duration: 0,
            key: 'heatmap',
        });
        // Dismiss manually and asynchronously
        // setTimeout(messageApi.destroy, 2500);
    };
    const [pointsDict , setAdminPoints] = useState<Record<number, MeteorologicalEventRecord[]>>({});
    const [geojson, setGeojson] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [maxPrecipitation, setMaxPrecipitation] = useState<number>(1);
    const [minPrecipitation, setMinPrecipitation] = useState<number>(1);

    // Delay function (Promise-based)
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // console.log("testing choropleth params", adminPoints, adminBoundaries);
    useEffect(() => {
        if (!adminPoints || adminPoints.length === 0) return;
        // Todo: Make dictionary of admin points, set admin boundaries 
        const fetchPoints = async () => {
            // open loading message
            setIsLoading(true);
            displayLoadingMessage();

            let max = -Infinity;
            let min = Infinity;
            /* 

            // Fetch all the data for each feature and wait for all the responses to come back
            await Promise.all(
                
                (geojsonData.features as Feature<Geometry>[])/*.slice(1,50).map(async (feature) => {
                    const response = await fetch("/api/data/geometry", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(feature), // Send the current feature
                    });

                    if (response.ok) {
                        const data = await response.json() as MeteorologicalEventRecord[];
                        // console.log("Fetched data:", data);

                        let precipitationAmount = 0;
                        data.forEach((event) => {
                            precipitationAmount += event.event.precipitation_amount || 0;
                        });

                        if (precipitationAmount > 0) {
                            min = Math.min(min, precipitationAmount);
                            max = Math.max(max, precipitationAmount);
                        }

                        (feature.properties as any)!["response"] = data; // Assign the response to the properties
                        (feature.properties as any)!["style"] = getStyle(data); // Assign the response to the properties
                    }

                    // Sleep for 10 milliseconds before making the next request
                    await sleep(10); // Pause for 10 milliseconds
                })
            ); */
            setMaxPrecipitation(10);
            setMinPrecipitation(1);
            var dict:  Record<number, MeteorologicalEventRecord[]> = {};
            adminPoints.forEach((points) => {
                console.log(points);
                dict[points.polygon_id] = points.geometry_points as MeteorologicalEventRecord[]
            });

            
            setAdminPoints(dict);
            setGeojson(adminBoundaries as Feature<Geometry, GeoJsonProperties>[]);
            console.log("loaded admin boundaries", adminBoundaries);
            console.log("my points dict", dict);
            console.log("Min and max", min, max);
            }; 
            
            // after fetching all the data, set the loading state to false
            fetchPoints().then(() => {
                setIsLoading(false);
                messageApi.destroy('heatmap');
            }); 
            
        }, [adminPoints]); // Empty dependency array ensures this runs only once on mount

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([minPrecipitation!, maxPrecipitation!]); // Adjust the domain based on your data's expected range


    // Function to style each GeoJSON feature
    const getStyle = (data: MeteorologicalEventRecord[]) => {
        // collect the precipitation Amount
        var precipitationAmount = 0;
        data.forEach(event => {
            precipitationAmount += event.event.precipitation_amount || 0;
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
        {!isLoading && adminBoundaries && adminBoundaries.length > 0 && (adminBoundaries).map((feature) => {
            return <GeoJSON
                key={feature.properties?.NUTS_ID}
                data={feature}
                style={() => feature.properties?.style || {}}
            >
                <Popup minWidth={1000} maxWidth={1000} maxHeight={500}>
                    <div className="" style={{
                        overflow: "auto",
                    }}>
                        
                        {(feature as any).polygon_id}

                        {/*
                        Eff this: {feature as any}
                        */}
                        <AggregationData points={pointsDict[(feature as any).polygon_id] as MeteorologicalEventRecord[]} country={feature.properties?.CNTR_CODE} name={feature.properties?.NAME_LATN} /> 
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