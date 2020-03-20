import firebase from "firebase";
import db from "../config/firebase";
import { orderBy, groupBy, values } from "lodash";
import { allowNotifications, sendNotification } from "./";
import * as Facebook from "expo-facebook";
import { uploadPhoto } from "../actions/index";

import { showMessage, hideMessage } from "react-native-flash-message";
import { buildPreview } from "../component/BuildingPreview";

export const updateEmail = email => {
  return { type: "UPDATE_EMAIL", payload: email };
};

export const updatePhone = phone => {
  return { type: "UPDATE_PHONE", payload: phone };
};
export const updateGender = gender => {
  return { type: "UPDATE_GENDER", payload: gender };
};

export const updateDOB = dob => {
  return { type: "UPDATE_USER_DOB", payload: dob };
};

export const updatePassword = password => {
  return { type: "UPDATE_PASSWORD", payload: password };
};

export const updateUsername = username => {
  return { type: "UPDATE_USERNAME", payload: username };
};

export const updateBio = bio => {
  return { type: "UPDATE_BIO", payload: bio };
};

export const updatePhoto = photo => {
  return { type: "UPDATE_USER_PHOTO", payload: photo };
};

export const updatePhotoPreview = input => {
  return { type: "UPDATE_USER_PHOTO_PREVIEW", payload: input };
};

export const createAndUpdatePreview = input => {
  return async (dispatch, getState) => {
    buildPreview(input, 50, 50).then(image => {
      var imageData = "data:image/jpeg;base64," + image.base64;
      dispatch(updatePhotoPreview(imageData));
    });
  };
};

export const login = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password } = getState().user;
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      dispatch(getUser(response.user.uid));
      dispatch(allowNotifications());
    } catch (e) {
      alert(e);
    }
  };
};

export const facebookLogin = () => {
  return async dispatch => {
    try {
      await Facebook.initializeAsync("239016010571551");
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"]
      });
      if (type === "success") {
        // Build Firebase credential with the Facebook access token.
        const credential = await firebase.auth.FacebookAuthProvider.credential(
          token
        );
        // Sign in with credential from the Facebook user.
        const firebaseResponse = await firebase
          .auth()
          .signInWithCredential(credential);

        var response = firebaseResponse.user;
        const user = await db
          .collection("users")
          .doc(response.uid)
          .get();
        if (!user.exists) {
          var email =
            response.email == null || response.email == undefined
              ? response.providerData[0].email
              : response.email;

          if (email == null || email == undefined) {
            email = response.providerData[0].uid + "@facebook.com";
          }

          const user = {
            uid: response.uid,
            email: email,
            username: response.displayName,
            bio: "",
            photo: response.photoURL,
            token: null,
            followers: [],
            following: []
          };
          db.collection("users")
            .doc(response.uid)
            .set(user);
          dispatch({ type: "LOGIN", payload: user });
        } else {
          dispatch(getUser(response.uid));
        }
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
};

export const getUser = (uid, type) => {
  return async (dispatch, getState) => {
    try {
      const userQuery = await db
        .collection("users")
        .doc(uid)
        .get();
      let user = userQuery.data();

      let posts = [];
      const postsQuery = await db
        .collection("posts")
        .where("uid", "==", uid)
        .get();
      postsQuery.forEach(function(response) {
        posts.push(response.data());
      });

      user.posts = posts;

      if (posts != null && posts.length > 0) {
        user.posts = orderBy(posts, "date", "desc");
      }

      if (type === "LOGIN") {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "GET_PROFILE", payload: user });
      }
    } catch (e) {
      // alert("Error 5"+e);
    }
  };
};

export const updateUser = () => {
  return async (dispatch, getState) => {
    const {
      uid,
      username,
      bio,
      photo,
      phone,
      gender,
      dob,
      preview
    } = getState().user;

    try {
      dispatch(uploadPhoto(photo)).then(imageurl => {
        db.collection("users")
          .doc(uid)
          .update({
            username: username,
            bio: bio,
            photo: imageurl,
            preview: preview || "",
            phone: phone,
            gender: gender,
            dob: dob
          });

        showMessage({
          message: "",
          description: "Profile Updated Successfully",
          type: "success",
          duration: 4000
        });
      });
    } catch (e) {
      alert(e);
    }
  };
};

export const deleteAuth = () => {
  return async (dispatch, getState) => {
    var user = firebase.auth().currentUser;
    try {
      user.delete();
    } catch (e) {
      alert(e);
    }
  };
};

export const deleteUser = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    try {
      db.collection("users")
        .doc(uid)
        .delete();
    } catch (e) {
      alert(e);
    }
  };
};

export const deleteAllPosts = () => {
  // First perform the query
  db.collection("posts")
    .where("uid", "==", user.uid)
    .get()
    .then(function(querySnapshot) {
      // Once we get the results, begin a batch
      var batch = db.batch();

      querySnapshot.forEach(function(doc) {
        // For each doc, add a delete operation to the batch
        batch.delete(doc.ref);
      });

      // Commit the batch
      return batch.commit();
    })
    .then(function() {
      alert("deleting posts...");
    });
};

export const signup = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password, username, bio } = getState().user;
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          email: email,
          username: username,
          bio: bio,
          photo: "",
          token: null,
          followers: [],
          following: [],
          reports: []
        };
        db.collection("users")
          .doc(response.user.uid)
          .set(user);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (e) {
      alert(e);
    }
  };
};

export const followUser = user => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    try {
      db.collection("users")
        .doc(user.uid)
        .update({
          followers: firebase.firestore.FieldValue.arrayUnion(uid)
        });
      db.collection("users")
        .doc(uid)
        .update({
          following: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });
      db.collection("activity")
        .doc()
        .set({
          followerId: uid,
          followerPhoto: photo,
          followerName: username,
          uid: user.uid,
          photo: user.photo,
          username: user.username,
          date: new Date().getTime(),
          type: "FOLLOWER"
        });
      dispatch(sendNotification(user.uid, "Started Following You"));
      dispatch(getUser(user.uid));
    } catch (e) {
      /* console.error(e) */
    }
  };
};

export const unfollowUser = user => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    try {
      db.collection("users")
        .doc(user.uid)
        .update({
          followers: firebase.firestore.FieldValue.arrayRemove(uid)
        });
      db.collection("users")
        .doc(uid)
        .update({
          following: firebase.firestore.FieldValue.arrayRemove(user.uid)
        });
      dispatch(getUser(user.uid));
    } catch (e) {
      /* console.error(e) */
    }
  };
};

export const passwordResetEmail = () => {
  return async (dispatch, getState) => {
    const { uid, email } = getState().user;
    var auth = firebase.auth();
    try {
      await auth.sendPasswordResetEmail(email).then(() => {
        alert("Reset request sent to email."); // Email sent.
      });
    } catch (e) {
      alert(e);
    }
  };
};
