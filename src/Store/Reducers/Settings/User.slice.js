import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  usersLoading: false,
  usersCRUDLoading: false,
  usersDownloadLoading: false,
  userList: [],
  userCount: 0,
  selectedUser: {
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    dob: new Date().toISOString(), // old value of DOB = ""
    gender: 1, //1= Male 2= Female 3=Other
    blood_group: '', //+ve',
    marital_status: 'Single',
    current_address: '',
    permanent_address: '',
    adhar_card_link: '',
    pan_card_link: '',
    profile_logo: '',
    user_name: '',
    user_email_id: '',
    password: '',
    emp_no: '',
    joining_date: new Date().toISOString(), // old value joining_date: ''
    factory_location: '',
    is_active: 1, //1- active. 0- deactive
    operator: 1, //1- yes. 0- no
    // operator_role: '',
    office_staff: 0,
    role: '',
    // print_technology: [],
    bag_machine: '',
    timing_based_login: 1,
    login_allowed: false, //true- allow. false- not-allow
    calculate_brokerage: false,
    login_time: '',
    machineType_printTechnology: [],
  },
  listFilter: [],

  isGetInitialValuesUser: {
    add: false,
    update: false,
    view: false,
  },
  userInitialValues: {
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    dob: '', // old value of DOB = ""
    gender: 1, //1= Male 2= Female 3=Other
    blood_group: '', //+ve',
    marital_status: 'Single',
    current_address: '',
    permanent_address: '',
    adhar_card_link: '',
    pan_card_link: '',
    profile_logo: '',
    user_name: '',
    user_email_id: '',
    password: '',
    emp_no: '',
    joining_date: '', // old value joining_date: ''
    factory_location: '',
    is_active: 1, //1- active. 0- deactive
    operator: 1, //1- yes. 0- no
    // operator_role: '',
    office_staff: 0,
    role: '',
    // print_technology: [],
    bag_machine: '',
    timing_based_login: 1,
    login_allowed: false, //true- allow. false- not-allow
    calculate_brokerage: false,
    login_time: '',
    machineType_printTechnology: [],
    active_adhaar_link: true,
    profile_toggle: false,
    selected_roll: {},
  },
  addSelectedUserData: {
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    dob: new Date().toISOString(),
    gender: 1,
    marital_status: 'Single',
    active_adhaar_link: true,
    user_name: '',
    user_email_id: '',
    password: '',
    emp_no: '',
    joining_date: new Date().toISOString(),
    factory_location: '',
    machineType_printTechnology: [],
    timing_based_login: 1,
    login_time: '',

    is_active: 1,
    operator: 1,
    office_staff: 0,
    login_allowed: false,
    calculate_brokerage: false,
    profile_toggle: false,
    selected_roll: {},
  },
  updateSelectedUserData: {
    active_adhaar_link: true,
    profile_toggle: false,
    selected_roll: {},
  },
  // viewSelectedUserData: {},
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.usersLoading = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setUsersCRUDLoading: (state, action) => {
      state.usersCRUDLoading = action.payload;
    },
    setUsersDownloadLoading: (state, action) => {
      state.usersDownloadLoading = action.payload;
    },
    setUserCount: (state, action) => {
      state.userCount = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: state => {
      state.selectedUser = initialState.selectedUser;
    },
    setUserListFilter: (state, action) => {
      state.listFilter = action.payload;
    },

    setIsGetInitialValuesUser: (state, action) => {
      state.isGetInitialValuesUser = action.payload;
    },
    setAddSelectedUserData: (state, action) => {
      state.addSelectedUserData = action.payload;
    },
    clearAddSelectedUserData: state => {
      state.addSelectedUserData = initialState.userInitialValues;
    },
    setUpdateSelectedUserData: (state, action) => {
      state.updateSelectedUserData = action.payload;
    },
    clearUpdateSelectedUserData: state => {
      state.updateSelectedUserData = initialState.userInitialValues;
    },
    // setViewSelectedUsertData: (state, action) => {
    //   state.viewSelectedUserData = action.payload;
    // },
    // clearViewSelectedUserData: state => {
    //   state.viewSelectedUserData = initialState.userInitialValues;
    // },
  },
});

export const {
  setSelectedUser,
  setUserLoading,
  setUserList,
  setUserCount,
  clearSelectedUser,
  setUserListFilter,
  setUsersCRUDLoading,
  setUsersDownloadLoading,
  setIsGetInitialValuesUser,
  setAddSelectedUserData,
  clearAddSelectedUserData,
  setUpdateSelectedUserData,
  clearUpdateSelectedUserData,
  // setViewSelectedUsertData,
  // clearViewSelectedUserData,
} = userSlice.actions;

export default userSlice.reducer;
