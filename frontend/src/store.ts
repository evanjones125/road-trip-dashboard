import { configureStore } from '@reduxjs/toolkit';
import { tripsReducer } from './features/tripsSlice';

export const store = configureStore({
  reducer: { trips: tripsReducer },
});

export default store;

// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
