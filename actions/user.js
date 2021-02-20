import firebase from "firebase";
import auth from "@react-native-firebase/auth";
import { firebase as firebaseAuth } from "@react-native-firebase/auth";
import db from "../config/firebase";
import { orderBy, groupBy, values } from "lodash";
import { allowNotifications, sendNotification } from "./";
import * as Facebook from "expo-facebook";
import { uploadPhoto } from "../actions/index";
import { getActivities } from "../actions/activity";
import {
  addUserPostToTimeline,
  removeUserPostFromTimeline,
} from "../actions/post";

import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import { filterBlockedPosts } from "./post";

import { showMessage, hideMessage } from "react-native-flash-message";
import { buildPreview } from "../component/BuildingPreview";
import FastImage from "react-native-fast-image";

export const updateEmail = (email) => {
  return { type: "UPDATE_EMAIL", payload: email };
};

export const updatePhone = (phone) => {
  return { type: "UPDATE_PHONE", payload: phone };
};
export const logout = () => {
  return { type: "USER_LOGOUT" };
};
export const updateGender = (gender) => {
  return { type: "UPDATE_GENDER", payload: gender };
};

export const updateAccountType = (accountType) => {
  return { type: "UPDATE_ACCOUNT_TYPE", payload: accountType };
};

export const updateDOB = (dob) => {
  return { type: "UPDATE_USER_DOB", payload: dob };
};

export const updatePassword = (password) => {
  return { type: "UPDATE_PASSWORD", payload: password };
};

export const updateUsername = (username) => {
  return { type: "UPDATE_USERNAME", payload: username };
};

export const updateBio = (bio) => {
  return { type: "UPDATE_BIO", payload: bio };
};

export const updateUserBio = (bio) => {
  return { type: "UPDATE_USER_BIO", payload: bio };
};

export const updateWebsiteLabel = (label) => {
  return { type: "UPDATE_WEBSITE_LABEL", payload: label };
};

export const updatePhoto = (photo) => {
  return { type: "UPDATE_USER_PHOTO", payload: photo };
};

export const updateCompressedPhoto = (photo) => {
  return { type: "UPDATE_COMPRESSED_USER_PHOTO", payload: photo };
};

export const updatePhotoPreview = (input) => {
  return { type: "UPDATE_USER_PHOTO_PREVIEW", payload: input };
};

export const createAndUpdatePreview = (input) => {
  return async (dispatch, getState) => {
    buildPreview(input, 50, 50).then((image) => {
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
      dispatch(filterBlockedPosts());
      dispatch(allowNotifications(response.user.uid));
      dispatch(getActivities());
    } catch (e) {
      alert(e);
    }
  };
};

export const facebookLogin = () => {
  return async (dispatch) => {
    await Facebook.initializeAsync("239016010571551");
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"],
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
      const user = await db.collection("users").doc(response.uid).get();
      if (!user.exists) {
        var email =
          response.email == null || response.email == undefined
            ? response.providerData[0].email
            : response.email;

        if (email == null || email == undefined) {
          email = response.providerData[0].uid + "@facebook.com";
        }

        var username = response.displayName.toLowerCase().replace(/\s+/g, "_");
        const user = {
          uid: response.uid,
          email: email,
          username: response.displayName,
          user_name: username,
          bio: "",
          userbio: "",
          photo: response.photoURL + "?width=9999&height=9999",
          token: null,
          followers: [],
          following: [],
          blocked: [],
          blockedBy: [],
        };
        db.collection("users").doc(response.uid).set(user);
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch(getUser(response.uid));
      }
    } else {
      // type === 'cancel'
    }
  };
};

