import { combineReducers } from "redux";
import _ from "lodash";
import orderBy from "lodash/orderBy";

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
    case "UPDATE_USER_BIO":
      return { ...state, userbio: action.payload };
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
    case "UPDATE_COMPRESSED_USER_PHOTO":
      return { ...state, compressedPhoto: action.payload };
    case "UPDATE_USER_PHOTO_PREVIEW":
      return { ...state, preview: action.payload };
    case "GET_TOKEN":
      return { ...state, token: action.payload };
    case "UPDATE_FOLLOWING":
      return { ...state, following: action.payload };
    case "UPDATE_BLOCKED_USERS":
      return { ...state, blockedUsers: action.payload };

    case "UPDATE_BLOCKED_USERS_IDS":
      return { ...state, blocked: action.payload };

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

    case "FOLLOW_USER": {
      var profile = state;
      var following = [...profile.following];
      following.push(action.payload);
      // alert(JSON.stringify(profile));
      // return {
      //   profile,
      // };
      // return {
      //   ...state,
      //   myFollowings: following,
      // };
    }

    case "UNFOLLOW_USER": {
      return action.payload;
    }

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

const post = (state = { newPosts: [], followingfeed: [] }, action) => {
  switch (action.type) {
    case "UPDATE_POST_PHOTO":
      return { ...state, photo: action.payload };
    case "SHOW_LOADING":
      return { ...state, loading: true };
    case "UPDATE_POST_PREVIEW":
      return { ...state, preview: action.payload };
    case "UPDATE_VIDEO_COVER":
      return { ...state, videocover: action.payload };
    case "NEW_POST_ADDED":
      return {
        ...state,
        feed: orderBy([...state.feed, action.payload], "date", "desc"),
      };
    // case "NEW_POST_ADDED":
    //   return { ...state, feed: action.payload };
    case "FOLLOWING_POSTS":
      return { ...state, followingfeed: action.payload };
    case "UPDATE_DESCRIPTION":
      return { ...state, description: action.payload };
    case "UPDATE_LOCATION":
      return { ...state, location: action.payload };
    case "GET_POSTS":
      return { ...state, feed: action.payload, loading: false };
    case "NEW_POSTS":
      return { ...state, newPosts: action.payload };
    case "MERGE_NEW_POSTS":
      return {
        ...state,
        feed: [...action.payload],
        newPosts: [],
      };
    case "LAST_VISIBLE":
      return { ...state, lastVisible: action.payload };
    case "POST_REPORTS":
      return { ...state, postReports: action.payload };
    case "UPDATE_POST": {
      let post = action.payload;
      return {
        ...state,
        feed: state.feed.map((content, i) =>
          content.id === post.id
            ? { ...content, comments: post.comments }
            : content
        ),
      };
    }
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
    state.user = undefined;
    state.messages = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
