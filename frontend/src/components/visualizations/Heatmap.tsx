// Source: https://datahub.io/core/geo-nuts-administrative-boundaries?utm_source=chatgpt.com#NUTS_RG_60M_2024_4326_LEVL_3
// Lizenze: https://opendatacommons.org/licenses/pddl/
import { MeteorologicalEventRecord } from "../../types/response";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState } from "react";

import geojsonData from "../../europe_admin.geo.json";
import { Popup } from "react-leaflet";
import { useEffect } from "react";
import AggregationData from "./AggregationVis";
import { MessageInstance } from "antd/es/message/interface";

interface HeatmapProps {
    messageApi: MessageInstance
}

// Load geojson and map precipitation amount to feature
const Heatmap: React.FC <HeatmapProps> = ({messageApi}) => {

    const displayLoadingMessage = () => {
      messageApi.open({
        type: 'loading',
        content: 'Loading event Heat map data...',
        duration: 0,
        key: 'heatmap',
      });
      // Dismiss manually and asynchronously
      // setTimeout(messageApi.destroy, 2500);
    };
    const [geojson, setGeojson] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Delay function (Promise-based)
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const fetchPoints = async () => {
            // open loading message
            setIsLoading(true);
            displayLoadingMessage();
            // Fetch all the data for each feature and wait for all the responses to come back
            await Promise.all(
                (geojsonData.features as Feature<Geometry>[]).slice(0,10).map(async (feature) => {
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

                        (feature.properties as any)!["response"] = data; // Assign the response to the properties
                        (feature.properties as any)!["style"] = getStyle(data); // Assign the response to the properties
                    }

                    // Sleep for 10 milliseconds before making the next request
                    await sleep(10); // Pause for 10 milliseconds
                })
            );
            setGeojson(geojsonData.features as Feature<Geometry, GeoJsonProperties>[]);
            console.log("My fetched responses", geojson);
        };

        // after fetching all the data, set the loading state to false
        fetchPoints().then(() => {
            setIsLoading(false);
            messageApi.destroy('heatmap');
        });
    }, []); // Empty dependency array ensures this runs only once on mount

    /**
     * 
     * @param precipitationAmount
     *  #295260
#347477
#408E81
#4CA483
#59BA81
#6EC581
#83CF86
#A2D999
#C0E2AF
#D9EBC5
#ECF3DC
     * @returns 
     */
    // Function to map precipitation amount to color
    const getColor = (precipitationAmount: number) => {
        if (precipitationAmount > 100) return "#295260"; // High precipitation
        if (precipitationAmount > 50) return "#347477";
        if (precipitationAmount > 20) return "#408E81";
        if (precipitationAmount > 10) return "#4CA483";
        if (precipitationAmount > 5) return "#59BA81";
        return "#6EC581"; // Low precipitation
    };

    // Function to style each GeoJSON feature
    const getStyle = (data: MeteorologicalEventRecord[]) => {
        // collect the precipitation Amount
        var precipitationAmount = 0;
        data.forEach(event => {
            precipitationAmount += event.event.precipitation_amount || 0;
        });

        // const precipitationAmount = feature.properties?.precipitationAmount || 0;
        return {
            fillColor: getColor(precipitationAmount),
            weight: 1,
            opacity: 1,
            color: "white", // Border color
            fillOpacity: 0.7,
        };
    };


    return (<>
        {!isLoading && geojson && geojson.length> 0 &&(geojson).map((feature) => {
        return <GeoJSON
            data={feature}
            style={() => feature.properties?.style || {}}
        >
            <Popup minWidth={1000} maxWidth={1000} maxHeight={500}>
                <p>Country code: {feature.properties?.CNTR_CODE}</p>
                <p>NAME_LATN: {feature.properties?.NAME_LATN}</p>
                <AggregationData points={feature.properties?.response as MeteorologicalEventRecord[]} />
            </Popup>
        </GeoJSON>
    })}
    </>);
}

export default Heatmap;