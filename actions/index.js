import uuid from "uuid";
import firebase from "firebase";
import db from "../config/firebase";
import { Notifications } from "expo";
import * as ImageManipulator from "expo-image-manipulator";
const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
import * as Permissions from "expo-permissions";
import { updateFileUploadProgress } from "../actions/post";
import { validURL } from "../util/Helper";
import RNFetchBlob from "rn-fetch-blob";
var base64 = require("base-64");
import storage from "@react-native-firebase/storage";

import * as FileSystem from "expo-file-system";

async function isDataURL(s) {
  return !!s.match(isDataURL.regex);
}

isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

export const uploadPhoto = (selectedFile) => {
  return async (dispatch) => {
    try {
      var fileUri;
      if (selectedFile.uri) {
        fileUri = selectedFile.uri;
      } else {
        fileUri = selectedFile;

        if (validURL(fileUri)) {
          return fileUri;
        }
      }

      // if (selectedFile.type === "image") {
      //   var compressRatio = 0.4;
      //   var maxallowedFileSize = 3000 * 1024; // 2MB

      //   if (selectedFile.size) {
      //     if (selectedFile.size > maxallowedFileSize) {
      //       compressRatio = 1;

      //       const resize = await ImageManipulator.manipulateAsync(fileUri, [], {
      //         // format: "jpeg",
      //         compress: 0,
      //         // base64: true,
      //       });

      //       // var decodedData = base64.decode(resize.base64);
      //       // var bytes = decodedData.length;
      //       // alert(bytes);

      //       let fileInfo = await FileSystem.getInfoAsync(resize.uri);

      //       // alert(JSON.stringify(fileInfo));
      //       fileUri = resize.uri;
      //     }

      //     // else {
      //     //   compressRatio = maxallowedFileSize / selectedFile.size;
      //     // }
      //   }

      //   // alert(JSON.stringify(selectedFile));
      // }
      let uploadTask = null;
      // alert(fileUri);

      var isBase64DataURL = await isDataURL(fileUri);
      if (isBase64DataURL) {
        // alert("Base64");
        uploadTask = storage()
          .ref()
          .child(uuid.v4())
          .putString(fileUri, "data_url");
        // var blob = null;
        // blob = await new Promise((resolve, reject) => {
        //   const xhr = new XMLHttpRequest();
        //   xhr.onload = () => resolve(xhr.response);
        //   xhr.responseType = "blob";
        //   xhr.open("GET", fileUri, true);
        //   xhr.send(null);
        // });
        // uploadTask = firebase.storage().ref().child(uuid.v4()).put(blob);
      } else {
        uploadTask = storage().ref().child(uuid.v4()).putFile(fileUri);
      }

      // var blob = null;
      // blob = await new Promise((resolve, reject) => {
      //   const xhr = new XMLHttpRequest();
      //   xhr.onload = () => resolve(xhr.response);
      //   xhr.responseType = "blob";
      //   xhr.open("GET", fileUri, true);
      //   xhr.send(null);
      // });

      // const uploadTask = firebase.storage().ref().child(uuid.v4()).put(blob);
      const uploadingFile = () =>
        new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            function (snapshot) {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

              if (selectedFile.uri) {
                // if (!videoCover) {
                dispatch(updateFileUploadProgress(Math.round(progress)));
                // }
              }

              // alert(progress + "");s
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log("Upload is paused");
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log("Upload is running");
                  break;
              }
            },
            function (error) {
              // Handle unsuccessful uploads
              reject(error);
            },
            function () {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...

              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  console.log("File available at", downloadURL);
                  resolve(downloadURL);
                });
            }
          );
        });
      let downloadURL = await uploadingFile();
      return downloadURL;
    } catch (e) {
      alert(e);
    }
  };
};

function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = "blob"; // convert type
    xhr.send();
  });
}

function isBase64(str) {
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    alert(err);
    return false;
  }
}

export function functionUploadPhoto(image) {
  return async (dispatch) => {
    try {
      const resize = await ImageManipulator.manipulateAsync(image, [], {
        format: "jpeg",
        compress: 0.3,
      });
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.responseType = "blob";
        xhr.open("GET", resize.uri, true);
        xhr.send(null);
      });
      const uploadTask = await firebase
        .storage()
        .ref()
        .child(uuid.v4())
        .put(blob);
      const downloadURL = await uploadTask.ref.getDownloadURL();
      return downloadURL;
    } catch (e) {
      alert(e);
    }
  };
}

export const allowNotifications = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (permission.status === "granted") {
        const token = await Notifications.getExpoPushTokenAsync();
        dispatch({ type: "GET_TOKEN", payload: token });
        db.collection("users").doc(uid).update({ token: token });
      }
    } catch (e) {
      /* console.error(e) */
    }
  };
};

export const sendNotification = (uid, text) => {
  return async (dispatch, getState) => {
    const { username } = getState().user;
    try {
      const user = await db.collection("users").doc(uid).get();
      if (user.data().token) {
        fetch(PUSH_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.data().token,
            title: username,
            body: text,
          }),
        });
      }
    } catch (e) {
      /* console.error(e) */
    }
  };
};
