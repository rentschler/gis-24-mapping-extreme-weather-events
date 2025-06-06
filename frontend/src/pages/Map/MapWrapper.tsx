import { useState, useEffect } from "react";
import { Geometry, Feature, FeatureCollection } from 'geojson';
import "leaflet/dist/leaflet.css";
import { MeteorologicalEventRecord } from "../../types/response";

// Sample GeoJSON (you would typically fetch this from an API or import it)
import geojsonData from '../../combined_reports.geo.json'; // geojsons for general report points
import adminJsonData from "../../europe_admin.geo.json";  // geojsons for administrative boundaries
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { QueryState } from "../../store/settingsSlice";
import Map from "../Map";
import { message } from 'antd';

/**
 * data fetching and processing happens in this component
 * @returns 
 */
const MapWrapper = () => {

  const [messageApi, contextHolder] = message.useMessage();

  const displayLoadingMessage = () => {
    messageApi.open({
      type: 'loading',
      content: 'Loading data...',
      duration: 0,
      key: 'loading',
    });
    // Dismiss manually and asynchronously
    // setTimeout(messageApi.destroy, 2500);
  };
  const displayChoroplethMessage = () => {
    messageApi.open({
      type: 'loading',
      content: 'Loading choropleth data...',
      duration: 0,
      key: 'choropleth',
    });
    // Dismiss manually and asynchronously
    // setTimeout(messageApi.destroy, 2500);
  };


  // query filter state (e.g. time range, impact codes, etc)
  const {
    filters
  } = useSelector((state: RootState) => state.query);
  // vis options state (e.g. showHeatmap, show react cluster markers, etc)
  const {
    options
  } = useSelector((state: RootState) => state.vis);

  const [rawData, setRawData] = useState<MeteorologicalEventRecord[]>([]);
  const [hasError, setHasError] = useState("")

  const [points, setPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [generalReportPoints, setGeneralReportPoints] = useState<MeteorologicalEventRecord[]>([]);
  const [matchingPolygons, setMatchingPolygons] = useState<Feature[]>([]);
  const [dbscanFeatureCollection, setAdminPoints] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  // coropleth data
  const [administrativeBoundaries, setAdministrativeBoundaries] = useState<Feature<Geometry>[]>([]);

  useEffect(() => {
    const fetchPoints = async () => {
      // open the loading message
      displayLoadingMessage();
      try {
        const payLoad: { filters: QueryState } = {
          filters: filters
        }
        // console.log("filters:", filters);

        const response = await fetch("/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        });


        if (response.ok) {
          const data = await response.json() as MeteorologicalEventRecord[];
          // console.log("Fetched data:", data);
          setRawData(data);

        } else {
          console.error("Failed fetching api data:", response);
          setHasError("Failed fetching api data:");
        }

        // Fetch cluster points
        const dbscan_response = await fetch("/api/cluster", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        });
        if (dbscan_response.ok) {
          const dbscan_data = await dbscan_response.json() as FeatureCollection;
          // console.log("DBSCAN Data: ", dbscan_data);
          setAdminPoints(dbscan_data);
        }


        // Query API Choropleth
        displayChoroplethMessage();
        const geometry_response = await fetch("/api/data/feature_list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            filters: filters,
            geojsons: adminJsonData.features as Feature<Geometry>[]
          }),
        });
  
        if (geometry_response.ok) {
          const geometry_data = await geometry_response.json() as Feature<Geometry>[];
  
          console.log("Administrative Data: ", geometry_data);
          // setAdminstrativePoints(geometry_data);
          setAdministrativeBoundaries(geometry_data);
          messageApi.destroy('choropleth');
        }
        

      } catch (error) {
        console.error("Error fetching api data:", error);
        setHasError("Failed fetching api data:");
      }
    };
    fetchPoints();
  }, [filters]);

  useEffect(() => {
    if (!rawData || rawData.length < 1) return;
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

    // close the loading message
    messageApi.destroy('loading');
  }, [options.hideEventsWithoutDescription, rawData])

  if (hasError) {
    return <h1>{hasError}</h1>
  }

  return (
    <>
      {contextHolder}
      <Map
        points={points}
        generalReportPoints={generalReportPoints}
        matchingPolygons={matchingPolygons}
        dbscanData={dbscanFeatureCollection}
        administrativeBoundaries={administrativeBoundaries}
      ></Map>
    </>
  )
}


export default MapWrapper;