
// Sample GeoJSON (you would typically fetch this from an API or import it)
import { useState, useEffect } from "react";
import { MeteorologicalEventRecord } from "../../types/response";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import {Popup, Polygon } from "react-leaflet";
import MapPopup from "../../components/popup/MapPopup";
import geojsonData from '../../combined_reports.geo.json'; // Replace with your actual geoJSON file


/**
         * The pipeline: 
         * 1. Load the geojson all the times 
         * 2. Filter the result from the query locally here
         * 3. Display only the points that are in the query.
         * - Surround with if case for UI selection 
         */
const ReportPointsPolygons: React.FC<{reportPoints: MeteorologicalEventRecord[]}> = ({reportPoints}) => {
    
    const [matchingPolygons, setMatchingPolygons] = useState<Feature[]>([]);
    useEffect(() => {
        
          // Extract the ids from general report points
          const reportIds = new Set(reportPoints.map((point: MeteorologicalEventRecord) => point.id));


          // Filter the polygons based on matching foreign keys
          const matchingPolygons = geojsonData.features.filter((feature) =>
            reportIds.has(feature.foreign_key)
          ) as Feature<Geometry>[];

          
          setMatchingPolygons(matchingPolygons);
    });
    
    return matchingPolygons.map((feature, index) => {

        const customFeature = feature as Feature<Geometry, GeoJsonProperties> & { foreign_key: number };
        const coordinates = (feature.geometry as GeoJSON.Polygon).coordinates;


        // Find the corresponding point using the foreign_key from the feature
        const correspondingPoint = reportPoints.find(
          (point) => point.id === customFeature.foreign_key
        )!;
        let fillColor = "grey";
        if (correspondingPoint.event.impacts) {
          const impacts = correspondingPoint.event.impacts;
          fillColor = impacts.length > 2 ? impacts.length > 4 ? "red" : "orange" : "yellow";
        }
        return (

          <Polygon
            key={index}
            positions={coordinates[0].map(([lng, lat]) => [lat, lng])} // Transform [lng, lat] to [lat, lng]
            pathOptions={{
              color: fillColor, // Border color
              weight: 2, // Border thickness
              opacity: 0.6, // Border opacity
              fillColor: fillColor, // Fill color
              fillOpacity: 0.4, // Fill opacity
            }}
          >
            <Popup>
              <MapPopup record={correspondingPoint} />
            </Popup>
          </Polygon>


        );
      });
}


export default ReportPointsPolygons;