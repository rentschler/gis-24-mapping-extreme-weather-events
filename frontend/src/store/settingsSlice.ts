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
    timeRange: [string, string]; // [startDate, endDate]
    showPointEvents: boolean;
    showAggregatedEvents: boolean;
    showSummaries: boolean;
    hideEventsWithoutDescription: boolean;
    numberOfImpacts: [number, number]; // [min, max]
    impactCodes: ImpactCode[]; // enum, e.g., ['T1', 'T2']
    qcLevels: QCLevel[]; // enum, e.g., ['QC0+', 'QC1']
    infoSources: InfoSource[]; // enum, e.g., ['WWW', 'TV']
};

const initialState: SettingsState = {
    timeRange: ['2021-01-01', '2021-12-01'],
    showPointEvents: true,
    showAggregatedEvents: false,
    showSummaries: false,
    hideEventsWithoutDescription: false,
    numberOfImpacts: [2, 10],
    impactCodes: [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1],
    qcLevels: [QCLevel.QC1, QCLevel.QC2],
    infoSources: [InfoSource.GOV, InfoSource.NWSP],
  };

  const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      updateTimeRange: (state, action) => {
        state.timeRange = action.payload;
      },
      setShowPointEvents: (state, action) => {
        state.showPointEvents = action.payload;
      },
      setShowAggregatedEvents: (state, action) => {
        state.showAggregatedEvents = action.payload;
      },
      setShowSummaries: (state, action) => {
        state.showSummaries = action.payload;
      },
      setHideEventsWithoutDescription: (state, action) => {
        state.hideEventsWithoutDescription = action.payload;
      },
      setNumberOfImpacts: (state, action) => {
        state.numberOfImpacts = action.payload;
      },
      setImpactCodes: (state, action) => {
        state.impactCodes = action.payload;
      },
      setQCLevels: (state, action) => {
        state.qcLevels = action.payload;
      },
      setInfoSources: (state, action) => {
        state.infoSources = action.payload;
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