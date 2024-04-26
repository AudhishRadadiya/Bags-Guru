import axios from 'axios';

export const saveToken = user_data => {
  const settings = {
    ...user_data,
  };
  setAuthToken(user_data?.token);
  localStorage.setItem('UserPreferences', JSON.stringify(settings));
};

// Header Methods
export const setAuthToken = access_Token => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ` + access_Token;
  } catch (e) {
    console.log('Error while setup token', e);
  }
};

export const clearToken = () => {
  localStorage.clear();
  clearAuthToken();
};

const clearAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};