export const appleLogin = () => {
  return async (dispatch) => {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce, user } = appleAuthRequestResponse;

    var userIdToken = user;
    // alert(JSON.stringify(appleAuthRequestResponse));
    if (identityToken) {
      var data = {};
      data.email = appleAuthRequestResponse.email;
      data.username =
        appleAuthRequestResponse.fullName.givenName +
        " " +
        appleAuthRequestResponse.fullName.familyName;
      // user.password = new Date().getTime().toString();
      data.password = appleAuthRequestResponse.email;
      const { email, password, username } = data;

      var userData = null;
      const userQuery = await db
        .collection("users")
        .where("identityToken", "==", userIdToken)
        .get();
      // const user = await db.collection("users").doc(response.uid).get();

      userQuery.forEach(function (response) {
        userData = response.data();
        return;
      });

      // alert(JSON.stringify(userData));
      if (!userData) {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        if (response.user.uid) {
          var user_name = username.toLowerCase().replace(/\s+/g, "_");

          const user = {
            uid: response.user.uid,
            email: email,
            username: username,
            user_name: user_name,
            photo: "",
            bio: "",
            userbio: "",
            identityToken: userIdToken,
            token: null,
            followers: [],
            blocked: [],
            blockedBy: [],
            following: [],
            reports: [],
          };
          db.collection("users").doc(response.user.uid).set(user);
          dispatch({ type: "LOGIN", payload: user });
        }
      } else {
        // alert(userData.uid);
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(userData.email, userData.email);
        dispatch(getUser(response.user.uid));
      }
    } else {
      alert("Apple Login Failed");
      // handle this - retry?
    }
  };
};

export const checkUserNameAvailable = (username, uid) => {
  return async (dispatch, getState) => {
    try {
      const usernameQuery = await db
        .collection("users")
        .where("username", "==", username)
        .get();
      if (usernameQuery.size > 0) {
        const checkUsernameAvailablity = () =>
          new Promise((resolve, reject) => {
            usernameQuery.forEach(async function (response) {
              var user = await response.data();
              if (uid && user.uid === uid) {
                resolve(true);
              } else {
                resolve(false);
              }
              resolve(false);
            });
          });
        let result = await checkUsernameAvailablity();
        return result;
      } else {
        return true;
      }
    } catch (e) {
      return true;
    }
  };
};

export const getUser = (uid, type) => {
  return async (dispatch, getState) => {
    try {
      if (uid) {
        var images = [];

        const userQuery = await db.collection("users").doc(uid).get();
        let user = userQuery.data();
        if (user.photo && user.photo.length > 15) {
          images.push({
            uri: user.photo,
          });
        }

        let posts = [];
        const postsQuery = await db
          .collection("posts")
          .where("uid", "==", uid)
          .get();
        postsQuery.forEach(function (response) {
          posts.push(response.data());
        });

        user.posts = posts;

        if (posts != null && posts.length > 0) {
          user.posts = orderBy(posts, "date", "desc");
        }

        if (type === "LOGIN") {
          //get my followers list

          dispatch({ type: "LOGIN", payload: user });
        } else {
          dispatch({ type: "GET_PROFILE", payload: user });
        }

        if (images.length > 0) {
          // alert(JSON.stringify(images));
          dispatch(preloadUserImages(images));
        }

        const followingQuery = db
          .collection("users")
          .where("followers", "array-contains", uid)
          .get();

        followingQuery.then((snapshot) => {
          if (snapshot.size > 0) {
            var following = snapshot.docs.map((doc) => doc.data());

            if (type === "LOGIN") {
              //get my followers list
              const user = getState().user;

              dispatch({
                type: "LOGIN",
                payload: { ...user, myFollowings: following },
              });
            } else {
              const user = getState().profile;

              dispatch({
                type: "GET_PROFILE",
                payload: { ...user, myFollowings: following },
              });
            }

            // alert("Following: " + JSON.stringify(following));
          }
        });

        const followersQuery = db
          .collection("users")
          .where("following", "array-contains", uid)
          .get();

        followersQuery.then((snapshot) => {
          if (snapshot.size > 0) {
            var followers = snapshot.docs.map((doc) => doc.data());

            if (type === "LOGIN") {
              const user = getState().user;

              //get my followers list
              dispatch({
                type: "LOGIN",
                payload: { ...user, myFollowers: followers },
              });
            } else {
              const user = getState().profile;

              dispatch({
                type: "GET_PROFILE",
                payload: { ...user, myFollowers: followers },
              });
            }

            // alert("Following: " + JSON.stringify(following));
          }
        });
      }
    } catch (e) {
      alert("Error: User Not Found ");
    }
  };
};

export const getBlockedUser = () => {
  return async (dispatch, getState) => {
    const user = getState().user;
    try {
      const followingQuery = db
        .collection("users")
        .where("blockedBy", "array-contains", user.uid)
        .get();

      followingQuery.then((snapshot) => {
        if (snapshot.size > 0) {
          var blockedUsers = snapshot.docs.map((doc) => doc.data());

          // alert(JSON.stringify(blockedUsers));
          dispatch({
            type: "LOGIN",
            payload: { ...user, blockedUsers: blockedUsers },
          });

          // dispatch(filterBlockedPosts());
        }
      });
    } catch (e) {
      alert("Error:" + e);
    }
  };
};

