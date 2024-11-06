import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const Map = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = (endpoint: string) => {
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setData(data);
                    console.log("data", data);
                }
            })
            .catch(err => console.log(err));
    };

    fetchData("/api/car_sharing/points");
    return () => {
        isMounted = false;
    };
}, []);

  return (
    <MapContainer
      center={[47.69162, 9.187]}
      className="w-screen h-screen"
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[47.69162, 9.187]}>
        <Popup>Here is our university!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
