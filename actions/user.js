import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import db from "../config/firebase";
import { orderBy, groupBy, values } from "lodash";
import { allowNotifications, sendNotification } from "./";
import * as Facebook from "expo-facebook";
import { uploadPhoto } from "../actions/index";
import { getActivities } from "../actions/activity";
import MixpanelManager from "../Analytics";
import _ from "lodash";
import {
  addUserPostToTimeline,
  removeUserPostFromTimeline,
} from "../actions/post";

import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import { filterBlockedPosts, getUserPosts } from "./post";
import { Alert, PermissionsAndroid } from "react-native";

import { showMessage, hideMessage } from "react-native-flash-message";
import { buildPreview } from "../component/BuildingPreview";
import FastImage from "react-native-fast-image";
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
import Contacts from "react-native-contacts";

import {
  USERCONTACTS_REQUEST,
  USERCONTACTS_SUCCESS,
  USERCONTACTS_FAIL,
  USER_DEVICECONTACTS,
} from "./actiontype";

export const updateEmail = (email) => {
  return { type: "UPDATE_EMAIL", payload: email };
};
export const updateRepresentativeName = (representativeName) => {
  return { type: "UPDATE_REPRESENTATIVE_NAME", payload: representativeName };
};
export const updatePhone = (phone) => {
  return { type: "UPDATE_PHONE", payload: phone };
};
export const logout = () => {
  MixpanelManager.sharedInstance.resetMixPanel();

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
export const updateBgImage = (photo) => {
  return { type: "UPDATE_BG_PHOTO", payload: photo };
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
export const identifyUser = (uid) => {
  // alert(uid);
  try {
    MixpanelManager.sharedInstance.mixpanel.identify(uid);
    // MixpanelManager.sharedInstance.mixpanel.track("Track Event!");
    // MixpanelManager.sharedInstance.mixpanel.flush();
    // MixpanelManager.sharedInstance.mixpanel.getPeople().identify(uid);
    // alert(uid);
  } catch (error) {
    // alert(error);
    console.error(error);
  }
};
export const login = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password } = getState().user;

      const response = await auth().signInWithEmailAndPassword(email, password);

      dispatch(getUser(response.user.uid));
      dispatch(filterBlockedPosts());
      dispatch(allowNotifications(response.user.uid));
      dispatch(getActivities());
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
        Alert.alert("Error", "That email address is invalid!");
      } else if (error.code === "auth/user-not-found") {
        console.log("User Not Found");
        Alert.alert("Error", "User Not Found");
      } else if (error.code === "auth/wrong-password") {
        console.log("Invalid Credentials");
        Alert.alert("Error", "Invalid Credentials");
      } else if (error.code === "auth/too-many-requests") {
        console.log(
          "Too many unsuccessful login attempts. Please try again later."
        );
        Alert.alert(
          "Error",
          "Too many unsuccessful login attempts. Please try again later."
        );
      } else {
        alert(e);
      }
    }
  };
};
export const getLoggedInUserData = (uid) => {
  return async (dispatch, getState) => {
    try {
      // dispatch(getUser(uid));
      dispatch(filterBlockedPosts());
      dispatch(allowNotifications(uid));
      dispatch(getActivities());
    } catch (e) {
      alert(e);
    }
  };
};
export const facebookLogin = () => {
  return async (dispatch) => {
    // await Facebook.initializeAsync("239016010571551");
    // const {
    //   type,
    //   token,
    //   expires,
    //   permissions,
    //   declinedPermissions,
    // } = await Facebook.logInWithReadPermissionsAsync({
    //   permissions: ["public_profile", "email"],
    // });
    // if (type === "success") {
    //   // Build Firebase credential with the Facebook access token.
    //   const credential = await firebase.auth.FacebookAuthProvider.credential(
    //     token
    //   );
    //   // Sign in with credential from the Facebook user.
    //   const firebaseResponse = await firebase
    //     .auth()
    //     .signInWithCredential(credential);
    //   var response = firebaseResponse.user;
    //   const user = await db.collection("users").doc(response.uid).get();
    //   if (!user.exists) {
    //     var email =
    //       response.email == null || response.email == undefined
    //         ? response.providerData[0].email
    //         : response.email;
    //     if (email == null || email == undefined) {
    //       email = response.providerData[0].uid + "@facebook.com";
    //     }
    //     var username = response.displayName.toLowerCase().replace(/\s+/g, "_");
    //     const user = {
    //       uid: response.uid,
    //       email: email,
    //       username: response.displayName,
    //       user_name: username,
    //       bio: "",
    //       userbio: "",
    //       photo: response.photoURL + "?width=9999&height=9999",
    //       token: null,
    //       followers: [],
    //       following: [],
    //       blocked: [],
    //       blockedBy: [],
    //     };
    //     db.collection("users").doc(response.uid).set(user);
    //     dispatch({ type: "LOGIN", payload: user });
    //   } else {
    //     dispatch(getUser(response.uid));
    //   }
    // } else {
    //   // type === 'cancel'
    // }
  };
};

