import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import restaurantReducer from '../features/restaurant/restaurantSlice';
import menuReducer from '../features/menu/menuSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    menu: menuReducer,
  },
});
