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
  showPointEvents: boolean;
  showAggregatedEvents: boolean;
  showSummaries: boolean;
  hideEventsWithoutDescription: boolean;
};

export const initialQueryState: QueryState = {
  timeRange: ['2021-01-01', '2021-12-01'],
  impactRange: [1, 10],
  impactCodes: [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1],
  qcLevels: [QCLevel.QC1, QCLevel.QC2],
  infoSources: [],
};

export const initialVisualState: VisualState = {
  showPointEvents: true,
  showAggregatedEvents: false,
  showSummaries: false,
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
      setShowPointEvents: (state, action) => {
        state.hasChanged = true;
        state.visOptions.showPointEvents = action.payload;
      },
      setShowAggregatedEvents: (state, action) => {
        state.hasChanged = true;

        state.visOptions.showAggregatedEvents = action.payload;
      },
      setShowSummaries: (state, action) => {
        state.hasChanged = true;

        state.visOptions.showSummaries = action.payload;
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
    },
  });


export const {
    setTimeRange,
    setShowPointEvents,
    setShowAggregatedEvents,
    setShowSummaries,
    setHideEventsWithoutDescription,
    setImpactRange,
    setImpactCodes,
    setQCLevels,
    setInfoSources,
    setHasChanged,
  } = settingsSlice.actions;
  
  export default settingsSlice.reducer;