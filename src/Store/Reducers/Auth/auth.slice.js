import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  list: [],
  loading: false,
  currentUser: {
    last_name: '',
    user_name: '',
    first_name: '',
    user_email_id: '',
    email: '',
    mobile_no: '',
    gender: 1,
    dob: '',
    blood_group: '',
    marital_status: '',
    current_address: '',
    permanent_address: '',
    adhar_card_link: '',
    pan_card_link: '',
  },
  changePasswordValues: { new_password: '', password: '', old_password: '' },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setChangePassword: (state, action) => {
      state.changePasswordValues = action.payload;
    },
  },
});

export const { setAuthLoading, setCurrentUser, setChangePassword } =
  authSlice.actions;

export default authSlice.reducer;
