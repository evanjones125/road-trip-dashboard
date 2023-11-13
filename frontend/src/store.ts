import { configureStore } from '@reduxjs/toolkit';
import { tripsReducer } from './features/tripsSlice';
import { authReducer } from './features/authSlice';

export const store = configureStore({
  reducer: { trips: tripsReducer, auth: authReducer },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
