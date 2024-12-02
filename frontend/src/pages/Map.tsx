import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";


import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord, QCLevelDescriptions } from "../types/response";
import { getImpactDescription, parseImpactCode } from "../types/parsing";
import MapPopup from "../components/popup/MapPopup";
import React from "react";

const Map = () => {
  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);
  const mapRef = React.useRef(null);
  const [zoomLevel, setZoomLevel] = useState(8); // Default zoom level

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch("/api/data");
        if (response.ok) {
          const data = await response.json() as MeteorologicalEventRecord[];
          console.log(data);
          setPoints(data);  // Save fetched data to state

          const dict: { [key: string]: Set<string> } = {};
          data.forEach((point) => {
            const keys = Object.keys(point);
            keys.forEach((key) => 
              // @ts-ignore
              dict[key] = dict[key] ? dict[key].add(point[key]) : new Set([point[key]])
            );
          }
          );

          console.log(dict);
          console.log(QCLevelDescriptions);
          console.log(parseImpactCode(data[0].impacts||"").map((code) => getImpactDescription(code)));
          
          
          

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
    const calculateRadius = (zoom:number) => {
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
        {points.map((point) => {
          const latitude = point.latitude
          const longitude = point.longitude
          if(!latitude || !longitude) return null;
          let fillColor = "grey";
          if(point.impacts){
            const impacts = parseImpactCode(point.impacts);
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
