import { createSlice } from "@reduxjs/toolkit";
import { ImpactCode, InfoSource, QCLevel } from "../types/response";

/**
 *   settings: 
 * {
    timeRange: [string, string], // date Format: 'YYYY-MM-DD'
    showPointEvents: boolean,
    showAggregatedEvents: boolean,
    showSummaries: boolean,
    hideEventsWithoutDescription: boolean,
    numberOfImpacts: [number, number],
    impactCodes: ImpactCode[] // enum, e.g., ['T1', 'T2']
    qcLevels: QCLevel[] // enum, e.g., ['QC0+', 'QC1']
    infoSources: InfoSource[] // enum, e.g., ['WWW', 'TV']
  },
 */


type SettingsState = {
  queryFilters: QueryState;
  visOptions: VisualState;
  hasChanged: boolean
};

export type QueryState = {
  timeRange: [string, string]; // date Format: 'YYYY-MM-DD'
  impactRange: [number, number]; // [min, max]
  impactCodes: ImpactCode[]; // enum, e.g., ['T1', 'T2']
  qcLevels: QCLevel[]; // enum, e.g., ['QC0+', 'QC1']
  infoSources: InfoSource[]; // enum, e.g., ['WWW', 'TV']
};

export type VisualState = {
  showSimplePointMap: boolean;
  showReportPolygons: boolean;
  showDynamicClustering: boolean;
  showHeatmap: boolean;
  hideEventsWithoutDescription: boolean;
};

export const initialQueryState: QueryState = {
  timeRange: ['2021-01-01', '2021-12-01'],
  impactRange: [0, 100],
  impactCodes: [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1],
  qcLevels: [QCLevel.QC1, QCLevel.QC2],
  infoSources: [],
};

export const initialVisualState: VisualState = {
  showSimplePointMap: true,
  showReportPolygons: false,
  showDynamicClustering: false,
  showHeatmap: false,
  hideEventsWithoutDescription: false,
};


 const initialState: SettingsState = {
  queryFilters: initialQueryState,
  visOptions: initialVisualState,
  hasChanged: false,
}

  const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      setTimeRange: (state, action) => {
        state.hasChanged = true;
        state.queryFilters.timeRange = action.payload;
      },
      setShowSimplePointMap: (state, action) => {
        state.hasChanged = true;
        state.visOptions.showSimplePointMap = action.payload;
      },
      setShowReportPolygons: (state, action) => {
        state.hasChanged = true;
        state.visOptions.showReportPolygons = action.payload;
      },
      setShowDynamicClustering: (state, action) => {
        state.hasChanged = true;
        state.visOptions.showDynamicClustering = action.payload;
      },
      setShowHeatmap: (state, action) => {
        state.hasChanged = true;
        state.visOptions.showHeatmap = action.payload;
      },
      setHideEventsWithoutDescription: (state, action) => {
        state.hasChanged = true;

        state.visOptions.hideEventsWithoutDescription = action.payload;
      },
      setImpactRange: (state, action) => {
        state.hasChanged = true;

        state.queryFilters.impactRange = action.payload;
      },
      setImpactCodes: (state, action) => {
        state.hasChanged = true;

        state.queryFilters.impactCodes = action.payload;
      },
      setQCLevels: (state, action) => {
        state.hasChanged = true;

        state.queryFilters.qcLevels = action.payload;
      },
      setInfoSources: (state, action) => {
        state.hasChanged = true;

        state.queryFilters.infoSources = action.payload;
      },
      setHasChanged: (state, action) => {
        state.hasChanged = action.payload
      },
      setInitialState: (state) => {
        state.queryFilters = initialQueryState;
        state.visOptions = initialVisualState;
        state.hasChanged = false
      }
    },
  });


export const {
    setTimeRange,
    setShowSimplePointMap,
    setShowReportPolygons,
    setShowDynamicClustering,
    setShowHeatmap,
    setHideEventsWithoutDescription,
    setImpactRange,
    setImpactCodes,
    setQCLevels,
    setInfoSources,
    setHasChanged,
    setInitialState
  } = settingsSlice.actions;
  
  export default settingsSlice.reducer;