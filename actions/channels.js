import firestore from "@react-native-firebase/firestore";
import db from "../config/firebase";
import uuid from "uuid";
import cloneDeep from "lodash/cloneDeep";
import orderBy from "lodash/orderBy";
import { sendNotification } from "./";
import React from "react";
import { getUser } from "./user";
import FastImage from "react-native-fast-image";
import { cleanExtractedImagesCache } from "react-native-image-filter-kit";
import _ from "lodash";
import {
  CHANNELS_REQUEST,
  CHANNELS_SUCCESS,
  CHANNELS_FAIL,
  CHANNELPOSTS_REQUEST,
  CHANNELPOSTS_SUCCESS,
  CHANNELPOSTS_FAIL,
  MULTISELECT_CHANNEL_LIST,
} from "./actiontype";
// import Toast from 'react-native-tiny-toast'
import { showMessage, hideMessage } from "react-native-flash-message";

export const getChannels = () => {
  return async (dispatch, getState) => {
    // alert(limit);
    try {
      dispatch({ type: CHANNELS_REQUEST });

      db.collection("channels")
        .orderBy("showingOrder", "asc")
        .get()
        .then((querySnapshot) => {
          var images = [];

          let array = [];

          querySnapshot.forEach((channel) => {
            var item = channel.data();
            array.push(channel.data());
            if (item.background && item.background.length > 15) {
              const normalisedSource =
                item.background &&
                typeof item.background === "string" &&
                !item.background.split("https://")[1]
                  ? null
                  : item.background;
              if (normalisedSource) {
                images.push({
                  uri: item.background,
                });
              }
            }
          });

          if (images.length > 0) {
            preloadImages(images);
          }
          dispatch({ type: CHANNELS_SUCCESS, payload: array });

          if (array.length > 0) {
            var multiSelectChannelList = array.reduce((i, j) => {
              i.push({ ...j, value: j.name, label: j.name });
              return i;
            }, []);
            dispatch({
              type: MULTISELECT_CHANNEL_LIST,
              payload: multiSelectChannelList,
            });
          }
        })
        .catch((error) => {
          let array = [];
          dispatch({ type: CHANNELS_FAIL, payload: array });
        });
    } catch (e) {
      let array = [];
      dispatch({ type: CHANNELS_FAIL, payload: array });
    }
  };
};

export const getChannelsPosts = (channelId, initialRequest = false) => {
  return async (dispatch, getState) => {
    let { feed } = getState().channels;
    var lastFetchedPostDate;

    if (!initialRequest && feed && feed.length > 0) {
      lastFetchedPostDate = feed[feed.length - 1].createdAt;

      if (channelId !== feed[feed.length - 1].channelId) {
        lastFetchedPostDate = null;
        feed = [];
      }
    }
    if (initialRequest) {
      feed = [];
    }
    dispatch({ type: CHANNELPOSTS_REQUEST });
    try {
      var posts;
      if (lastFetchedPostDate) {
        posts = await db
          .collection("channelposts")
          .where("channelIds", "array-contains", channelId)
          .orderBy("createdAt", "desc")
          .startAfter(lastFetchedPostDate)
          .limit(12)
          .get();
      } else {
        posts = await db
          .collection("channelposts")
          .where("channelIds", "array-contains", channelId)
          .orderBy("createdAt", "desc")
          .limit(12)
          .get();
      }
      var images = [];
      let array = [];

      posts.forEach((post) => {
        var item = post.data();
        array.push(post.data());
        if (item.photo && item.photo.length > 15) {
          const normalisedSource =
            item.photo &&
            typeof item.photo === "string" &&
            !item.photo.split("https://")[1]
              ? null
              : item.photo;
          if (normalisedSource) {
            images.push({
              uri: item.photo,
            });
          }
        }
        if (item.type == "image") {
          if (item.postPhoto && item.postPhoto.length > 15) {
            images.push({
              uri: item.postPhoto,
            });
          }
        }
      });
      if (images.length > 0) {
        preloadImages(images);
      }
      // if (array.length > 0) {
      var mergedArray = feed.concat(array);
      var uniquePosts = _.uniqBy(mergedArray, "id");

      // const shuffled = uniquePosts.sort(() => Math.random() - 0.5);
      dispatch({ type: CHANNELPOSTS_SUCCESS, payload: uniquePosts });
      // }
    } catch (e) {
      console.log(e.message, e);
      let array = [];
      dispatch({ type: CHANNELPOSTS_FAIL });
      //  dispatch({ type: "GET_POSTS", payload: array });
      // alert(e);
    }
  };
};

export const preloadImages = async (images) => {
  try {
    FastImage.preload(images);
  } catch (e) {
    // alert(e);
  }
};
export const getUriImage = (uri) => {
  return uri !== null &&
    uri !== undefined &&
    uri.includes("/") &&
    uri.includes(".")
    ? uri
    : "";
};
