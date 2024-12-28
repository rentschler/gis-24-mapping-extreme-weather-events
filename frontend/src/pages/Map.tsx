import { MapContainer, TileLayer, Popup, useMap, Polygon } from "react-leaflet";
import { useState, useEffect } from "react";
import { GeoJsonProperties, Geometry, Feature } from 'geojson';

import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord } from "../types/response";
import MapPopup from "../components/popup/MapPopup";
import React from "react";


import DynamicCluster from "../components/visualizations/DynamicCluster";
import SimplePoints from "../components/visualizations/SimplePoints";
import ReportPointsPolygons from "../components/visualizations/ReportPointsPolygons";

// Sample GeoJSON (you would typically fetch this from an API or import it)
import geojsonData from '../combined_reports.geo.json'; // Replace with your actual geoJSON file
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { QueryState } from "../store/settingsSlice";


/**
 * 
 * @todo
 * - Aggregation Visualizations (can be calculated once per API call)
 * - Heatmap Visualization
 */


const Map = () => {


  const {
    filters
  } = useSelector((state: RootState) => state.query);

  // console.log("filters:", filters);


  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);

  const [generalReportPoints, setGeneralReportPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [matchingPolygons, setMatchingPolygons] = useState<Feature[]>([]);

  const [zoomLevel, setZoomLevel] = useState(8); // Default zoom level
  const mapRef = React.useRef(null);


  useEffect(() => {


    const fetchPoints = async () => {
      try {
        const payLoad: { filters: QueryState } = {
          filters: filters
        }
        const response = await fetch("/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        });
        if (response.ok) {
          const data = await response.json() as MeteorologicalEventRecord[];
          // console.log("data", data);
          // filter points 
          // NOTE: THIS IS A GENERAL COLLECTIVE REPORT FOR THE NUMBER OF FATALITIES CAUSED BY VIOLENT FLASH FLOODS 

          const eventPoints: MeteorologicalEventRecord[] = [];
          const reportPoints: MeteorologicalEventRecord[] = [];

          data.forEach((point) => {
            if (point.event.event_description?.startsWith("NOTE: THIS IS A GENERAL COLLECTIVE REPORT")) {
              reportPoints.push(point);
            } else {
              eventPoints.push(point);
            }
          });

          // Extract the ids from general report points
          const reportIds = new Set(reportPoints.map((point) => point.id));


          // Filter the polygons based on matching foreign keys
          const matchingPolygons = geojsonData.features.filter((feature) =>
            reportIds.has(feature.foreign_key)
          ) as Feature<Geometry>[];

          // Update state with new filtered points
          setPoints(eventPoints);
          console.log("Remaining points:", eventPoints);

          setGeneralReportPoints(reportPoints);
          console.log("General report points:", reportPoints);

          setMatchingPolygons(matchingPolygons);
          // console.log("MatchingPolygons:", matchingPolygons);

        } else {
          console.error("Failed fetching api data:", response);
        }
      } catch (error) {
        console.error("Error fetching api data:", error);
      }
    };
    fetchPoints();
  }, [filters]);


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
        <ReportPointsPolygons reportPoints={generalReportPoints}></ReportPointsPolygons>
        <SimplePoints points={points} radius={calculateRadius(zoomLevel)}/>
        <DynamicCluster points={points} radius={calculateRadius(zoomLevel)}/>
      </MapContainer>
    </div>
  );
};

export default Map;
