// store.js or store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import verifyOtpReducer from './verifyOtpSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    verifyOtp: verifyOtpReducer,  
  },
});
