import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import CarSharingPoint from "./CarSharingPoint.ts";
import { universityOfKonstanzCoordinates } from "./constants.ts";
import "leaflet/dist/leaflet.css";

const fetchSharingPoints = async () => {
  const { data: sharingPoints } = await axios.get("/api/car-sharing/points");

  return sharingPoints;
};

const CarSharingPointMarker = ({
  carSharingPoint,
}: {
  carSharingPoint: CarSharingPoint;
}) => {
  return (
    <Marker position={[carSharingPoint.latitude, carSharingPoint.longitude]}>
      <Popup>
        <div className="flex flex-col">
          <h6 className="font-bold text-lg leading-none">
            {carSharingPoint.name}
          </h6>
          <span className="mt-0.5 font-light text-slate-400 italic text-xs">
            {carSharingPoint.latitude.toFixed(5)},{" "}
            {carSharingPoint.longitude.toFixed(5)}
          </span>
          <div className="flex flex-col">
            <span className="mt-1 font-bold text-lg">
              🚘 {carSharingPoint.capacity}
            </span>
            <div className="mt-3 flex flex-col">
              <span>
                📍 {carSharingPoint.address.street}{" "}
                {carSharingPoint.address.number}
              </span>
              <span>🏢 {carSharingPoint.provider}</span>
            </div>
          </div>
          {carSharingPoint.picture && (
            <img
              alt={`A car sharing point in Konstanz called ${carSharingPoint.name}`}
              className="mt-3"
              src={carSharingPoint.picture}
            />
          )}
        </div>
      </Popup>
    </Marker>
  );
};

const Map = () => {
  const {
    data: carSharingPoints,
    error,
    isError,
    isPending,
  } = useQuery<CarSharingPoint[]>({
    queryKey: ["sharing-points"],
    queryFn: fetchSharingPoints,
  });

  if (isError) {
    console.log(
      `An error occurred, while fetch the car sharing points: ${error}`,
    );
  }

  return (
    <MapContainer
      center={universityOfKonstanzCoordinates}
      className="w-screen h-screen"
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={universityOfKonstanzCoordinates}
        pathOptions={{ fillColor: "red", fillOpacity: 1, stroke: false }}
        radius={5}
      />
      {!isPending &&
        carSharingPoints &&
        carSharingPoints.map((carSharingPoint, index) => (
          <CarSharingPointMarker
            carSharingPoint={carSharingPoint}
            key={index}
          />
        ))}
    </MapContainer>
  );
};

export default Map;
