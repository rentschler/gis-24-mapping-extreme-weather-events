import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON, Polygon } from "react-leaflet";
import { useState, useEffect } from "react";
import { FeatureCollection, GeoJsonProperties, Geometry, Feature, GeoJsonObject } from 'geojson';

import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord, QCLevel, QCLevelDescriptions } from "../types/response";
import { getImpactDescription, parseImpactCode } from "../types/parsing";
import MapPopup from "../components/popup/MapPopup";
import React from "react";


// Sample GeoJSON (you would typically fetch this from an API or import it)
import geojsonData from '../combined_reports.geo.json'; // Replace with your actual geoJSON file
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { QueryState } from "../store/settingsSlice";

interface MapProps {
  points: MeteorologicalEventRecord[],
  generalReportPoints: MeteorologicalEventRecord[],
  matchingPolygons: Feature<Geometry, GeoJsonProperties>[],

}

const Map = ({points, generalReportPoints, matchingPolygons}:MapProps) => {

  const {
    options
  } = useSelector((state: RootState) => state.vis);

  const [zoomLevel, setZoomLevel] = useState(8); // Default zoom level
  const mapRef = React.useRef(null);


  // Custom component to listen to map zoom changes
  const ZoomListener = () => {
    const map = useMap();
    useEffect(() => {
      const handleZoom = () => {
        // console.log("Zoom level:", map.getZoom(), "radius:", calculateRadius(map.getZoom()));


        setZoomLevel(map.getZoom());
      };
      map.on('zoomend', handleZoom);
      return () => {
        map.off('zoomend', handleZoom);
      };
    }, [map]);
    return null;
  };

  // Function to calculate radius based on zoom level
  const calculateRadius = (zoom: number) => {
    // Example of an exponential function
    const baseRadius = 1.8; // Minimum radius
    const growthFactor = 1.3; // Adjust for scaling rate
    return baseRadius * Math.pow(growthFactor, zoom - 5); // Scale exponentially from zoom level 5
  };


  return (
    <div className="map-container px-2">
      <MapContainer
        center={[47.69162, 9.187]}
        className="map-content"
        zoom={8}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomListener />
        {/**
         * The pipeline: 
         * 1. Load the geojson all the times
         * 2. Filter the result from the query locally here
         * 3. Display only the points that are in the query.
         * - Surround with if case for UI selection 
         */
          options.showSummaries && 
          matchingPolygons.map((feature, index) => {
            
            const customFeature = feature as Feature<Geometry, GeoJsonProperties> & { foreign_key: number };
            const coordinates = (feature.geometry as GeoJSON.Polygon).coordinates;
            

            // Find the corresponding point using the foreign_key from the feature
            const correspondingPoint = generalReportPoints.find(
              (point) => point.id === customFeature.foreign_key
            )!;
            
            let fillColor = "grey";
            if (correspondingPoint.event.impacts) {
              const impacts = parseImpactCode(correspondingPoint.event.impacts);
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
          })
        }
        {/* Adding the circle markers to the map */}
        {options.showPointEvents && points.map((point) => {
          const latitude = point.location.coordinates.latitude
          const longitude = point.location.coordinates.longitude
          if (!latitude || !longitude) return null;
          let fillColor = "grey";
          if (point.event.impacts) {
            const impacts = parseImpactCode(point.event.impacts);
            fillColor = impacts.length > 2 ? impacts.length > 4 ? "red" : "orange" : "yellow";
          }

          // Dynamically calculate the radius based on the zoom level
          const radius = calculateRadius(zoomLevel);
          return (
            <CircleMarker
              key={point.id}
              center={[latitude, longitude]}
              radius={point.event.qc_level === QCLevel.QC0_PLUS ? radius * 0.5: radius} // Double the radius for QC0_PLUS
              color={fillColor} // Border color of the dot
              // stroke={true} // Fill color for the dot
              fillOpacity={1} // Opacity of the fill color
            > <Popup>
                <MapPopup record={point} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
