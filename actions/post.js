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
} from "./actiontype";
// import Toast from 'react-native-tiny-toast'
import { showMessage, hideMessage } from "react-native-flash-message";
import { isUserBlocked, isFollowing } from "../util/Helper";

import { buildPreview } from "../component/BuildingPreview";

import { uploadPhoto } from "../actions/index";

var unsubscribe = null;

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

export const updateVideoCover = (input) => {
  return { type: "UPDATE_VIDEO_COVER", payload: input };
};

export const createAndUpdatePreview = (input) => {
  return async (dispatch, getState) => {
    buildPreview(input, 200, 400).then((image) => {
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

export const mergeNewPosts = () => {
  return async (dispatch, getState) => {
    const { post } = getState();
    var mergedArray = post.feed.concat(post.newPosts);

    var uniquePosts = orderBy(_.uniqBy(mergedArray, "id"), "date", "desc");

    dispatch({ type: "MERGE_NEW_POSTS", payload: uniquePosts });
  };
};

export const addPostToFollowersTimeline = (post) => {
  return async (dispatch, getState) => {
    if (getState().user && getState().user.followers) {
      let followers = getState().user.followers;
      try {
        followers.forEach((uid) => {
          const upload = {
            postId: post.id,
            createdAt: post.date,
            uid: post.uid,
          };

          db.collection("timeline").doc(uid).collection("posts").add(upload);
        });
      } catch (e) {
        //  alert(e);
      }
    }
  };
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
      dispatch(uploadPhoto(post.preview)).then((preview) => {
        // alert(preview);
        dispatch(uploadPhoto(post.photo)).then((imageurl) => {
          if (imageurl) {
            // alert(JSON.stringify(imageurl));
            const id = uuid.v4();
            const type = post.photo.type;
            const upload = {
              id: id,
              postPhoto: imageurl,
              type: type,
              postDescription: post.description || " ",
              postLocation: post.location || " ",
              uid: user.uid,
              photo: user.photo || " ",
              preview: preview || "",
              username: user.username,
              likes: [],
              comments: [],
              reports: [],
              views: 0,
              viewers: [],
              date: new Date().getTime(),
            };

            db.collection("posts").doc(id).set(upload);
            dispatch({ type: "NEW_POST_ADDED", payload: upload });
            dispatch(addPostToFollowersTimeline(upload));

            dispatch(updateFileUploadProgress(101));
            // setInterval(() => {
            dispatch(updateFileUploadProgress(-1));
            // }, 1500);
            dispatch(updatePhoto());
            dispatch(updateDescription());
            dispatch(updateLocation());
            // var feeds = getState().post.feed;

            // alert(feeds.length);
            // var updatedFeeds = [...feeds, upload];
            // alert(updatedFeeds.length);

            // dispatch({ type: "GET_POSTS", payload: [...updatedFeeds]});

            // dispatch(getPosts());
            // dispatch(getUser(user.uid, "LOGIN"));

            showMessage({
              message: "Post Uploaded",
              description: "Post Uploaded Successfully",
              type: "success",
              duration: 4000,
            });
            cleanExtractedImagesCache();
          } else {
            alert("Image Upload Error");
          }
        });
      });
    } catch (e) {
      alert("Upload Error: " + e);

      /* console.error(e) */
    }
  };
};

export const getPostById = (postId) => {
  return async (dispatch, getState) => {
    try {
      let posts = [];

      db.collection("posts")
        .where("id", "==", postId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
            posts.push(documentSnapshot.data());
          });
          if (posts.length > 0) {
            dispatch({ type: "NEW_POST_ADDED", payload: posts[0] });
          }
        })
        .catch((error) => {
          alert(error);
        });
    } catch (e) {
      alert(e);

      /* console.error(e) */
    }
  };
};
export const uploadPostVideo = () => {
  return async (dispatch, getState) => {
    try {
      showMessage({
        message: "Started Post Uploading, Please wait...",
        type: "info",
        duration: 2000,
      });

      const { post, user } = getState();

      // dispatch(uploadPhoto({}, post.videocover)).then((videoCoverUrl) => {
      // alert(videoCoverUrl);
      dispatch(uploadPhoto(post.photo)).then((imageurl) => {
        if (imageurl) {
          const id = uuid.v4();
          const type = post.photo.type;
          const upload = {
            id: id,
            postPhoto: imageurl,
            type: type,
            // videocover: videoCoverUrl,
            postDescription: post.description || " ",
            postLocation: post.location || " ",
            uid: user.uid,
            photo: user.photo || " ",
            preview: post.preview || "",
            username: user.username,
            likes: [],
            comments: [],
            reports: [],
            views: 0,
            viewers: [],
            date: new Date().getTime(),
          };

          dispatch({ type: "NEW_POST_ADDED", payload: upload });

          // var posts = post.feed;
          // alert(JSON.stringify(posts.length));
          // var mergedposts = [...posts, upload];
          // alert(JSON.stringify(mergedposts.length));

          db.collection("posts").doc(id).set(upload);
          dispatch(addPostToFollowersTimeline(upload));

          dispatch(updateFileUploadProgress(-1));
          dispatch(updatePhoto());
          dispatch(updateDescription());
          dispatch(updateLocation());

          //  dispatch(getPosts());
          // dispatch({ type: "SHOW_LOADING", payload: true });

          //   dispatch(getUser(user.uid, "LOGIN"));

          showMessage({
            message: "Post Uploaded",
            description: "Post Uploaded Successfully",
            type: "success",
            duration: 4000,
          });
          cleanExtractedImagesCache();
        } else {
          alert("Image Upload Error");
        }

        //  Toast.showSuccess("Post Uploaded Successfully");
      });
      // });
    } catch (e) {
      alert("Upload Error: " + e);

      /* console.error(e) */
    }
  };
};

