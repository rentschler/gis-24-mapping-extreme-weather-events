import { MapContainer, TileLayer, CircleMarker  } from "react-leaflet";
import { useState, useEffect } from "react";


import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord } from "../types/response";

const Map = () => {
  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch("/api/data");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPoints(data);  // Save fetched data to state
        } else {
          console.error("Failed fetching api data:", response);
        }
      } catch (error) {
        console.error("Error fetching api data:", error);
      }
    };

    fetchPoints();
  }, []);

  return (
    <div className="map-container px-3">
          <MapContainer
      center={[47.69162, 9.187]}
      className="map-content"
      zoom={8}
    >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => {
          const latitude = point.latitude
          const longitude = point.longitude
          if(!latitude || !longitude) return null;
          return (
              <CircleMarker
                key={point.id}
                center={[latitude, longitude]}
                radius={2} // Radius of the dot, adjust as needed
                color="red" // Border color
                fillColor="red" // Fill color for the dot
                fillOpacity={1} // Opacity of the fill color
              ></CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
