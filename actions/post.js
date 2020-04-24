import firebase from "firebase";
import db from "../config/firebase";
import uuid from "uuid";
import cloneDeep from "lodash/cloneDeep";
import orderBy from "lodash/orderBy";
import { sendNotification } from "./";
import React from "react";

// import Toast from 'react-native-tiny-toast'
import { showMessage, hideMessage } from "react-native-flash-message";

import { buildPreview } from "../component/BuildingPreview";

import { uploadPhoto } from "../actions/index";

export const updateDescription = (input) => {
  return { type: "UPDATE_DESCRIPTION", payload: input };
};

export const updatePhoto = (input) => {
  return { type: "UPDATE_POST_PHOTO", payload: input };
};
export const deletePostLocally = (postId) => {
  return { type: "DELETE_POST", payload: postId };
};

export const deletePostFromProfile = (postId) => {
  return { type: "DELETE_POST_PROFILE", payload: postId };
};

export const deletePostFromFeed = (postId) => {
  return { type: "DELETE_POST_FROM_FEED", payload: postId };
};

export const updatePhotoPreview = (input) => {
  return { type: "UPDATE_POST_PREVIEW", payload: input };
};

export const createAndUpdatePreview = (input) => {
  return async (dispatch, getState) => {
    buildPreview(input, 50, 50).then((image) => {
      var imageData = "data:image/jpeg;base64," + image.base64;
      dispatch(updatePhotoPreview(imageData));
    });
  };
};

export const updateLocation = (input) => {
  return { type: "UPDATE_LOCATION", payload: input };
};

export const updateFileUploadProgress = (progress) => {
  return { type: "UPDATE_PROGRESS", payload: progress };
};

export const uploadPost = () => {
  return async (dispatch, getState) => {
    try {
      showMessage({
        message: "Started Post Uploading, Please wait...",
        type: "info",
        duration: 2000,
      });

      const { post, user } = getState();

      dispatch(uploadPhoto(post.photo)).then((imageurl) => {
        const id = uuid.v4();
        const type = post.photo.type;
        //  alert(imageurl);
        const upload = {
          id: id,
          postPhoto: imageurl,
          type: type,
          postDescription: post.description || " ",
          postLocation: post.location || " ",
          uid: user.uid,
          photo: user.photo || " ",
          preview: post.preview || "",
          username: user.username,
          likes: [],
          comments: [],
          reports: [],
          date: new Date().getTime(),
        };

        db.collection("posts").doc(id).set(upload);
        dispatch(updateFileUploadProgress(-1));
        dispatch(updatePhoto());
        dispatch(updateDescription());
        dispatch(updateLocation());

        dispatch(getPosts());
        showMessage({
          message: "Post Uploaded",
          description: "Post Uploaded Successfully",
          type: "success",
          duration: 4000,
        });

        //  Toast.showSuccess("Post Uploaded Successfully");
      });
    } catch (e) {
      alert("Upload Error: " + e);

      /* console.error(e) */
    }
  };
};

function getProgressBar() {
  return <Text>Testing This </Text>;
}

export const getPosts = () => {
  return async (dispatch, getState) => {
    try {
      const posts = await db.collection("posts").orderBy("date", "desc").get();

      let array = [];
      posts.forEach((post) => {
        array.push(post.data());
      });
      //  dispatch({ type: "GET_POSTS", payload: orderBy(array, "date", "desc") });
      dispatch({ type: "GET_POSTS", payload: array });
    } catch (e) {
      let array = [];
      dispatch({ type: "GET_POSTS", payload: array });
      // alert(e);
    }
  };
};

export const getFilterPosts = () => {
  return async (dispatch, getState) => {
    try {
      const posts = await db
        .collection("posts")
        .where("uid", ">=", this.state.user.following)
        .get();

      let array = [];
      posts.forEach((post) => {
        array.push(post.data());
      });
      dispatch({ type: "GET_POSTS", payload: orderBy(array, "date", "desc") });
    } catch (e) {
      //  alert(e);
    }
  };
};

export const deletePost = (item) => {
  return async (dispatch, getState) => {
    const post = item.id;
    try {
      db.collection("posts").doc(post).delete();
      dispatch(deletePostLocally(post));
      dispatch(deletePostFromProfile(post));
      dispatch(deletePostFromFeed(post));
      showMessage({
        message: "Post Delete Successfully",
        type: "success",
        duration: 2000,
      });
    } catch (e) {
      alert(e);
    }
  };
};

export const likePost = (post) => {
  return (dispatch, getState) => {
    const { uid, username, photo } = getState().user;
    try {
      const home = cloneDeep(getState().post.feed);
      let newFeed = home.map((item) => {
        if (item.id === post.id) {
          item.likes.push(uid);
        }
        return item;
      });
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("activity").doc().set({
        postId: post.id,
        postPhoto: post.postPhoto,
        likerId: uid,
        likerPhoto: photo,
        likerName: username,
        uid: post.uid,
        date: new Date().getTime(),
        type: "LIKE",
      });
      dispatch(sendNotification(post.uid, "Liked Your Photo"));
      dispatch({ type: "GET_POSTS", payload: newFeed });
      dispatch(getPosts());
      dispatch(getUser(response.user.uid));
    } catch (e) {
      /* alert(e) */
    }
  };
};

export const unlikePost = (post) => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    try {
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(uid),
        });
      const query = await db
        .collection("activity")
        .where("postId", "==", post.id)
        .where("likerId", "==", uid)
        .get();
      query.forEach((response) => {
        response.ref.delete();
      });
      dispatch(getPosts());
    } catch (e) {
      /* console.error(e) */
    }
  };
};

export const getComments = (post) => {
  return (dispatch) => {
    dispatch({
      type: "GET_COMMENTS",
      payload: orderBy(post.comments, "date", "desc"),
    });
  };
};

export const addComment = (text, post) => {
  return (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    let comments = cloneDeep(getState().post.comments.reverse());
    try {
      const comment = {
        comment: text,
        commenterId: uid,
        commenterPhoto: photo || "",
        commenterName: username,
        date: new Date().getTime(),
      };
      db.collection("posts")
        .doc(post.id)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion(comment),
        });
      comment.postId = post.id;
      comment.postPhoto = post.postPhoto;
      comment.uid = post.uid;
      comment.type = "COMMENT";
      comments.push(comment);
      dispatch({ type: "GET_COMMENTS", payload: comments.reverse() });

      dispatch(sendNotification(post.uid, text));
      db.collection("activity").doc().set(comment);
    } catch (e) {
      /* console.error(e) */
    }
  };
};

export const reportPost = (post) => {
  return (dispatch, getState) => {
    const { uid, username, photo } = getState().user;
    try {
      const home = cloneDeep(getState().post.feed);
      let newFeed = home.map((item) => {
        if (item.id === post.id) {
          item.reports.push(uid);
        }
        return item;
      });
      db.collection("posts")
        .doc(post.id)
        .update({
          reports: firebase.firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("users")
        .doc(post.uid)
        .update({
          reports: firebase.firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("reports").doc().set({
        postId: post.id,
        postPhoto: post.postPhoto,
        reporterId: uid,
        reporterPhoto: photo,
        reporterName: username,
        uid: post.uid,
        date: new Date().getTime(),
        type: "REPORT",
      });
      dispatch({ type: "GET_POSTS", payload: newFeed });
      dispatch(getPosts());
      dispatch(getUser(response.user.uid));
    } catch (e) {
      /* alert(e) */
    }
  };
};