export const getPosts = () => {
  return async (dispatch, getState) => {
    // alert(limit);
    try {
      dispatch({ type: "SHOW_LOADING", payload: true });

      db.collection("posts")
        .orderBy("date", "desc")
        .limit(18)
        .get()
        .then((querySnapshot) => {
          var images = [];

          let array = [];
          // let lastVisible = null;
          // var lastVisible = posts.docs[posts.docs.length - 1];
          var lastVisible = null;
          // Get the last visible document
          if (querySnapshot && querySnapshot.size > 0) {
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          }

          querySnapshot.forEach((post) => {
            var item = post.data();
            if (!isUserBlocked(getState().user, item.uid)) {
              // lastVisible = post.id;
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
            }
          });

          if (images.length > 0) {
            preloadImages(images);
          }
          //  dispatch({ type: "GET_POSTS", payload: orderBy(array, "date", "desc") });
          dispatch({ type: "GET_POSTS", payload: array });
          dispatch({ type: "LAST_VISIBLE", payload: lastVisible });
        })
        .catch((error) => {
          let array = [];
          dispatch({ type: "GET_POSTS", payload: array });
        });
    } catch (e) {
      let array = [];
      dispatch({ type: "GET_POSTS", payload: array });
      // alert(e);
    }
  };
};

export const newPostsListner = () => {
  let initialState = true;
  return async (dispatch, getState) => {
    if (unsubscribe) {
      // Stop listening to changes if already listening
      unsubscribe();
    }
    try {
      unsubscribe = db
        .collection("posts")
        .orderBy("date", "desc")
        .limit(1)
        .onSnapshot(function (snapshot) {
          var feeds = getState().post.feed;
          snapshot.docChanges().forEach(function (change) {
            // alert(change.type);
            if (change.type === "added") {
              var item = change.doc.data();
              var index = feeds.findIndex((x) => x.id === item.id);

              if (index < 0) {
                var olderPosts = getState().post.newPosts
                  ? getState().post.newPosts
                  : [];
                if (!initialState) {
                  if (!isUserBlocked(getState().user, item.uid)) {
                    var images = [];

                    // alert("listener Called------" + snapshot.docs.length);
                    let array = [];
                    array.push(item);
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
                    if (images.length > 0) {
                      preloadImages(images);
                    }

                    if (array.length > 0) {
                      // alert("listener Called------" + array.length);
                      var mergedArray = olderPosts.concat(array);
                      // alert(mergedArray.length);
                      var uniquePosts = _.uniqBy(mergedArray, "id");

                      // alert(JSON.stringify(array));
                      dispatch({ type: "NEW_POSTS", payload: uniquePosts });
                      // if (getState().user && getState().user.uid) {
                      //   var nyPosts = uniquePosts.filter(
                      //     (x) => x.uid === getState().user.uid
                      //   );

                      //   if (nyPosts && nyPosts.length > 0) {
                      //     dispatch(mergeNewPosts());
                      //   }
                      // }
                    }
                  }
                }
              }
            }
            if (change.type === "modified") {
              // console.log("Modified : ", change.doc.data());
            }
            if (change.type === "removed") {
              // console.log("Removed : ", change.doc.data());
            }
          });
          initialState = false;
        });
    } catch (e) {
      // alert(e);
    }
  };
};

