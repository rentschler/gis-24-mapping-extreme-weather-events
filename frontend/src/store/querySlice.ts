// store/querySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type QueryState = {
  filters: {
    startDate: string;
    endDate: string;
  };
  sort: 'asc' | 'desc';
  year: number;
};

const initialState: QueryState = {
  filters: {
    startDate: '2023-01-01',
    endDate: '2023-12-31',
  },
  sort: 'asc',
  year: 2024,
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setStartDate(state, action: PayloadAction<string>) {
      state.filters.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<string>) {
      state.filters.endDate = action.payload;
    },
    setFilters(state, action: PayloadAction<QueryState['filters']>) {
        state.filters = action.payload;
        },
  },
});

export const { setStartDate, setEndDate, setFilters } = querySlice.actions;

export default querySlice.reducer;
