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
  visualFilters: VisualState;
};

export type QueryState = {
  timeRange: [string, string]; // date Format: 'YYYY-MM-DD'
  numberOfImpacts: [number, number]; // [min, max]
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
  numberOfImpacts: [2, 10],
  impactCodes: [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1],
  qcLevels: [QCLevel.QC1, QCLevel.QC2],
  infoSources: [InfoSource.GOV, InfoSource.NWSP],
};

export const initialVisualState: VisualState = {
  showPointEvents: true,
  showAggregatedEvents: false,
  showSummaries: false,
  hideEventsWithoutDescription: false,
};


 const initialState: SettingsState = {
  queryFilters: initialQueryState,
  visualFilters: initialVisualState,
}

  const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      updateTimeRange: (state, action) => {
        state.queryFilters.timeRange = action.payload;
      },
      setShowPointEvents: (state, action) => {
        state.visualFilters.showPointEvents = action.payload;
      },
      setShowAggregatedEvents: (state, action) => {
        state.visualFilters.showAggregatedEvents = action.payload;
      },
      setShowSummaries: (state, action) => {
        state.visualFilters.showSummaries = action.payload;
      },
      setHideEventsWithoutDescription: (state, action) => {
        state.visualFilters.hideEventsWithoutDescription = action.payload;
      },
      setNumberOfImpacts: (state, action) => {
        state.queryFilters.numberOfImpacts = action.payload;
      },
      setImpactCodes: (state, action) => {
        state.queryFilters.impactCodes = action.payload;
      },
      setQCLevels: (state, action) => {
        state.queryFilters.qcLevels = action.payload;
      },
      setInfoSources: (state, action) => {
        state.queryFilters.infoSources = action.payload;
      },
    },
  });


export const {
    updateTimeRange,
    setShowPointEvents,
    setShowAggregatedEvents,
    setShowSummaries,
    setHideEventsWithoutDescription,
    setNumberOfImpacts,
    setImpactCodes,
    setQCLevels,
    setInfoSources,
  } = settingsSlice.actions;
  
  export default settingsSlice.reducer;