// export const getFollowingPosts = () => {
//   return async (dispatch, getState) => {
//     const { followingfeed, feed } = getState().post;
//     var lastFetchedPostDate;

//     if (followingfeed && followingfeed.length > 0) {
//       lastFetchedPostDate = followingfeed[followingfeed.length - 1].date;
//     }
//     try {
//       if ((getState().user, getState().user.following)) {
//         const posts = await db
//           .collection("posts")
//           .where("uid", "in", getState().user.following.slice(0, 10))
//           .limit(50)
//           .get();

//         var images = [];
//         let array = [];
//         var lastVisibleId = null;

//         posts.forEach((post) => {
//           var item = post.data();
//           if (!isUserBlocked(getState().user, item.uid)) {
//             // lastVisibleId = post.id;
//             array.push(post.data());
//             if (item.photo && item.photo.length > 15) {
//               const normalisedSource =
//                 item.photo &&
//                 typeof item.photo === "string" &&
//                 !item.photo.split("https://")[1]
//                   ? null
//                   : item.photo;
//               if (normalisedSource) {
//                 images.push({
//                   uri: item.photo,
//                 });
//               }
//             }
//             if (item.type == "image") {
//               if (item.postPhoto && item.postPhoto.length > 15) {
//                 images.push({
//                   uri: item.postPhoto,
//                 });
//               }
//             }
//           }
//         });
//         if (images.length > 0) {
//           // alert(JSON.stringify(images));
//           // dispatch(preloadImages(images));
//           preloadImages(images);
//         }

//         dispatch({
//           type: "FOLLOWING_POSTS",
//           payload: orderBy(array, "date", "desc"),
//         });
//       }
//     } catch (e) {
//       //  alert(e);
//     }
//   };
// };

export const getFollowingPosts = (flow = null) => {
  return async (dispatch, getState) => {
    const { followingfeed, feed } = getState().post;

    var oldPosts;

    if (followingfeed) {
      oldPosts = followingfeed;
    } else {
      oldPosts = [];
    }
    var lastFetchedPostDate;

    // alert(followingfeed);
    if (followingfeed && followingfeed.length > 0) {
      lastFetchedPostDate = followingfeed[followingfeed.length - 1].date;
    }
    if (flow === "REFRESH") {
      lastFetchedPostDate = null;
    }
    try {
      if ((getState().user, getState().user.following)) {
        var timelinePosts;
        if (lastFetchedPostDate) {
          // alert(lastFetchedPostDate);
          timelinePosts = await db
            .collection("timeline")
            .doc(getState().user.uid)
            .collection("posts")
            .orderBy("createdAt", "desc")
            .startAfter(lastFetchedPostDate)
            .limit(10)
            .get();
        } else {
          timelinePosts = await db
            .collection("timeline")
            .doc(getState().user.uid)
            .collection("posts")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();
        }

        // alert(timelinePosts.size);
        let myPosts = [];
        timelinePosts.forEach((j) => {
          myPosts.push(j.data().postId);
        });

        // let myPosts = timelinePosts.reduce((i, j) => {
        //   i.push(j.data().postId);
        //   return i;
        // }, []);

        if (myPosts && myPosts.length > 0) {
          const posts = await db
            .collection("posts")
            .where("id", "in", myPosts)
            .get();
          var images = [];
          let array = [];
          var lastVisibleId = null;

          posts.forEach((post) => {
            var item = post.data();
            if (!isUserBlocked(getState().user, item.uid)) {
              // lastVisibleId = post.id;
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
            }
          });
          if (images.length > 0) {
            // alert(JSON.stringify(images));
            // dispatch(preloadImages(images));
            preloadImages(images);
          }
          if (array.length > 0) {
            var mergedArray = oldPosts.concat(array);
            // alert(mergedArray.length);
            var uniquePosts = _.uniqBy(mergedArray, "id");

            dispatch({
              type: "FOLLOWING_POSTS",
              payload: orderBy(uniquePosts, "date", "desc"),
            });
          }
        }
      }
    } catch (e) {
      alert(e);
    }
  };
};

