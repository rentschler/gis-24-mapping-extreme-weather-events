
import "leaflet/dist/leaflet.css";
import { Popup, Marker } from "react-leaflet";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { GeoJSON } from 'react-leaflet/GeoJSON';
import * as d3 from "d3";



const DBSCAN: React.FC<{ data: FeatureCollection<Geometry, GeoJsonProperties> }> = ({ data }) => {



    console.log("dbscan data", data.features[0]);
    // return (<Marker position={[49,9]}></Marker>);
    // return (<>{data.features[0]}</>)

    const colorScale = d3.scaleOrdinal<string>()
        .domain(data.features.map(feature => feature.properties!.cluster_id)) // Use a property like `category`
        .range(d3.schemeCategory10); // Use D3's predefined color scheme


    return (<> 
        {/* Map over features */}
        {data.features.map((feature, index) => (
            <GeoJSON 
                key={index} 
                data={feature} 
                style={{fillColor: colorScale(feature.properties!.cluster_id),
                    weight: 1,
                    opacity: 1,
                    color: "white", // Border color
                    fillOpacity: 0.7,
                }}
            >
                <Popup >
                    <p>Cluster information tbd<br/>ClusterID: {feature.properties!.cluster_id} </p>
                </Popup>
            </GeoJSON>
        ))}</>);

}
export default DBSCAN;