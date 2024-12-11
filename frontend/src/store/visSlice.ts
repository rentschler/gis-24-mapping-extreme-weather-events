// store/querySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialVisualState, VisualState } from './settingsSlice';


type State = {
    options: VisualState;
  };

const initialState: State = {
    options: initialVisualState,
  }

const querySlice = createSlice({
  name: 'vis',
  initialState: initialState,
  reducers: {
    setVisoptions(state, action: PayloadAction<State['options']>) {
        state.options = action.payload;
        },
  },
});

export const { setVisoptions } = querySlice.actions;

export default querySlice.reducer;
