// Source: https://datahub.io/core/geo-nuts-administrative-boundaries?utm_source=chatgpt.com#NUTS_RG_60M_2024_4326_LEVL_3
// Lizenze: https://opendatacommons.org/licenses/pddl/
import { MeteorologicalEventRecord } from "../../types/response.ts";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import React, { useState } from "react";

import { Popup } from "react-leaflet";
import { useEffect } from "react";
import AggregationData from "./Aggregation/AggregationVis.tsx";
import * as d3 from "d3";
// Legend Component
import LegendLeaflet from "../legend/LegendLeaflet.tsx";

interface AdministrativeProps {
    adminBoundaries: Feature<Geometry>[]
}


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
                const points : MeteorologicalEventRecord[] = (feature.properties as any).geometry_points;
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
        .domain([minPrecipitation!, maxPrecipitation!]);


    // Function to style each GeoJSON feature
    const getStyle = (records: MeteorologicalEventRecord[]) => {
        // collect the precipitation Amount
        if(!records ) return {};
        let precipitationAmount = 0;
        records.forEach(point => {
           precipitationAmount += point.event.precipitation_amount || 0; 
        });  
        
        // const precipitationAmount = feature.properties?.precipitationAmount || 0;
        return {
            fillColor: colorScale(precipitationAmount),
            weight: 1,
            opacity: 1,
            color: "white", // Border color
            fillOpacity: 0.4,
        };
    };


    return (<>
        {!isLoading && adminBoundaries && adminBoundaries.length > 0 && (adminBoundaries).map((feature) => {
            return <GeoJSON
                key={feature.properties?.NUTS_ID}
                data={feature}
                style={() => getStyle((feature.properties as any).geometry_points ) || {}}
            >
                <Popup minWidth={1000} maxWidth={1000} maxHeight={500}
                pane="popupPane" // Force popup to render in the popup pane
                >
                    <div className="" style={{
                        overflow: "auto",
                    }}>
                        <AggregationData points={(feature.properties as any).geometry_points as MeteorologicalEventRecord[]} country={feature.properties?.CNTR_CODE} name={feature.properties?.NAME_LATN} /> 
                    </div>
                </Popup>
            </GeoJSON>
        })}
        {!isLoading && geojson && geojson.length > 0 &&
            <LegendLeaflet colorScale={colorScale} domain={[minPrecipitation, maxPrecipitation]} />
        }

    </>);
}

export default Choropleth;