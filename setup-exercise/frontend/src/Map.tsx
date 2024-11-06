import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import "./map.css";
type CarSharingPoint = {
  capacity: number;
  district: string;
  latitude: number;
  longitude: number;
  name: string;
  provider: string;
  address: Address;
  picture: string;
};

type Address = {
  street: string;
  number: string;
};

const Map = () => {
  const [data, setData] = useState<CarSharingPoint[]>([]);

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

  const renderPoints = (data: CarSharingPoint[]) => {
    return data.map((point) => {
      return (
        <Marker
          key={point.name}
          position={[point.latitude, point.longitude]}
        >
          <Popup>
            <CustomPopup data={point} />
          </Popup>
        </Marker>
      );
    });
  }

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
         { data.length > 0 && renderPoints(data) }
         {/* red circle at the coordinates of the university */}
          <Circle
              center={[47.69162, 9.187]}
              pathOptions={{ color: 'red' }}
              radius={10}
          />
      </MapContainer>

  );
};

export default Map;

interface CustomPopupProps {
  data : CarSharingPoint;
}
/**
 * In the popup, you should include the following details about the sharing point:
• the name of the sharing point,
• its coordinates,
• the capacity of cars,
• the address, and
• the provider.
If available, you should also display an image of the sharing point
 * @param param0 
 */
const CustomPopup = ({ data }: CustomPopupProps) => {
  return (
    <div>
      <h2>{data.name}</h2>
      <p>Coordinates: {data.latitude.toFixed(5)}, {data.longitude.toFixed(5)}</p>
      <p>Capacity: {data.capacity}</p>
      <p>Address: {data.address.street} {data.address.number}</p>
      <p>Provider: {data.provider}</p>
      {data.picture && <img src={data.picture} alt={data.name} />}
    </div>
  );
}

