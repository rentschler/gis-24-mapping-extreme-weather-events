import {MapContainer, TileLayer, useMap, Pane} from "react-leaflet";
import {useState, useEffect, useMemo} from "react";
import {GeoJsonProperties, Geometry, Feature, FeatureCollection} from 'geojson';

import "leaflet/dist/leaflet.css";
import {MeteorologicalEventRecord} from "../types/response";
import React from "react";


import DynamicCluster from "../components/visualizations/DynamicCluster";
import SimplePoints from "../components/visualizations/SimplePoints";
import ReportPointsPolygons from "../components/visualizations/ReportPointsPolygons";
import Choropleth from "../components/visualizations/Choropleth";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import DBSCAN from "../components/visualizations/DBSCAN";
import LegendLeaflet from "../components/legend/LegendLeaflet.tsx";
import * as d3 from "d3";
// Sample GeoJSON (you would typically fetch this from an API or import it)
/* import { useSelector } from "react-redux";
import { RootState } from "../store/store"; */


/**
 *
 * @todo
 * - Aggregation Visualizations (can be calculated once per API call)
 * - Heatmap Visualization
 */

interface MapProps {
  points: MeteorologicalEventRecord[],
  generalReportPoints: MeteorologicalEventRecord[],
  matchingPolygons: Feature<Geometry, GeoJsonProperties>[],
  dbscanData: FeatureCollection,
  administrativeBoundaries: Feature<Geometry>[]

}

const Map = ({points, generalReportPoints, matchingPolygons, dbscanData, administrativeBoundaries}: MapProps) => {
  /* Do we need this? yes to render the visualizations on demand*/
  const {
    options
  } = useSelector((state: RootState) => state.vis);


    const [minVal, maxVal] = useMemo(() => {
        return [0, Math.max(...points.map(p => p.event.impacts?.length || 0))];
    }, [points]);

    const colorScale = useMemo(() => {
        // d3.interpolateBlues for precipitation and d3.interpolateRdYlBu for impact
        return d3.scaleSequential(d3.interpolateReds)
                .domain([minVal || 0, maxVal || 1])
    }, [minVal, maxVal]);

  // console.log(points, generalReportPoints, matchingPolygons);

  const [zoomLevel, setZoomLevel] = useState(8); // Default zoom level
  const mapRef = React.useRef(null);


  // Custom component to listen to map zoom changes
  const ZoomListener = () => {
    const map = useMap();
    useEffect(() => {
      const handleZoom = () => {
        // console.log("Zoom level:", map.getZoom(), "radius:", calculateRadius(map.getZoom()));


        setZoomLevel(map.getZoom());
      };
      map.on('zoomend', handleZoom);
      return () => {
        map.off('zoomend', handleZoom);
      };
    }, [map]);
    return null;
  };

  // Function to calculate radius based on zoom level
  const calculateRadius = (zoom: number) => {
    // Example of an exponential function
    const baseRadius = 1.8; // Minimum radius
    const growthFactor = 1.3; // Adjust for scaling rate
    return baseRadius * Math.pow(growthFactor, zoom - 5); // Scale exponentially from zoom level 5
  };


// Leaflet defines the default pane z-indices as follows:
//
// tilePane: 200
// overlayPane: 400
// shadowPane: 500
// markerPane: 600
// tooltipPane: 650
// popupPane: 700

  return (
      <div className="map-container px-2">
        <MapContainer center={[47.69162, 9.187]} zoom={8} className="map-content">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

          {/* Heat map: rendered at the bottom */}
          <Pane name="heatmapPane" style={{zIndex: 501}}>
            {options.showHeatmap && (
                <Choropleth adminBoundaries={administrativeBoundaries}/>
            )}
          </Pane>

          {/* Report polygons: on top of heat map */}
          <Pane name="reportPolygonsPane" style={{zIndex: 502}}>
            {options.showReportPolygons && (
                <ReportPointsPolygons
                    generalReportPoints={generalReportPoints}
                    matchingPolygons={matchingPolygons}
                />
            )}
          </Pane>

          {/* DBSCAN layer: on top of the DBSCan */}
          <Pane name="dbscanPane" style={{zIndex: 503}}>
            {options.showDBSCANMap && <DBSCAN data={dbscanData}/>}
          </Pane>


          {/* Simple point markers: on top of report polygons */}
          <Pane name="pointMarkersPane" style={{zIndex: 601}}>
            {options.showSimplePointMap && 
            points && points.length > 0 && colorScale && (
                <SimplePoints colorScale={colorScale} points={points} radius={calculateRadius(zoomLevel)}/>
            )}
          </Pane>

          {/* Cluster markers: rendered on top of everything else */}
          <Pane name="clusterMarkersPane" style={{zIndex: 602}}>
            {options.showDynamicClustering && 
            points && points.length > 0 && colorScale && (
                <DynamicCluster colorScale={colorScale} points={points} radius={calculateRadius(zoomLevel)}/>
            )}
          </Pane>

          {/*        impacts legend*/}

          {points && points.length > 0 && colorScale && <LegendLeaflet colorScale={colorScale} domain={colorScale.domain()} type={"impact"} title={"Impacts"}/>}

        </MapContainer>


      </div>
  );
};

export default Map;
