import { createSlice } from '@reduxjs/toolkit';

const verifyOtpSlice = createSlice({
  name: 'verifyOtp',
  initialState: {
    isVerifyOtpPage: false,
  },
  reducers: {
    setVerifyOtpPage: (state) => {
      state.isVerifyOtpPage = true;
    },
    resetVerifyOtpPage: (state) => {
      state.isVerifyOtpPage = false;
    },
  },
});

export const { setVerifyOtpPage, resetVerifyOtpPage } = verifyOtpSlice.actions;
export const selectVerifyOtpPage = (state) => state.verifyOtp.isVerifyOtpPage;

export default verifyOtpSlice.reducer;
