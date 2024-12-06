import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON } from "react-leaflet";
import { useState, useEffect } from "react";
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord, QCLevelDescriptions } from "../types/response";
import { getImpactDescription, parseImpactCode } from "../types/parsing";
import MapPopup from "../components/popup/MapPopup";
import React from "react";


// Sample GeoJSON (you would typically fetch this from an API or import it)
import geojsonData from '../combined_reports.geo.json'; // Replace with your actual geoJSON file


const Map = () => {
  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [generalReportPoints, setGeneralReportPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [generalReportPolygons, setGeneralReportPolygons] = useState<FeatureCollection<Geometry, GeoJsonProperties>>();
  const [zoomLevel, setZoomLevel] = useState(8); // Default zoom level
  const mapRef = React.useRef(null);


  useEffect(() => {


    const fetchPoints = async () => {
      try {
        const response = await fetch("/api/data");
        if (response.ok) {
          const data = await response.json() as MeteorologicalEventRecord[];

          // filter points 
          // NOTE: THIS IS A GENERAL COLLECTIVE REPORT FOR THE NUMBER OF FATALITIES CAUSED BY VIOLENT FLASH FLOODS 

          
          const general_report_points = data.filter((point) => {
            if (point.event.event_description?.startsWith("NOTE: THIS IS A GENERAL COLLECTIVE REPORT")) {
              // console.log(point.event.event_description);
              return true;
            }
            return false;
          });
          // Process and filter points
          const general_ids = Array.from(
            new Set(generalReportPoints.map((point) => point.id))
          );

          // Filter the features based on the foreign_key property
          const filteredFeatures = geojsonData.features.filter((feature) => 
            general_ids.includes(feature.foreign_key)
          );

          // Create a new GeoJSON object with only the filtered features
          const filteredGeoJSON: FeatureCollection = {
            ...geojsonData,
            features: filteredFeatures,
          };
          // Remove the points moved to general_report_points from the original points
          const filtered_points = data.filter((point) =>
            !point.event.event_description?.startsWith("NOTE: THIS IS A GENERAL COLLECTIVE REPORT")
          );

          setGeneralReportPolygons(filteredGeoJSON);
          // Update state with new filtered points
          setGeneralReportPoints(general_report_points);
          setPoints(filtered_points);

          console.log("General report points:", general_report_points);
          console.log("Remaining points:", filtered_points);
          // console.log(data);
          // setPoints(data);  // Save fetched data to state

          const dict: { [key: string]: Set<string> } = {};
          data.forEach((point) => {
            const keys = Object.keys(point);
            keys.forEach((key) =>
              // @ts-ignore
              dict[key] = dict[key] ? dict[key].add(point[key]) : new Set([point[key]])
            );
          }
          );

          // console.log(dict);
          // console.log(QCLevelDescriptions);
          // console.log(parseImpactCode(data[0].impacts||"").map((code) => getImpactDescription(code)));




        } else {
          console.error("Failed fetching api data:", response);
        }
      } catch (error) {
        console.error("Error fetching api data:", error);
      }
    };
    fetchPoints();
  }, []);


  // Custom component to listen to map zoom changes
  const ZoomListener = () => {
    const map = useMap();
    useEffect(() => {
      const handleZoom = () => {
        console.log("Zoom level:", map.getZoom(), "radius:", calculateRadius(map.getZoom()));


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

  // Optional: Bind a popup or other interactions to the polygons
  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`Name: ${feature.properties.name}`);
    }
  };
  console.log(geojsonData);

  // Styling for the polygons
  const polygonStyle = {
    color: "blue", // Border color
    weight: 2, // Border thickness
    opacity: 0.6, // Border opacity
    fillColor: "lightblue", // Fill color
    fillOpacity: 0.4, // Fill opacity
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
        <GeoJSON
          data={generalReportPolygons} // Your GeoJSON data
          style={polygonStyle} // Apply the polygon styles
          onEachFeature={onEachFeature} // Add popup or other interactions
        />
        {/* Adding the circle markers to the map */}
        {points.map((point) => {
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
              radius={radius}
              color={fillColor} // Border color of the dot
              stroke={false} // Fill color for the dot
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
