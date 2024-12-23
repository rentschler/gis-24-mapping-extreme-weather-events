import { useState, useEffect } from "react";
import { Geometry, Feature } from 'geojson';

import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord } from "../types/response";

// Sample GeoJSON (you would typically fetch this from an API or import it)
import geojsonData from '../combined_reports.geo.json'; // Replace with your actual geoJSON file
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { QueryState } from "../store/settingsSlice";
import Map from "./Map";

/**
 * data fetching and processing happens in this component
 * @returns 
 */
const MapWrapper = () => {


  const {
    filters
  } = useSelector((state: RootState) => state.query);
  const {
    options
  } = useSelector((state: RootState) => state.vis);

  const [rawData, setRawData] = useState<MeteorologicalEventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState("")

  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [generalReportPoints, setGeneralReportPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [matchingPolygons, setMatchingPolygons] = useState<Feature[]>([]);

  useEffect(() => {
    const fetchPoints = async () => {
      // setIsLoading(true);
      try {
        const payLoad: { filters: QueryState } = {
          filters: filters
        }
        console.log("filters:", filters);

        const response = await fetch("/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        });
        if (response.ok) {
          const data = await response.json() as MeteorologicalEventRecord[];
          console.log("Fetched data:", data);
          setRawData(data);
        } else {
          console.error("Failed fetching api data:", response);
          setHasError("Failed fetching api data:");
        }
      } catch (error) {
        console.error("Error fetching api data:", error);
        setHasError("Failed fetching api data:");
      }
    };
    fetchPoints();
  }, [filters]);

  useEffect(() => {
    if (!rawData) return;
    // filter points 
    // NOTE: THIS IS A GENERAL COLLECTIVE REPORT FOR THE NUMBER OF FATALITIES CAUSED BY VIOLENT FLASH FLOODS 

    const eventPoints: MeteorologicalEventRecord[] = [];
    const reportPoints: MeteorologicalEventRecord[] = [];

    rawData.forEach((point) => {
      if (point.event.event_description?.startsWith("NOTE: THIS IS A GENERAL COLLECTIVE REPORT")) {
        reportPoints.push(point);
      } else {
        // in case we only want to show events with description, we skip them
        if (options.hideEventsWithoutDescription && !point.event.event_description) return;
        eventPoints.push(point);
      }
    });

    // Extract the ids from general report points
    const reportIds = new Set(reportPoints.map((point) => point.id));


    // Filter the polygons based on matching foreign keys
    const matchingPolygons = geojsonData.features.filter((feature) =>
      reportIds.has(feature.foreign_key)
    ) as Feature<Geometry>[];


    // Update state with new filtered points
    setPoints(eventPoints);
    // console.log("Remaining points:", eventPoints);

    setGeneralReportPoints(reportPoints);
    // console.log("General report points:", reportPoints);

    setMatchingPolygons(matchingPolygons);
    // console.log("MatchingPolygons:", matchingPolygons);

    setIsLoading(false);
  }, [options.hideEventsWithoutDescription, rawData])

  if (hasError){
    return <h1>{hasError}</h1>
  }

  if (isLoading){
    return <h1>Loading...</h1>
  }

  return (
    <Map points={points} generalReportPoints={generalReportPoints} matchingPolygons={matchingPolygons}></Map>
  )
}


export default MapWrapper;