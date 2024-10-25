import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const Map = () => {
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