export const appleLogin = () => {
  return async (dispatch) => {
    // 1). start a apple sign-in request
    // const appleAuthRequestResponse = await appleAuth.performRequest({
    //   requestedOperation: AppleAuthRequestOperation.LOGIN,
    //   requestedScopes: [
    //     AppleAuthRequestScope.EMAIL,
    //     AppleAuthRequestScope.FULL_NAME,
    //   ],
    // });
    // // 2). if the request was successful, extract the token and nonce
    // const { identityToken, nonce, user } = appleAuthRequestResponse;
    // var userIdToken = user;
    // // alert(JSON.stringify(appleAuthRequestResponse));
    // if (identityToken) {
    //   var data = {};
    //   data.email = appleAuthRequestResponse.email;
    //   data.username =
    //     appleAuthRequestResponse.fullName.givenName +
    //     " " +
    //     appleAuthRequestResponse.fullName.familyName;
    //   // user.password = new Date().getTime().toString();
    //   data.password = appleAuthRequestResponse.email;
    //   const { email, password, username } = data;
    //   var userData = null;
    //   const userQuery = await db
    //     .collection("users")
    //     .where("identityToken", "==", userIdToken)
    //     .get();
    //   // const user = await db.collection("users").doc(response.uid).get();
    //   userQuery.forEach(function (response) {
    //     userData = response.data();
    //     return;
    //   });
    //   // alert(JSON.stringify(userData));
    //   if (!userData) {
    //     const response = await firebase
    //       .auth()
    //       .createUserWithEmailAndPassword(email, password);
    //     if (response.user.uid) {
    //       var user_name = username.toLowerCase().replace(/\s+/g, "_");
    //       const user = {
    //         uid: response.user.uid,
    //         email: email,
    //         username: username,
    //         user_name: user_name,
    //         photo: "",
    //         bio: "",
    //         userbio: "",
    //         identityToken: userIdToken,
    //         token: null,
    //         followers: [],
    //         blocked: [],
    //         blockedBy: [],
    //         following: [],
    //         reports: [],
    //       };
    //       db.collection("users").doc(response.user.uid).set(user);
    //       dispatch({ type: "LOGIN", payload: user });
    //     }
    //   } else {
    //     // alert(userData.uid);
    //     const response = await firebase
    //       .auth()
    //       .signInWithEmailAndPassword(userData.email, userData.email);
    //     dispatch(getUser(response.user.uid));
    //   }
    // } else {
    //   alert("Apple Login Failed");
    //   // handle this - retry?
    // }
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

// export const getUser = (uid, type) => {
//   return async (dispatch, getState) => {
//     try {
//       if (uid) {
//         var images = [];

//         const userQuery = await db.collection("users").doc(uid).get();
//         let user = userQuery.data();
//         if (user.photo && user.photo.length > 15) {
//           images.push({
//             uri: user.photo,
//           });
//         }

//         let posts = [];
//         const postsQuery = await db
//           .collection("posts")
//           .where("uid", "==", uid)
//           .get();
//         postsQuery.forEach(function (response) {
//           posts.push(response.data());
//         });

//         user.posts = posts;

//         if (posts != null && posts.length > 0) {
//           user.posts = orderBy(posts, "date", "desc");
//         }

//         if (type === "LOGIN") {
//           //get my followers list

//           dispatch({ type: "LOGIN", payload: user });
//         } else {
//           dispatch({ type: "GET_PROFILE", payload: user });
//         }

//         if (images.length > 0) {
//           // alert(JSON.stringify(images));
//           dispatch(preloadUserImages(images));
//         }

//         const followingQuery = db
//           .collection("users")
//           .where("followers", "array-contains", uid)
//           .get();

//         followingQuery.then((snapshot) => {
//           if (snapshot.size > 0) {
//             var following = snapshot.docs.map((doc) => doc.data());

//             if (type === "LOGIN") {
//               //get my followers list
//               const user = getState().user;

//               dispatch({
//                 type: "LOGIN",
//                 payload: { ...user, myFollowings: following },
//               });
//             } else {
//               const user = getState().profile;

//               dispatch({
//                 type: "GET_PROFILE",
//                 payload: { ...user, myFollowings: following },
//               });
//             }

//             // alert("Following: " + JSON.stringify(following));
//           }
//         });

//         const followersQuery = db
//           .collection("users")
//           .where("following", "array-contains", uid)
//           .get();

//         followersQuery.then((snapshot) => {
//           if (snapshot.size > 0) {
//             var followers = snapshot.docs.map((doc) => doc.data());

//             if (type === "LOGIN") {
//               const user = getState().user;

//               //get my followers list
//               dispatch({
//                 type: "LOGIN",
//                 payload: { ...user, myFollowers: followers },
//               });
//             } else {
//               const user = getState().profile;

//               dispatch({
//                 type: "GET_PROFILE",
//                 payload: { ...user, myFollowers: followers },
//               });
//             }

//             // alert("Following: " + JSON.stringify(following));
//           }
//         });
//       }
//     } catch (e) {
//       alert("Error: User Not Found ");
//     }
//   };
// };

export const getUser = (uid, type = "", cb = (result, error) => {}) => {
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

        if (type === "LOGIN") {
          //get my followers list

          dispatch({ type: "LOGIN", payload: user });
          dispatch(getUserPosts(user, (result, error) => {}, null));

          // identify user
          MixpanelManager.sharedInstance.identify(user.uid);

          //register super properties
          var superProperties = {
            accountType: user.accountType ? user.accountType : "Personal",
          };

          MixpanelManager.sharedInstance.registerSuperProperties(
            superProperties
          );

          var profileProperties = {
            name: user.username,
            email: user.email,
            phone: user.phone,
          };
          MixpanelManager.sharedInstance.setProfileProperties(
            profileProperties
          );
        } else {
          dispatch({ type: "GET_PROFILE", payload: user });
        }
        cb(user, null);
        // cb();

        if (images.length > 0) {
          // alert(JSON.stringify(images));
          dispatch(preloadUserImages(images));
        }
      }
    } catch (e) {
      cb(null, e);
      // cb();
      // alert("Error: User Not Found ");
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

export const updateUser = (user = null) => {
  return async (dispatch, getState) => {
    const {
      uid,
      username,
      bio,
      userbio,
      photo,
      bgImage,
      accountType,
      websiteLabel,
      phone,
      gender,
      dob,
      backgroundPreview,
      compressedPhoto,
      preview,
      email,
      representativeName,
      links,
      fullname,
    } = user;
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
        async (usernameAvailable) => {
          if (usernameAvailable) {
            showMessage({
              message: "",
              description: "Updating Profile, Please wait...",
              type: "info",
              duration: 2000,
            });

            var backgroundImage,
              previewImage,
              profileImage,
              backgroundImagePreview = "";

            if (bgImage) {
              backgroundImage = await dispatch(uploadPhoto(bgImage));
            }
            if (backgroundPreview) {
              backgroundImagePreview = await dispatch(
                uploadPhoto(backgroundPreview)
              );
            }

            if (preview) {
              previewImage = await dispatch(uploadPhoto(preview));
            }

            if (imageUri) {
              profileImage = await dispatch(uploadPhoto(imageUri));
            }

            var user_name = username.toLowerCase().replace(/\s+/g, "_");

            // alert(profileImage);
            dispatch(updatePhoto(profileImage));

            user.photo = profileImage;
            user.preview = previewImage;
            user.backgroundPreview = backgroundImagePreview;
            user.bgImage = backgroundImage;
            user.updatedAt = new Date().getTime();
            user.user_name = user_name;

            var updateObj = {
              username: username || "",
              user_name: user_name,
              bio: bio || "",
              email: email,
              phone: phone,
              representativeName: representativeName,
              userbio: userbio || "",
              photo: profileImage,
              updatedAt: user.updatedAt,
              preview: previewImage || "",
              backgroundPreview: backgroundImagePreview || "",
              bgImage: backgroundImage || "",
              phone: phone || "",
              gender: gender || "",
              fullname: fullname || "",
              dob: dob || null,
              accountType: accountType || null,
              websiteLabel: websiteLabel || null,
              links: links || [],
            };

            db.collection("users").doc(uid).update(updateObj);

            dispatch({ type: "LOGIN", payload: user });

            showMessage({
              message: "",
              description: "Profile Updated Successfully",
              type: "success",
              duration: 4000,
            });
            dispatch(updateCompressedPhoto(""));
            // dispatch(getUser(uid, "LOGIN"));
          } else {
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

export const getBrandsRequests = (lastFetchedDate = null) => {
  return async (dispatch, getState) => {
    var { brandRequests } = getState().user;

    if (!brandRequests) {
      brandRequests = [];
    }
    // var lastFetchedDate;

    // if (brandRequests && brandRequests.length > 0) {
    //   lastFetchedDate = brandRequests[brandRequests.length - 1].requestDate;
    // }
    try {
      dispatch({ type: "GET_BRANDS_APPROVAL_REQUESTS" });
      var brandApprovalRequests;
      if (lastFetchedDate) {
        // alert(lastFetchedPostDate);
        brandApprovalRequests = await db
          .collection("users")
          .where("accountStatus", "==", "inreview")
          .orderBy("requestDate", "desc")
          .startAfter(lastFetchedDate)
          .limit(15)
          .get();
      } else {
        brandApprovalRequests = await db
          .collection("users")
          .where("accountStatus", "==", "inreview")
          .orderBy("requestDate", "desc")
          .limit(15)
          .get();
      }

      var array = [];
      brandApprovalRequests.forEach((brand) => {
        array.push(brand.data());
      });

      if (array.length > 0) {
        var mergedArray = brandRequests.concat(array);
        var arrBrandRequests = _.uniqBy(mergedArray, "uid");

        // alert(JSON.stringify(arrBrandRequests));
        dispatch({
          type: "GET_BRANDS_APPROVAL_REQUESTS_SUCCESS",
          payload: arrBrandRequests,
        });
      }
    } catch (e) {
      console.log(e);
      let array = [];
      dispatch({ type: "GET_BRANDS_APPROVAL_REQUESTS_FAIL" });
      alert(e);

      // alert(e);
    }
  };
};

export const requestForBrandApproval = (navigation) => {
  return async (dispatch, getState) => {
    var user = { ...getState().user };

    let errorMsg = "";

    if (!user.photo) {
      errorMsg = "Please upload your brand logo before requesting for approval";
    } else if (!user.bgImage) {
      errorMsg =
        "Please upload your brand background image before requesting for approval";
      // "Please complete your brand profile before requesting for approval";
    }

    if (errorMsg) {
      navigation.navigate("EditProfile", {
        title: user.username,
        user: user,
      });

      showMessage({
        message: "STOP",
        description: errorMsg,
        type: "danger",
        duration: 4000,
      });

      return;
    }

    try {
      user.accountStatus = "inreview";
      user.requestDate = new Date().getTime();

      var updateObj = {
        accountStatus: user.accountStatus,
        requestDate: user.requestDate,
      };

      db.collection("users").doc(user.uid).update(updateObj);

      dispatch({ type: "LOGIN", payload: user });

      showMessage({
        message: "",
        description: "Request For Brand Approval Submitted Successfully",
        type: "info",
        duration: 4000,
      });
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
          blocked: firestore.FieldValue.arrayUnion(blockedUser.uid),
        });

      db.collection("users")
        .doc(blockedUser.uid)
        .update({
          blockedBy: firestore.FieldValue.arrayUnion(uid),
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
          blocked: firestore.FieldValue.arrayUnion(blockedUid),
        });

      db.collection("users")
        .doc(blockedUid)
        .update({
          blockedBy: firestore.FieldValue.arrayUnion(uid),
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

export const updateBrandAccountStatus = (uid, status) => {
  return async (dispatch, getState) => {
    var { brandRequests } = getState().user;

    if (!brandRequests) {
      brandRequests = [];
    }

    try {
      var updateObj = {
        accountStatus: status,
        requestDate: new Date().getTime(),
      };

      db.collection("users").doc(uid).update(updateObj);

      var updatedBrandRequests = brandRequests.filter(
        (user) => user.uid !== uid
      );
      dispatch({
        type: "GET_BRANDS_APPROVAL_REQUESTS_SUCCESS",
        payload: updatedBrandRequests,
      });

      showMessage({
        message: "",
        description: "Brand Account Status Updated Successfully",
        type: "info",
        duration: 3000,
      });
    } catch (e) {
      alert(e);
    }
  };
};

export const deleteAuth = () => {
  return async (dispatch, getState) => {
    var user = auth().currentUser;

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
      const {
        email,
        password,
        username,
        bio,
        accountType,
        representativeName,
      } = getState().user;

      var usernameAvailable = await dispatch(
        checkUserNameAvailable(username, null)
      );
      if (usernameAvailable) {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password
        );

        if (response.user.uid) {
          var user_name = username.toLowerCase().replace(/\s+/g, "_");

          const user = {
            uid: response.user.uid,
            email: email,
            username: username,
            user_name: user_name,
            photo: "",
            accountType: accountType || null,
            representativeName: representativeName || null,
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
export const signupWithPhoneNumber = (
  uid,
  navigation,
  phoneNumber,
  countryCode
) => {
  return async (dispatch, getState) => {
    try {
      const {
        email,
        username,
        accountType,
        representativeName,
      } = getState().user;
      var usernameAvailable = await dispatch(
        checkUserNameAvailable(username, null)
      );
      if (usernameAvailable) {
        var user_name = username.toLowerCase().replace(/\s+/g, "_");
        const user = {
          uid: uid,
          email: email,
          username: username,
          user_name: user_name,
          photo: "",
          phone: phoneNumber,
          countryCode,
          accountType: accountType || null,
          representativeName: representativeName || null,
          createdAt: new Date().getTime(),
          token: null,
          followers: [],
          following: [],
          reports: [],
          blocked: [],
          blockedBy: [],
        };
        db.collection("users").doc(uid).set(user);

        var eventProperties = {
          name: username,
          datetime: new Date(),
          phone: phoneNumber,
          "Signed Up": "yes",
        };
        MixpanelManager.sharedInstance.trackEventWithProperties(
          "Sign Up",
          eventProperties
        );

        // dispatch(getUser(response.user.uid));
        dispatch({ type: "LOGIN", payload: user });
        dispatch(filterBlockedPosts());
        dispatch(allowNotifications(uid));
        // navigation.popToTop();
        // navigation.replace("HomeScreen");
        // navigation.navigate("WelcomeScreen");
        navigation.popToTop();
        navigation.replace("HomeScreen", {
          showWelcomeScreen: true,
          flow: "Signup",
        });
      } else {
        alert("Username already exists, Please choose another username");
        return "Username already exists";
      }
      // navigation.popToTop();
      // navigation.replace("HomeScreen");
      // navigation.navigate("WelcomeScreen");
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
          followers: firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("users")
        .doc(uid)
        .update({
          following: firestore.FieldValue.arrayUnion(user.uid),
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
          followers: firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("users")
        .doc(uid)
        .update({
          following: firestore.FieldValue.arrayUnion(user.uid),
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

    try {
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
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

export const getUserContacts = (deviceContacts, deviceContactsInfo = []) => {
  return async (dispatch, getState) => {
    // alert(limit);

    var loopCount = Math.ceil(deviceContacts.length / 10);
    // alert(loopCount);
    let userContacts = [];

    try {
      dispatch({ type: USERCONTACTS_REQUEST });

      for (let i = 0; i < loopCount; i++) {
        var start = i * 10;
        var end = start + 10;
        var numbers = deviceContacts.slice(start, end);

        const userQuery = await db
          .collection("users")
          .where("phone", "in", numbers)
          .get();

        userQuery.forEach(function (response) {
          userContacts.push(response.data());
        });
        if (userContacts && userContacts.length > 0) {
          dispatch({ type: USERCONTACTS_SUCCESS, payload: userContacts });
          dispatch(filterInviteContacts(deviceContactsInfo));
        }
      }
      // alert("Success\n" + JSON.stringify(userContacts));
      dispatch({ type: "REFRESHING_CONTACTS", payload: false });
      dispatch({ type: USERCONTACTS_SUCCESS, payload: userContacts });
    } catch (e) {
      alert(e);
      dispatch({ type: USERCONTACTS_SUCCESS, payload: userContacts });
    }
  };
};

export const filterInviteContacts = (deviceContacts) => {
  return async (dispatch, getState) => {
    const { userContacts } = getState().user;

    try {
      let filteredContacts = [];
      filteredContacts = deviceContacts.filter((item) => {
        if (!(item && item.phoneNumbers && item.phoneNumbers.length > 0)) {
          return false;
        }

        return !userContacts.find((element) => {
          var formattedNumber;
          var inputnumber = item.phoneNumbers[0].number.replace(
            /[&\/\\#,()$~%.'":*?<>{}-\s]/g,
            ""
          );
          try {
            var tel = phoneUtil.parse(inputnumber);

            // var formattedNumber = phoneUtil.format(tel, PNF.E164);
            formattedNumber = tel.getNationalNumber();
            // alert(tel.getNationalNumber());
          } catch (error) {
            // alert(number);
            formattedNumber = inputnumber;
          }

          return element.phone === formattedNumber;
        });
      });

      dispatch({ type: USER_DEVICECONTACTS, payload: filteredContacts });
    } catch (e) {
      let array = [];
    }
  };
};

export const getAllContacts = (refresh = false) => {
  return async (dispatch, getState) => {
    const { userContacts } = getState().user;

    try {
      if (Platform.OS === "android") {
        // console.log("PLATFORM => ", Platform.OS);
        // PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        //   {
        //     title: "Contacts",
        //     message: "This app would like to view your contacts.",
        //     buttonPositive: "Accept",
        //   }
        // )
        //   .then((flag) => {
        //     console.log("WRITE_CONTACTS Permission Granted => ", flag);

        //     if (flag === "granted") {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Contacts",
            message: "This app would like to view your contacts.",
            buttonPositive: "Accept",
          }
        )
          .then((flag) => {
            console.log("READ_CONTACTS Permission Granted => ", flag);
            if (flag === "granted") {
              dispatch(fectchContacts(refresh));
            }
          })
          .catch(() => {
            console.log("READ_CONTACTS Permission Denied");
          });
        //   }
        // })
        // .catch(() => {
        //   console.log("WRITE_CONTACTS Permission Denied");
        //   alert("WRITE_CONTACTS Permission Denied");
        // });
      } else {
        dispatch(fectchContacts(refresh));
      }
    } catch (e) {
      let array = [];
    }
  };
};

export const fectchContacts = (refresh = false) => {
  return async (dispatch, getState) => {
    const { userContacts } = getState().user;
    const { userDeviceContacts } = getState().contacts;

    try {
      Contacts.getAll()
        .then(async (contacts) => {
          if (contacts) {
            const allDeviceContacts = [];
            const allNumbers = [];
            contacts.forEach((doc) => {
              allDeviceContacts.push(...doc.phoneNumbers);
            });
            allDeviceContacts.forEach((doc) => {
              if (doc && doc.number) {
                var formattedNumber;
                var inputnumber = doc.number.replace(
                  /[&\/\\#,()$~%.'":*?<>{}-\s]/g,
                  ""
                );
                try {
                  var tel = phoneUtil.parse(inputnumber);

                  // var formattedNumber = phoneUtil.format(tel, PNF.E164);
                  formattedNumber = tel.getNationalNumber();
                  // alert(tel.getNationalNumber());
                } catch (error) {
                  // alert(number);
                  formattedNumber = inputnumber;
                }
                allNumbers.push(formattedNumber);
              }
            });
            // setContacts(allNumbers);
            // alert(JSON.stringify(props.user.userContacts));
            if (userDeviceContacts.length < 1 || refresh) {
              if (refresh) {
                dispatch({ type: "REFRESHING_CONTACTS", payload: true });
              }

              dispatch(getUserContacts(allNumbers, contacts));
            }

            dispatch(filterInviteContacts(contacts));
          }
        })
        .catch((e) => {
          alert(e);
        });

      Contacts.getCount().then((count) => {
        // alert(`Search ${count} contacts`);
        // this.setState({ searchPlaceholder: `Search ${count} contacts` });
      });

      Contacts.checkPermission();
    } catch (e) {
      let array = [];
    }
  };
};
