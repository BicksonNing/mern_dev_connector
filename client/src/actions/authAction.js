import axios from 'axios';
import { setAlert } from './alertAction';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PROFILE_CLEAR,
} from './types';

// Register User

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('/api/user', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      console.log(errors);

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert(error.msg, 'danger', 5000))
        );
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    console.log(errors);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger', 5000)));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Load User

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// logout / Clear Prfile

export const logout = () => (dispatch) => {
  dispatch({
    type: PROFILE_CLEAR,
  });
  dispatch({
    type: LOGOUT,
  });
};
