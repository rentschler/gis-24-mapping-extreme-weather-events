import "leaflet/dist/leaflet.css";
import React, {useState, useEffect} from "react";
import {Popup} from "react-leaflet";
import {FeatureCollection, Geometry, GeoJsonProperties} from "geojson";
import {GeoJSON} from 'react-leaflet/GeoJSON';
import * as d3 from "d3";
import AggregationData from "./Aggregation/AggregationVis.tsx";
import {MeteorologicalEventRecord} from "../../types/response.ts";


const DBSCAN: React.FC<{ data: FeatureCollection<Geometry, GeoJsonProperties> }> = ({data}) => {


    // console.log("dbscan data", data.features[0]);
    // return (<Marker position={[49,9]}></Marker>);
    // return (<>{data.features[0]}</>)
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        // This effect will run whenever `data` changes
        setReloadKey(prevKey => prevKey + 1);
    }, [data]);

    const colorScale = d3.scaleOrdinal<string>()
        .domain(data.features.map(feature => feature.properties!.cluster_id)) // Use a property like `category`
        .range(d3.schemeCategory10); // Use D3's predefined color scheme


    return (<>
        {/* Map over features */}
        {data.features.map((feature, index) => (
            <GeoJSON

                key={`${index}-${reloadKey}`}
                data={feature}
                style={{
                    fillColor: colorScale(feature.properties!.cluster_id),
                    weight: 1,
                    opacity: 1,
                    color: "white", // Border color
                    fillOpacity: 0.7,
                }}
            >
                <Popup minWidth={1000} maxWidth={1000} maxHeight={500}>
                    <div className="" style={{
                        overflow: "auto",
                    }}>
                        <AggregationData
                            points={feature.properties?.cluster_points as MeteorologicalEventRecord[]}
                            country={feature.properties?.cluster_points[0]?.location.country}
                            name={feature.properties?.cluster_points[0]?.location.place}/>
                    </div>
                </Popup>
            </GeoJSON>
        ))}</>);

}
export default DBSCAN;