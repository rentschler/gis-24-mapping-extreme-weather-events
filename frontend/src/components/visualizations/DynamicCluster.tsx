
import MarkerClusterGroup from "react-leaflet-markercluster";
import { MeteorologicalEventRecord } from "../../types/response";
import L, { MarkerCluster } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";
import MapPopup from "../../components/popup/MapPopup";

const customClusterIcon = (cluster: MarkerCluster): L.DivIcon => {

  const getClusterColor = (value: number) => {
    if (value <= 10) return "rgba(181, 226, 140, 1)";
    if (value <= 100) return "rgba(241, 211, 87, 1)";
    else return "rgba(253, 156, 115, 1)";
  };

  var childCount = cluster.getChildCount();
  var markers = cluster.getAllChildMarkers(); // Gets all Markers, but does not contain all impacts :c

  const impactFrequencies: Record<number, number> = {};
  let totalSum = 0;

  markers.forEach((marker: any) => {
    const impacts = (marker.options as any).color;

    if (impacts !== null && impacts !== undefined) {
      impactFrequencies[impacts] = (impactFrequencies[impacts] || 0) + 1;
      totalSum += 1;
    }
  });


  if (Object.keys(impactFrequencies).length <= 1) {
    // dont render if too little points are aggregated
    return L.divIcon({
      html: `<div style="
                background-color: ${getClusterColor(childCount)};
                color: black;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                ">
                ${childCount}
              </div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(40, 40),
    });
  }

  // This has only few segments
  const segments = Object.entries(impactFrequencies).map(([key, count]) => ({
    value: (count / totalSum) * 360, // Proportion of the circle
    label: key, // Label for the segment (0, 1, 2, etc.)
  }));


  const radius = 25;
  const overlayRadius = 18;

  // Generate SVG paths for each segment of the pie chart
  let currentAngle = 0;
  const svgSegments = segments.map(({ value, label }) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + value;
    currentAngle = endAngle;

    // Convert angles to SVG path coordinates
    const largeArcFlag = value > 180 ? 1 : 0;
    const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    // Get the color for this segment based on the value
    const color = label;

    return `<path d="M${radius},${radius} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z" fill="${color}" />`;
  });


  // Render the total count at the center of the pie chart
  return L.divIcon({
    html: `
      <svg width="${2 * radius}" height="${2 * radius}" viewBox="0 0 ${2 * radius} ${2 * radius}" xmlns="http://www.w3.org/2000/svg">
      <!-- Full-sized pie chart circle -->
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${getClusterColor(childCount)}" stroke="none" />
      
      <!-- Pie chart segments -->
          ${svgSegments.join('')}
  
          <!-- Half-sized overlay circle -->
          <circle cx="${radius}" cy="${radius}" r="${overlayRadius}" fill="${getClusterColor(childCount)}" stroke="black" stroke-width="1" />
          
          <!-- Display total count in the center -->
          <text x="${radius}" y="${radius + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="black">
          ${markers.length}
          </text>
          </svg>
          `,
    className: 'custom-cluster-icon',
    iconSize: L.point(2 * radius, 2 * radius), // Ensure icon size is adjusted
  });



};

interface DynamicClusterProps { 
  points: MeteorologicalEventRecord[];
  radius: number;
  colorScale: d3.ScaleSequential<string, never>;
}

const DynamicCluster: React.FC<DynamicClusterProps> = ({ points, radius, colorScale }) => {
    return (
        
    <MarkerClusterGroup
    iconCreateFunction={customClusterIcon}
    disableClusteringAtZoom={12}
  >

    {points.map((point) => {
      const latitude = point.location.coordinates.latitude
      const longitude = point.location.coordinates.longitude
      if (!latitude || !longitude) return null;

      let fillColor = "grey";
      if (point.event.impacts) {
        const impacts = point.event.impacts;
        fillColor = colorScale(impacts.length);
      }


      // Dynamically calculate the radius based on the zoom level
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
    })}
  </MarkerClusterGroup>
    )
};

export default DynamicCluster;


/**
 * 
 * DEPRECATED OLD IMPLEMENTATION BUT WITH CUSTOM DATA IN MARKERS: 
 * import MarkerClusterGroup from react-leaflet-cluster
 * { 
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={customClusterIcon}
      >
        
        {points.map((point) => {
          const latitude = point.location.coordinates.latitude
          const longitude = point.location.coordinates.longitude
          if (!latitude || !longitude) return null;
          let fillColor = "grey";
          
          if (point.event.impacts) {
            const impacts = point.event.impacts;
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
              eventHandlers={{
                add: (e) => {
                  const marker = e.target as L.CircleMarker;
                  (marker.options as any).impact_size = point.event.impacts?.length; // Attach `point` to marker options
                },
              }}
            > <Popup>
                <MapPopup record={point} />
              </Popup>
            </CircleMarker>
          );
        })}
        
      </MarkerClusterGroup> }
 * 
 */