export const getMorePosts = () => {
  return async (dispatch, getState) => {
    const { lastVisible, feed } = getState().post;
    var lastFetchedPostDate;

    if (feed && feed.length > 0) {
      lastFetchedPostDate = feed[feed.length - 1].date;
    }
    try {
      dispatch({ type: "SHOW_LOADING", payload: true });
      var posts;
      if (lastVisible) {
        // alert(lastFetchedPostDate);
        posts = await db
          .collection("posts")
          .orderBy("date", "desc")
          .startAfter(lastFetchedPostDate)
          .limit(15)
          .get();
      } else {
        posts = await db
          .collection("posts")
          .orderBy("date", "desc")
          .limit(15)
          .get();
      }
      var images = [];
      let array = [];
      var lastVisibleId = null;
      // Get the last visible document
      if (posts && posts.size > 0) {
        lastVisibleId = posts.docs[posts.docs.length - 1];
      }

      posts.forEach((post) => {
        var item = post.data();
        if (!isUserBlocked(getState().user, item.uid)) {
          // lastVisibleId = post.id;
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
        }
      });
      if (images.length > 0) {
        // alert(JSON.stringify(images));
        // dispatch(preloadImages(images));
        preloadImages(images);
      }
      // alert(JSON.stringify(array.length));
      if (array.length > 0) {
        var mergedArray = feed.concat(array);
        // alert(mergedArray.length);
        var uniquePosts = _.uniqBy(mergedArray, "id");
        // alert(uniquePosts.length);

        //  dispatch({ type: "GET_POSTS", payload: orderBy(array, "date", "desc") });
        dispatch({ type: "GET_POSTS", payload: uniquePosts });
        dispatch({ type: "LAST_VISIBLE", payload: lastVisibleId });
      }
    } catch (e) {
      alert(e);
      let array = [];
      //  dispatch({ type: "GET_POSTS", payload: array });
      // alert(e);
    }
  };
};

export const getUserPosts = (
  uid,
  cb = (result, error) => {},
  lastFetchedPostDate = null
) => {
  return async (dispatch, getState) => {
    try {
      var postQuery;
      if (lastFetchedPostDate) {
        postQuery = await db
          .collection("posts")
          .where("uid", "==", uid)
          .orderBy("date", "desc")
          .startAfter(lastFetchedPostDate)
          .limit(10)
          .get();
      } else {
        postQuery = await db
          .collection("posts")
          .where("uid", "==", uid)
          .orderBy("date", "desc")
          .limit(10)
          .get();
      }
      var images = [];
      var posts = [];

      postQuery.forEach(function (response) {
        posts.push(response.data());
      });
      if (images.length > 0) {
        preloadImages(images);
      }
      if (posts) {
        if (
          getState().user &&
          getState().user.uid &&
          getState().user.uid === uid
        ) {
          if (getState().user) {
            const user = cloneDeep(getState().user);

            let oldPosts = [];
            if (user.posts) {
              oldPosts = user.posts;
            }
            var mergedArray = oldPosts.concat(posts);
            var uniquePosts = _.uniqBy(mergedArray, "id");
            user.posts = uniquePosts;
            dispatch({ type: "LOGIN", payload: user });
          }
        } else {
        }
      }

      // resolve(posts);
      cb(posts, null);
    } catch (e) {
      // alert(e);
      // reject(e);
      cb(null, e);
      let array = [];
    }
  };
};

