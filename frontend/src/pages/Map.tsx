import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON, Polygon } from "react-leaflet";
import { useState, useEffect } from "react";
import { FeatureCollection, GeoJsonProperties, Geometry, Feature, GeoJsonObject } from 'geojson';


import "leaflet/dist/leaflet.css";
import { ImpactCode, MeteorologicalEventRecord, QCLevelDescriptions } from "../types/response";
import { getImpactDescription, parseImpactCode } from "../types/parsing";
import MapPopup from "../components/popup/MapPopup";
import React from "react";

import MarkerClusterGroup  from 'react-leaflet-cluster';
import L, {MarkerCluster} from "leaflet";



// Sample GeoJSON (you would typically fetch this from an API or import it)
import geojsonData from '../combined_reports.geo.json'; // Replace with your actual geoJSON file

// A wrapper for CircleMarker that accepts customData

const customClusterIcon = (cluster: MarkerCluster): L.DivIcon => {
  const count = cluster.getChildCount();

  // Get all child markers in the cluster
  const markers = cluster.getAllChildMarkers();
  
  const getClusterColor = (value: number) => {
    if(value <= 10) return "rgba(181, 226, 140, 1)";
    if(value <= 100) return "rgba(241, 211, 87, 1)";
    else return "rgba(253, 156, 115, 1)";
  };


  if(count < 10){
    // dont render if too little points are aggregated
    return L.divIcon({
      html: `<div style="
              background-color: ${getClusterColor(count)};
              color: black;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              ">
              ${count}
            </div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(40, 40),
    });
  }

  // Function to assign color based on the value
  const getColor = (value: string) => {
    if (value === '0') return 'grey';    // Grey for value 0
    if (value === '1') return 'yellow';  // Yellow for value 1
    if (value === '2') return 'orange';  // Orange for value 2
    return 'red';                        // Red for other values
  };


  // Extract and process the custom data from each marker
  const customData = markers.map(marker => (marker.options as any).impact_size);
  const filteredData = customData.filter(data => data !== null && data !== undefined) as number[];
  
 

  // Aggregate the data for the donut chart
  const classes = filteredData.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Conditional logic: check if there is exactly 1 key in the frequency map
  if(Object.keys(classes).length <= 1){
    // dont render if too little points are aggregated
    return L.divIcon({
      html: `<div style="
              background-color: ${getClusterColor(count)};
              color: black;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              ">
              ${count}
            </div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(40, 40),
    });
  }

  // Convert the frequency map into a pie chart
  const total = Object.values(classes).reduce((sum, value) => sum + value, 0);
  const segments = Object.entries(classes).map(([key, count]) => ({
    value: (count / total) * 360, // Proportion of the circle
    label: key, // Label for the segment (0, 1, 2, etc.)
  }));

  
  // Increase the radius to 30 (default was 16)
  const radius = 25;
  const overlayRadius = 18; // Half the radius for the overlay circle

  // Generate SVG paths for each segment of the pie chart
  let currentAngle = 0;
  const svgSegments = segments.map(({ value, label }) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + value;
    currentAngle = endAngle;

    // Convert angles to SVG path coordinates
    const largeArcFlag = value > 180 ? 1 : 0;
    const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    // Get the color for this segment based on the value
    const color = getColor(label);

    return `<path d="M${radius},${radius} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z" fill="${color}" />`;
  });



  // Render the total count at the center of the pie chart
  return L.divIcon({
    html: `
      <svg width="${2 * radius}" height="${2 * radius}" viewBox="0 0 ${2 * radius} ${2 * radius}" xmlns="http://www.w3.org/2000/svg">
        <!-- Full-sized pie chart circle -->
        <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${getClusterColor(count)}" stroke="none" />

        <!-- Pie chart segments -->
        ${svgSegments.join('')}

        <!-- Half-sized overlay circle -->
        <circle cx="${radius}" cy="${radius}" r="${overlayRadius}" fill="${getClusterColor(count)}" stroke="black" stroke-width="1" />

        <!-- Display total count in the center -->
        <text x="${radius}" y="${radius + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="black">
          ${markers.length}
        </text>
      </svg>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(2 * radius, 2 * radius), // Ensure icon size is adjusted
  });
};


const Map = () => {

  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);
  
  const [generalReportPoints, setGeneralReportPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [matchingPolygons, setMatchingPolygons] = useState<Feature[]>([]);

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
          // console.log("Remaining points:", eventPoints);

          setGeneralReportPoints(reportPoints);
          // console.log("General report points:", reportPoints);

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
  }, []);


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
        
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={customClusterIcon}
      >
        
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
              eventHandlers={{
                add: (e) => {
                  const marker = e.target as L.CircleMarker;
                  (marker.options as any).impact_size = parseImpactCode(point.event.impacts ?? "").length; // Attach `point` to marker options
                },
              }}
            > <Popup>
                <MapPopup record={point} />
              </Popup>
            </CircleMarker>
          );
        })}
        
      </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Map;
