import { MapContainer, Marker, Popup, TileLayer, CircleMarker  } from "react-leaflet";
import React, { useState, useEffect } from "react";


import "leaflet/dist/leaflet.css";

const Map = () => {
  const [points, setPoints] = useState([]);

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
    <div style={{ height: "500px" }}>
    <MapContainer
      center={[47.69162, 9.187]}
      className="w-screen h-screen"
      zoom={8}
    >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => {
          const latitude = point["LATITUDE"];
          const longitude = point["LONGITUDE"];
          return (
              <CircleMarker
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