export const updateUser = () => {
  return async (dispatch, getState) => {
    const {
      uid,
      username,
      bio,
      userbio,
      photo,
      accountType,
      websiteLabel,
      phone,
      gender,
      dob,
      compressedPhoto,
      preview,
    } = getState().user;

    var imageUri = "";
    // imageUri = photo;

    // alert("Compressed-" + compressedPhoto + "\n local-+" + photo);
    if (compressedPhoto) {
      imageUri = compressedPhoto;
    } else {
      imageUri = photo;
    }

    try {
      dispatch(checkUserNameAvailable(username, uid)).then(
        (usernameAvailable) => {
          if (usernameAvailable) {
            showMessage({
              message: "",
              description: "Updating Profile, Please wait...",
              type: "info",
              duration: 2000,
            });
            dispatch(uploadPhoto(imageUri)).then((imageurl) => {
              var user_name = username.toLowerCase().replace(/\s+/g, "_");

              dispatch(updatePhoto(imageurl));
              db.collection("users")
                .doc(uid)
                .update({
                  username: username || "",
                  user_name: user_name,
                  bio: bio || "",
                  userbio: userbio || "",
                  photo: imageurl,
                  updatedAt: new Date().getTime(),
                  preview: preview || "",
                  phone: phone || "",
                  gender: gender || "",
                  dob: dob || null,
                  accountType: accountType || null,
                  websiteLabel: websiteLabel || null,
                });

              showMessage({
                message: "",
                description: "Profile Updated Successfully",
                type: "success",
                duration: 4000,
              });
              dispatch(updateCompressedPhoto(""));
            });
          } else {
            dispatch(getUser(uid, "LOGIN"));

            alert("Username already exists, Please choose another username");
            return "Username already exists";
          }
        }
      );
      // var result = await dispatch(checkUserNameAvailable(username));
      // alert(result);
    } catch (e) {
      alert(e);
    }
  };
};

export const blockUser = (blockedUser) => {
  return async (dispatch, getState) => {
    const {
      uid,
      photo,
      username,
      following,
      blockedUsers,
      blocked,
    } = getState().user;

    var blockedUsersList = blockedUsers;
    var blockedUserIds = blocked;
    if (!blockedUsers) {
      blockedUsersList = [];
    }
    if (!blocked) {
      blockedUserIds = [];
    }
    try {
      db.collection("users")
        .doc(uid)
        .update({
          blocked: firebase.firestore.FieldValue.arrayUnion(blockedUser.uid),
        });

      db.collection("users")
        .doc(blockedUser.uid)
        .update({
          blockedBy: firebase.firestore.FieldValue.arrayUnion(uid),
        });

      blockedUsersList.push(blockedUser);
      blockedUserIds.push(blockedUser.uid);

      dispatch({
        type: "UPDATE_BLOCKED_USERS",
        payload: [...blockedUsersList],
      });

      dispatch({
        type: "UPDATE_BLOCKED_USERS_IDS",
        payload: [...blockedUserIds],
      });

      showMessage({
        message: "",
        description: "User Blocked Successfully",
        type: "info",
        duration: 2000,
      });
      dispatch(filterBlockedPosts());
    } catch (e) {
      alert(e);
    }
  };
};