export const filterBlockedPosts = () => {
  return async (dispatch, getState) => {
    // alert(limit);
    const { lastVisible, feed } = getState().post;

    // alert(feed.length);
    try {
      let array = [];
      if (feed) {
        feed.forEach((post) => {
          var item = post;
          if (!isUserBlocked(getState().user, item.uid)) {
            array.push(item);
          }
        });

        dispatch({ type: "GET_POSTS", payload: [...array] });
      }
    } catch (e) {}
  };
};

export const filterFollowingPosts = () => {
  return async (dispatch, getState) => {
    // alert(limit);
    // const { lastVisible, feed } = getState().post;
    // // alert(feed.length);
    // try {
    //   let array = [];
    //   if (feed) {
    //     feed.forEach((post) => {
    //       var item = post;
    //       if (isFollowing(getState().user, item.uid)) {
    //         array.push(item);
    //       }
    //     });
    //     dispatch({ type: "FOLLOWING_POSTS", payload: [...array] });
    //   }
    // } catch (e) {}
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
export const getPostReports = (post) => {
  return async (dispatch, getState) => {
    try {
      const reports = await db
        .collection("reports")
        .where("postId", "==", post.id)
        .get();

      let array = [];
      reports.forEach((post) => {
        array.push(post.data());
      });
      //  dispatch({ type: "GET_POSTS", payload: orderBy(array, "date", "desc") });
      dispatch({ type: "POST_REPORTS", payload: array });
    } catch (e) {
      let array = [];
      dispatch({ type: "POST_REPORTS", payload: array });
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

export const addUserPostToTimeline = (uid) => {
  return async (dispatch, getState) => {
    try {
      const posts = await db.collection("posts").where("uid", "==", uid).get();

      posts.forEach((post) => {
        var item = post.data();

        const upload = {
          postId: item.id,
          createdAt: item.date,
          uid: item.uid,
        };

        db.collection("timeline")
          .doc(getState().user.uid)
          .collection("posts")
          .add(upload);
      });
    } catch (e) {
      //  alert(e);
    }
  };
};

export const feedTimelineForAllUsers = () => {
  return async (dispatch, getState) => {
    try {
      const users = await db.collection("users").get();

      // alert(users.size);
      users.forEach((user) => {
        var data = user.data();

        if (data && data.following && data.following.length > 0) {
          data.following.forEach(async (uid) => {
            const posts = await db
              .collection("posts")
              .where("uid", "==", uid)
              .get();

            posts.forEach((post) => {
              var item = post.data();

              const upload = {
                postId: item.id,
                createdAt: item.date,
                uid: item.uid,
              };

              db.collection("timeline")
                .doc(data.uid)
                .collection("posts")
                .add(upload);
            });
          });
        }
      });
    } catch (e) {
      alert(e);
    }
  };
};

export const removeUserPostFromTimeline = (uid) => {
  return async (dispatch, getState) => {
    try {
      db.collection("timeline")
        .doc(getState().user.uid)
        .collection("posts")
        .where("uid", "==", uid)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
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
      dispatch(deletePostFromUserTimeline(item));
    } catch (e) {
      alert(e);
    }
  };
};

export const deletePostFromUserTimeline = (item) => {
  return async (dispatch, getState) => {
    const postId = item.id;
    const uid = item.uid;
    try {
      const userQuery = await db.collection("users").doc(uid).get();
      let user = userQuery.data();

      if (user && user.followers && user.followers.length > 0) {
        user.followers.forEach((uid) => {
          db.collection("timeline")
            .doc(uid)
            .collection("posts")
            .where("postId", "==", postId)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.delete();
              });
            });
        });
      }
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
          likes: firestore.FieldValue.arrayUnion(uid),
        });
      dispatch({ type: "GET_POSTS", payload: newFeed });

      if (getState().user && getState().user.posts) {
        const user = cloneDeep(getState().user);
        let updatedPosts = user.posts.map((item) => {
          if (item.id === post.id) {
            item.likes.push(uid);
          }

          return item;
        });
        user.posts = updatedPosts;
        dispatch({ type: "LOGIN", payload: user });
      }

      if (getState().profile && getState().profile.posts) {
        const user = cloneDeep(getState().profile);
        let updatedPosts = user.posts.map((item) => {
          if (item.id === post.id) {
            item.likes.push(uid);
          }

          return item;
        });
        user.posts = updatedPosts;
        dispatch({ type: "GET_PROFILE", payload: user });
      }
      if (getState().post && getState().post.followingfeed) {
        const feeds = cloneDeep(getState().post.followingfeed);
        let updatedPosts = feeds.map((item) => {
          if (item.id === post.id) {
            item.likes.push(uid);
          }

          return item;
        });

        dispatch({
          type: "FOLLOWING_POSTS",
          payload: orderBy(updatedPosts, "date", "desc"),
        });
      }

      db.collection("activity").doc().set({
        postId: post.id,
        postPhoto: post.preview,
        likerId: uid,
        postType: post.type,
        likerPhoto: photo,
        likerName: username,
        uid: post.uid,
        date: new Date().getTime(),
        type: "LIKE",
      });

      var message = username + " Liked Your Photo";

      if (post.type == "video") {
        message = username + " Liked Your Video";
      }
      // dispatch(sendNotification(post.uid, message));

      dispatch(sendNotification(post.uid, "New Like", message, "LIKE"));

      // dispatch(getPosts());
      // dispatch(getUser(response.user.uid));
    } catch (e) {
      /* alert(e) */
    }
  };
};

