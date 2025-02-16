
import { MeteorologicalEventRecord } from "../../types/response";
import { CircleMarker, Popup } from "react-leaflet";
import MapPopup from "../../components/popup/MapPopup";

interface SimplePointsProps {
  points: MeteorologicalEventRecord[];
  radius: number;
  colorScale: d3.ScaleSequential<string, never>;
}


const SimplePoints: React.FC<SimplePointsProps> = ({ points, radius, colorScale}) =>  {
 
    return points.map((point) => {
      const latitude = point.location.coordinates.latitude
      const longitude = point.location.coordinates.longitude
      if (!latitude || !longitude) return null;
      let fillColor = "grey";
      if (point.event.impacts) {
        const impacts = point.event.impacts;
        fillColor = colorScale(impacts.length);
      }

      return (
        <CircleMarker
          key={point.id}
          center={[latitude, longitude]}
          radius={radius}
          color={fillColor} // Border color of the dot
          stroke={false} // Fill color for the dot
          fillOpacity={1} // Opacity of the fill color
        > <Popup
          pane="popupPane"
        >
            <MapPopup record={point} />
          </Popup>
        </CircleMarker>
      );
    });
    
    
}


export default SimplePoints;