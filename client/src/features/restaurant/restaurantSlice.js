import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  restaurants: [],
  restaurant: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new restaurant
export const createRestaurant = createAsyncThunk(
  'restaurant/create',
  async (restaurantData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('/api/restaurants', restaurantData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all restaurants
export const getRestaurants = createAsyncThunk(
  'restaurant/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/restaurants');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single restaurant
export const getRestaurant = createAsyncThunk(
  'restaurant/getOne',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRestaurant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.restaurants.push(action.payload.data);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRestaurants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.restaurants = action.payload.data;
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRestaurant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.restaurant = action.payload.data;
      })
      .addCase(getRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = restaurantSlice.actions;
export default restaurantSlice.reducer;
