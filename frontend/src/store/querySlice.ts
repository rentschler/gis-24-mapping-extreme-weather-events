// store/querySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialQueryState, QueryState } from './settingsSlice';


type State = {
    filters: QueryState;
  };

const initialState: State = {
    filters: initialQueryState,
  }

const querySlice = createSlice({
  name: 'query',
  initialState: initialState,
  reducers: {

    setFilters(state, action: PayloadAction<State['filters']>) {
        state.filters = action.payload;
        },
  },
});

export const { setFilters } = querySlice.actions;

export default querySlice.reducer;