export const logVideoView = (post, routeName = "") => {
  return (dispatch, getState) => {
    var { uid, username, photo } = getState().user;
    if (uid === undefined) {
      uid = "NA";
    }
    try {
      if (uid !== "NA") {
        if (routeName === "Channels") {
          const channelPosts = cloneDeep(getState().channels.feed);

          var viewers = [];
          let updatedPosts = channelPosts.map((item) => {
            if (item.id === post.id) {
              if (item.viewers == null) {
                item.viewers = [];
              }
              item.viewers.push(uid);
              viewers = item.viewers;
            }
            return item;
          });

          db.collection("channelposts").doc(post.id).update({
            viewers: viewers,
          });

          dispatch({ type: CHANNELPOSTS_SUCCESS, payload: updatedPosts });
        }

        const home = cloneDeep(getState().post.feed);

        var viewers = [];
        let newFeed = home.map((item) => {
          if (item.id === post.id) {
            if (item.viewers == null) {
              item.viewers = [];
            }
            item.viewers.push(uid);
            viewers = item.viewers;
          }
          return item;
        });

        if (getState().user && getState().user.posts) {
          const user = cloneDeep(getState().user);
          let updatedPosts = user.posts.map((item) => {
            if (item.id === post.id) {
              if (item.viewers == null) {
                item.viewers = [];
              }
              item.viewers.push(uid);
              viewers = item.viewers;
            }

            return item;
          });
          user.posts = updatedPosts;
          dispatch({ type: "LOGIN", payload: user });
        }

        if (getState().profile && getState().profile.posts) {
          const user = cloneDeep(getState().profile);
          let updatedPosts = user.posts.map((item) => {
            if (item.id === post.id) {
              if (item.viewers == null) {
                item.viewers = [];
              }
              item.viewers.push(uid);
              viewers = item.viewers;
            }

            return item;
          });
          user.posts = updatedPosts;
          dispatch({ type: "GET_PROFILE", payload: user });
        }
        if (getState().post && getState().post.followingfeed) {
          const feeds = cloneDeep(getState().post.followingfeed);
          let updatedPosts = feeds.map((item) => {
            if (item.id === post.id) {
              if (item.viewers == null) {
                item.viewers = [];
              }
              item.viewers.push(uid);
              viewers = item.viewers;
            }

            return item;
          });

          dispatch({
            type: "FOLLOWING_POSTS",
            payload: orderBy(updatedPosts, "date", "desc"),
          });
        }

        // db.collection("posts")
        //   .doc(post.id)
        //   .update({
        //     views: firebase.firestore.FieldValue.increment(1),
        //   });
        // alert(JSON.stringify(viewers));
        db.collection("posts").doc(post.id).update({
          viewers: viewers,
        });

        dispatch({ type: "GET_POSTS", payload: newFeed });
        // dispatch(getPosts());
        // dispatch(getUser(response.user.uid));
      }
    } catch (e) {
      /* alert(e) */
    }
  };
};

