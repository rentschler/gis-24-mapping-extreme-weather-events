interface CarSharingPoint {
  address: {
    street: string;
    number: string;
  };
  capacity: number;
  distance?: number;
  latitude: number;
  longitude: number;
  name: string;
  picture: string;
  provider: string;
}

export default CarSharingPoint;
