import {
  PROFILE_GET,
  PROFILE_ERROR,
  PROFILE_CLEAR,
  PROFILE_UPDATE,
  PROFILES_GET,
  GET_REPOS,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  isLoading: true,
  error: {},
};

export default function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PROFILE_GET:
    case PROFILE_UPDATE:
      return {
        ...state,
        profile: payload,
        isLoading: false,
      };

    case PROFILES_GET:
      return {
        ...state,
        profiles: payload,
        isLoading: false,
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        isLoading: false,
        profile: null,
      };

    case PROFILE_CLEAR:
      return {
        ...state,
        profile: null,
        repos: [],
        isLoading: false,
      };

    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        isLoading: false,
      };

    default:
      return state;
  }
}
