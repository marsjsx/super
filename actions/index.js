import uuid from "uuid";
import firebase from "firebase";
import db from "../config/firebase";
import { Notifications } from "expo";
import * as ImageManipulator from "expo-image-manipulator";
const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
import * as Permissions from "expo-permissions";
import { updateFileUploadProgress } from "../actions/post";
import { validURL } from "../util/Helper"

export const uploadPhoto = (selectedFile) => {
  
  return async (dispatch) => {
    try {
      var fileUri;

      if (selectedFile.uri) {

        fileUri= selectedFile.uri;
      } else {
        fileUri = selectedFile;

        if (validURL(fileUri)) {
          return fileUri
        }
      }

      if (selectedFile.type === "image") {
        const resize = await ImageManipulator.manipulateAsync(
          fileUri,
          [],
          {
            format: "jpeg",
            compress: 0.6,
          }
        );

        fileUri = resize.uri;

      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.responseType = "blob";
        xhr.open("GET", fileUri, true);
        xhr.send(null);
      });
      const uploadTask = firebase.storage().ref().child(uuid.v4()).put(blob);

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
                  dispatch(updateFileUploadProgress(Math.round(progress)));
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
