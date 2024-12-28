
import { MeteorologicalEventRecord } from "../../types/response";
import { CircleMarker, Popup } from "react-leaflet";
import MapPopup from "../../components/popup/MapPopup";

const SimplePoints: React.FC<{ points: MeteorologicalEventRecord[], radius: number }> = ({ points, radius}) =>  {
 
    return points.map((point) => {
      const latitude = point.location.coordinates.latitude
      const longitude = point.location.coordinates.longitude
      if (!latitude || !longitude) return null;
      let fillColor = "grey";
      if (point.event.impacts) {
        const impacts = point.event.impacts;
        fillColor = impacts.length > 2 ? impacts.length > 4 ? "red" : "orange" : "yellow";
      }

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
    });
    
    
}


export default SimplePoints;