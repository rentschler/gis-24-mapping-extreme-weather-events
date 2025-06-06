
import { MeteorologicalEventRecord } from "../../types/response";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import {Popup, Polygon } from "react-leaflet";
import MapPopup from "../../components/popup/MapPopup";


/**
         * The pipeline: 
         * 1. Load the geojson all the times 
         * 2. Filter the result from the query locally here
         * 3. Display only the points that are in the query.
         * - Surround with if case for UI selection 
         */

interface ReportPointsPolygonsProps {
  generalReportPoints: MeteorologicalEventRecord[],
  matchingPolygons: Feature<Geometry, GeoJsonProperties>[],
  colorScale: d3.ScaleSequential<string, never>;
}

const ReportPointsPolygons: React.FC<ReportPointsPolygonsProps> = ({generalReportPoints, matchingPolygons, colorScale}) => {
    
    
    return matchingPolygons.map((feature, index) => {

        const customFeature = feature as Feature<Geometry, GeoJsonProperties> & { foreign_key: number };
        const coordinates = (feature.geometry as GeoJSON.Polygon).coordinates;


        // Find the corresponding point using the foreign_key from the feature
        const correspondingPoint = generalReportPoints.find(
          (point) => point.id === customFeature.foreign_key
        )!;
        let fillColor = "grey";
        if (correspondingPoint.event.impacts) {
          const impacts = correspondingPoint.event.impacts;
          fillColor =  colorScale(impacts.length);
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
            <Popup
                pane="popupPane" // Force popup to render in the popup pane
            >
              <MapPopup record={correspondingPoint} />
            </Popup>
          </Polygon>


        );
      });
}


export default ReportPointsPolygons;