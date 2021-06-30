import { combineReducers } from "redux";
import _ from "lodash";
import orderBy from "lodash/orderBy";
import { INTERNET_CONNECTED, INTERNET_DISCONNECTED } from "../actions/types";
import {
  CHANNELS_REQUEST,
  CHANNELS_SUCCESS,
  CHANNELS_FAIL,
  CHANNELPOSTS_REQUEST,
  CHANNELPOSTS_SUCCESS,
  CHANNELPOSTS_FAIL,
  MULTISELECT_CHANNEL_LIST,
  USERCONTACTS_SUCCESS,
  USER_DEVICECONTACTS,
  USERCONTACTS_FAIL,
  USERCONTACTS_REQUEST,
} from "../actions/actiontype";
const user = (
  state = {
    posts: [],
    brandRequests: [],
    accountType: "Personal",
    userContacts: [],
  },
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload };
    case USERCONTACTS_REQUEST:
      return { ...state, loadingContacts: true };

    case USERCONTACTS_SUCCESS:
      return { ...state, userContacts: action.payload, loadingContacts: false };
    case USERCONTACTS_FAIL:
      return { ...state, loading: false };

    case "UPDATE_EMAIL":
      return { ...state, email: action.payload };
    case "UPDATE_PASSWORD":
      return { ...state, password: action.payload };
    case "UPDATE_USERNAME":
      return { ...state, username: action.payload };
    case "UPDATE_REPRESENTATIVE_NAME":
      return { ...state, representativeName: action.payload };
    case "GET_BRANDS_APPROVAL_REQUESTS":
      return { ...state, brandRequestsLoading: true };

    case "GET_BRANDS_APPROVAL_REQUESTS_SUCCESS":
      return {
        ...state,
        brandRequests: action.payload,
        brandRequestsLoading: false,
      };
    case "GET_BRANDS_APPROVAL_REQUESTS_FAIL":
      return { ...state, brandRequestsLoading: false };
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
    case "UPDATE_BG_PHOTO":
      return { ...state, bgImage: action.payload };
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
    case "LAST_VISIBLE_MESSAGE":
      return { ...state, lastVisible: action.payload };
    case "UPDATE_BLOCKED_USERS_IDS":
      return { ...state, blocked: action.payload };
    case "NEW_POST_ADDED":
      return {
        ...state,
        posts: orderBy(
          _.uniqBy([...state.posts, action.payload], "id"),
          "date",
          "desc"
        ),
      };

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

const contacts = (
  state = {
    userDeviceContacts: [],
    refreshingContacts: false,
  },
  action
) => {
  switch (action.type) {
    case USER_DEVICECONTACTS:
      return { ...state, userDeviceContacts: action.payload };
    case "REFRESHING_CONTACTS":
      return { ...state, refreshingContacts: action.payload };
    // case "REFRESHING_CONTACTS":
    //   return { ...state, refreshingContacts: action.payload };

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
    // case "LAST_VISIBLE_MESSAGE":
    //   return { ...state, lastVisible: action.payload };
    default:
      return state;
  }
};

const checkconnection = (
  state = {
    isConnected: true,
  },
  action
) => {
  switch (action.type) {
    case INTERNET_CONNECTED:
      return { isConnected: true };
    case INTERNET_DISCONNECTED:
      return { isConnected: false };
    default:
      return state;
  }
};

const post = (
  state = { newPosts: [], followingfeed: [], feed: [] },
  action
) => {
  switch (action.type) {
    case "UPDATE_POST_PHOTO":
      return { ...state, photo: action.payload };
    case "SHOW_LOADING":
      return { ...state, loading: true };
    case "UPDATE_POST_PREVIEW":
      return { ...state, preview: action.payload };
    case "UPDATE_THUMBNAIL_PREVIEW":
      return { ...state, thumbnailPreview: action.payload };
    case "UPDATE_VIDEO_COVER":
      return { ...state, videocover: action.payload };
    // case "NEW_POST_ADDED":
    //   return { ...state, feed: action.payload };

    case "NEW_POST_ADDED":
      return {
        ...state,
        feed: orderBy(
          _.uniqBy([...state.feed, action.payload], "id"),
          "date",
          "desc"
        ),
      };
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

const channels = (state = { channelsList: [], feed: [] }, action) => {
  switch (action.type) {
    case CHANNELS_REQUEST:
      return { ...state, loading: true };

    case CHANNELS_SUCCESS:
      return { ...state, channelsList: action.payload, loading: false };
    case CHANNELS_FAIL:
      return { ...state, loading: false };
    case CHANNELPOSTS_REQUEST:
      return { ...state, feedLoading: true };
    case CHANNELPOSTS_SUCCESS:
      return { ...state, feed: action.payload, feedLoading: false };
    case MULTISELECT_CHANNEL_LIST:
      return {
        ...state,
        multiSelectChannelsList: action.payload,
        feedLoading: false,
      };

    case CHANNELPOSTS_FAIL:
      return { ...state, feedLoading: false };
    default:
      return state;
  }
};

const activity = (state = { activities: [] }, action) => {
  switch (action.type) {
    case "SHOW_ACTIVITIES_LOADING":
      return { ...state, loading: true };

    case "GET_ACTIVITIES":
      return { ...state, activities: action.payload, loading: false };

    case "LAST_VISIBLE":
      return { ...state, lastVisible: action.payload };

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
  channels,
  activity,
  modal,
  profile,
  messages,
  contacts,
  checkconnection,
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
