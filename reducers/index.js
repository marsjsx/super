import { combineReducers } from "redux";

const user = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "UPDATE_EMAIL":
      return { ...state, email: action.payload };
    case "UPDATE_PASSWORD":
      return { ...state, password: action.payload };
    case "UPDATE_USERNAME":
      return { ...state, username: action.payload };
    case "UPDATE_BIO":
      return { ...state, bio: action.payload };
    case "UPDATE_WEBSITE_LABEL":
      return { ...state, websiteLabel: action.payload };
    case "UPDATE_GENDER":
      return { ...state, gender: action.payload };
    case "UPDATE_ACCOUNT_TYPE":
      return { ...state, accountType: action.payload };
    case "UPDATE_PHONE":
      return { ...state, phone: action.payload };
    case "UPDATE_USER_DOB":
      return { ...state, dob: action.payload };
    case "UPDATE_USER_PHOTO":
      return { ...state, photo: action.payload };
    case "UPDATE_USER_PHOTO_PREVIEW":
      return { ...state, preview: action.payload };
    case "GET_TOKEN":
      return { ...state, token: action.payload };

    case "DELETE_POST": {
      if (!state.posts) {
        return { state };
      }
      return {
        ...state,
        posts: state.posts.filter((item) => item.id !== action.payload),
      };
    }

    default:
      return state;
  }
};

const profile = (state = {}, action) => {
  switch (action.type) {
    case "GET_PROFILE":
      return action.payload;

    case "DELETE_POST_PROFILE": {
      if (!state.posts) {
        return { state };
      }
      return {
        ...state,
        posts: state.posts.filter((item) => item.id !== action.payload),
      };
    }
    default:
      return state;
  }
};

const messages = (state = {}, action) => {
  switch (action.type) {
    case "GET_MESSAGES":
      return action.payload;
    default:
      return state;
  }
};

const post = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_POST_PHOTO":
      return { ...state, photo: action.payload };
    case "UPDATE_POST_PREVIEW":
      return { ...state, preview: action.payload };
    case "UPDATE_DESCRIPTION":
      return { ...state, description: action.payload };
    case "UPDATE_LOCATION":
      return { ...state, location: action.payload };
    case "GET_POSTS":
      return { ...state, feed: action.payload };
    case "POST_REPORTS":
      return { ...state, postReports: action.payload };
    case "GET_COMMENTS":
      return { ...state, comments: action.payload };
    case "UPDATE_PROGRESS":
      return { ...state, progress: action.payload };
    case "DELETE_POST_FROM_FEED": {
      if (!state.feed) {
        return { state };
      }
      return {
        ...state,
        feed: state.feed.filter((item) => item.id !== action.payload),
      };
    }
    default:
      return state;
  }
};

const modal = (state = null, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, modal: action.payload };
    case "CLOSE_MODAL":
      return { ...state, modal: false };
    default:
      return state;
  }
};

const appReducer = combineReducers({
  user,
  post,
  modal,
  profile,
  messages,
});

// const rootReducer = combineReducers({
//   user,
//   post,
//   modal,
//   profile,
//   messages,
// });

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
