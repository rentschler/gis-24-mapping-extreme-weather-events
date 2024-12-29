import { MapContainer, Popup, TileLayer, useMap, Marker } from "react-leaflet";
import { useState, useEffect } from "react";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';

import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord } from "../types/response";
import React from "react";


import DynamicCluster from "../components/visualizations/DynamicCluster";
import SimplePoints from "../components/visualizations/SimplePoints";
import ReportPointsPolygons from "../components/visualizations/ReportPointsPolygons";
import AggregationData from "../components/visualizations/AggregationVis";
import Heatmap from "../components/visualizations/Heatmap";
// Sample GeoJSON (you would typically fetch this from an API or import it)
/* import { useSelector } from "react-redux";
import { RootState } from "../store/store"; */


/**
 * 
 * @todo
 * - Aggregation Visualizations (can be calculated once per API call)
 * - Heatmap Visualization
 */

interface MapProps {
  points: MeteorologicalEventRecord[],
  generalReportPoints: MeteorologicalEventRecord[],
  matchingPolygons: Feature<Geometry, GeoJsonProperties>[],

}

const Map = ({points, generalReportPoints, matchingPolygons}:MapProps) => {
/* Do we need this? 
  const {
    options
  } = useSelector((state: RootState) => state.vis); */
  console.log(points, generalReportPoints, matchingPolygons);

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
        {/* 
        <ReportPointsPolygons generalReportPoints={generalReportPoints} matchingPolygons={matchingPolygons}></ReportPointsPolygons>
        <SimplePoints points={points} radius={calculateRadius(zoomLevel)}/>
        <DynamicCluster points={points} radius={calculateRadius(zoomLevel)}/>
        */}
        <Heatmap />
      </MapContainer>
    </div>
  );
};

export default Map;