export const unblockUser = (blockedUid) => {
  return async (dispatch, getState) => {
    const {
      uid,
      photo,
      username,
      following,
      blockedUsers,
      blocked,
    } = getState().user;
    var blockedUsersList = getState().user.blockedUsers;
    var blockedUserIds = blocked;
    if (!blockedUsers) {
      blockedUsersList = [];
    }
    if (!blocked) {
      blockedUserIds = [];
    }

    try {
      db.collection("users")
        .doc(uid)
        .update({
          blocked: firebase.firestore.FieldValue.arrayRemove(blockedUid),
        });

      db.collection("users")
        .doc(blockedUid)
        .update({
          blockedBy: firebase.firestore.FieldValue.arrayRemove(uid),
        });

      blockedUsersList = blockedUsersList.filter(
        (value) => value.uid !== blockedUid
      );

      blockedUserIds = blockedUserIds.filter((uid) => uid !== blockedUid);
      dispatch({
        type: "UPDATE_BLOCKED_USERS",
        payload: [...blockedUsersList],
      });

      dispatch({
        type: "UPDATE_BLOCKED_USERS_IDS",
        payload: [...blockedUserIds],
      });

      showMessage({
        message: "",
        description: "User Unblocked ",
        type: "info",
        duration: 2000,
      });
      dispatch(filterBlockedPosts());
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
      db.collection("users").doc(uid).delete();
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
    .then(function (querySnapshot) {
      // Once we get the results, begin a batch
      var batch = db.batch();

      querySnapshot.forEach(function (doc) {
        // For each doc, add a delete operation to the batch
        batch.delete(doc.ref);
      });

      // Commit the batch
      return batch.commit();
    })
    .then(function () {
      alert("deleting posts...");
    });
};

export const signup = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password, username, bio } = getState().user;

      var usernameAvailable = await dispatch(
        checkUserNameAvailable(username, null)
      );
      if (usernameAvailable) {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        if (response.user.uid) {
          var user_name = username.toLowerCase().replace(/\s+/g, "_");

          const user = {
            uid: response.user.uid,
            email: email,
            username: username,
            user_name: user_name,
            photo: "",
            createdAt: new Date().getTime(),
            token: null,
            followers: [],
            following: [],
            reports: [],
            blocked: [],
            blockedBy: [],
          };
          db.collection("users").doc(response.user.uid).set(user);

          // dispatch(getUser(response.user.uid));
          dispatch({ type: "LOGIN", payload: user });
          dispatch(filterBlockedPosts());
          dispatch(allowNotifications(response.user.uid));
        }
      } else {
        alert("Username already exists, Please choose another username");
        return "Username already exists";
      }
    } catch (e) {
      alert(e);
    }
  };
};

export const followUser = (user) => {
  return async (dispatch, getState) => {
    const { uid, photo, username, following } = getState().user;
    try {
      db.collection("users")
        .doc(user.uid)
        .update({
          followers: firebase.firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("users")
        .doc(uid)
        .update({
          following: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
      following.push(user.uid);

      dispatch({ type: "UPDATE_FOLLOWING", payload: [...following] });
      db.collection("activity").doc().set({
        followerId: uid,
        followerPhoto: photo,
        followerName: username,
        uid: user.uid,
        photo: user.photo,
        username: user.username,
        date: new Date().getTime(),
        type: "FOLLOWER",
      });

      // const profile = { ...getState().profile };
      // // alert(JSON.stringify(profile.following));
      // var following = [...profile.following];
      // // alert(JSON.stringify(following));

      // following.push(user.uid);
      // profile.following = following;
      // // dispatch({
      // //   type: "GET_PROFILE",
      // //   payload: { ...profile },
      // // });
      // dispatch({ type: "GET_PROFILE", payload: profile });

      // const profile = { ...getState().profile };

      // var following = [...profile.following];
      // following.push(user.uid);
      // // profile.following = following;
      // dispatch({
      //   type: "GET_PROFILE",
      //   payload: { ...profile, myFollowings: following },
      // });
      // dispatch({ type: "FOLLOW_USER", payload: user.uid });

      //    dispatch(getUser(user.uid));
      // dispatch(sendNotification(user.uid, "Started Following You"));
      dispatch(addUserPostToTimeline(user.uid));

      var body = `${user.username} started following you`;
      dispatch(sendNotification(user.uid, "New Follower", body, "FOLLOWER"));
    } catch (e) {
      console.error(e);
      // alert(e)
    }
  };
};

export const unfollowUser = (user) => {
  return async (dispatch, getState) => {
    const { uid, photo, username, following } = getState().user;
    try {
      db.collection("users")
        .doc(user.uid)
        .update({
          followers: firebase.firestore.FieldValue.arrayRemove(uid),
        });
      db.collection("users")
        .doc(uid)
        .update({
          following: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
      var filteredAry = following.filter((e) => e !== user.uid);
      dispatch({ type: "UPDATE_FOLLOWING", payload: [...filteredAry] });

      dispatch(removeUserPostFromTimeline(user.uid));

      //   dispatch(getUser(user.uid));
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

export const preloadUserImages = (images) => {
  return async (dispatch, getState) => {
    try {
      FastImage.preload(images);
    } catch (e) {
      // alert(e);
    }
  };
};