export const unlikePost = (post) => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    try {
      const home = cloneDeep(getState().post.feed);
      let newFeed = home.map((item) => {
        if (item.id === post.id) {
          // alert(item.likes.length);
          // item.likes.remove(uid);
          // alert(item.likes.length);
          var filteredAry = item.likes.filter((e) => e !== uid);
          item.likes = filteredAry;
        }
        return item;
      });
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: firestore.FieldValue.arrayRemove(uid),
        });
      dispatch({ type: "GET_POSTS", payload: newFeed });

      if (getState().user && getState().user.posts) {
        const user = cloneDeep(getState().user);

        let updatedPosts = user.posts.map((item) => {
          if (item.id === post.id) {
            var filteredAry = item.likes.filter((e) => e !== uid);
            item.likes = filteredAry;
          }
          return item;
        });
        user.posts = updatedPosts;
        dispatch({ type: "LOGIN", payload: user });
      }

      if (getState().profile && getState().profile.posts) {
        const user = cloneDeep(getState().profile);
        let updatedPosts = user.posts.map((item) => {
          if (item.id === post.id) {
            var filteredAry = item.likes.filter((e) => e !== uid);
            item.likes = filteredAry;
          }
          return item;
        });
        user.posts = updatedPosts;
        dispatch({ type: "GET_PROFILE", payload: user });
      }

      if (getState().post && getState().post.followingfeed) {
        const feeds = cloneDeep(getState().post.followingfeed);

        let updatedPosts = feeds.map((item) => {
          if (item.id === post.id) {
            var filteredAry = item.likes.filter((e) => e !== uid);
            item.likes = filteredAry;
          }
          return item;
        });

        dispatch({
          type: "FOLLOWING_POSTS",
          payload: orderBy(updatedPosts, "date", "desc"),
        });
      }

      const query = await db
        .collection("activity")
        .where("postId", "==", post.id)
        .where("likerId", "==", uid)
        .get();
      query.forEach((response) => {
        response.ref.delete();
      });
      //dispatch(getPosts());
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
    // alert("Called");
    // dispatch(feedTimelineForAllUsers());

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
          comments: firestore.FieldValue.arrayUnion(comment),
        });
      comment.postId = post.id;
      comment.postPhoto = post.preview;
      comment.uid = post.uid;
      comment.type = "COMMENT";
      comments.push(comment);

      post.comments = comments;

      dispatch({ type: "GET_COMMENTS", payload: comments.reverse() });
      dispatch({ type: "UPDATE_POST", payload: post });

      db.collection("activity").doc().set(comment);

      var body = `${username} commented on your post`;

      // dispatch(sendNotification(post.uid, text));

      dispatch(sendNotification(post.uid, "New Comment", body, "COMMENT"));
    } catch (e) {
      /* console.error(e) */
    }
  };
};

export const reportPost = (post, reason) => {
  return async (dispatch, getState) => {
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
          reports: firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("users")
        .doc(post.uid)
        .update({
          reports: firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("reports").doc().set({
        postId: post.id,
        postPhoto: post.postPhoto,
        reporterId: uid,
        postType: post.type,
        postCreated: post.date,
        reportReason: reason,
        reporterPhoto: photo,
        reporterName: username,
        postDescription: post.postDescription,
        uid: post.uid,
        date: new Date().getTime(),
        type: "REPORT",
      });
      dispatch({ type: "GET_POSTS", payload: newFeed });
      // dispatch(getPosts());

      const query = await db
        .collection("users")
        .where("isSuperAdmin", "==", true)
        .get();

      query.forEach((response) => {
        if (response.data().uid) {
          db.collection("activity").doc().set({
            postId: post.id,
            postPhoto: post.preview,
            reporterId: uid,
            reportReason: reason,
            reporterPhoto: photo,
            reporterName: username,
            uid: response.data().uid,
            date: new Date().getTime(),
            type: "REPORT",
          });
          // dispatch(sendNotification(response.data().uid, "Reported Post"));
        }
      });

      // dispatch(getUser(response.user.uid));
    } catch (e) {
      /* alert(e) */
    }
  };
};
