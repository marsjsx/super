import firebase from "firebase";
import db from "../config/firebase";
import uuid from "uuid";
import cloneDeep from "lodash/cloneDeep";
import orderBy from "lodash/orderBy";

import _ from "lodash";

// import Toast from 'react-native-tiny-toast'
import { showMessage, hideMessage } from "react-native-flash-message";
import { isUserBlocked, isFollowing } from "../util/Helper";

export const getActivities = () => {
  return async (dispatch, getState) => {
    // alert(limit);
    try {
      const { user } = getState();

      dispatch({ type: "SHOW_ACTIVITIES_LOADING", payload: true });

      const activities = await db
        .collection("activity")
        .where("uid", "==", user.uid)
        .orderBy("date", "desc")
        .get();
      var images = [];

      let array = [];
      // let lastVisible = null;
      // var lastVisible = posts.docs[posts.docs.length - 1];
      var lastVisible = null;
      // Get the last visible document
      if (activities && activities.size > 0) {
        lastVisible = activities.docs[activities.docs.length - 1];
      }
      activities.forEach((activity) => {
        var item = activity.data();
        array.push(item.data());
      });

      dispatch({ type: "GET_ACTIVITIES", payload: array });
      dispatch({ type: "LAST_VISIBLE", payload: lastVisible });
    } catch (e) {
      let array = [];
      dispatch({ type: "GET_ACTIVITIES", payload: array });
      // alert(e);
    }
  };
};

export const getMoreActivities = () => {
  return async (dispatch, getState) => {
    const { lastVisible, activities } = getState().activity;
    const { user } = getState();

    // alert("Called1");
    try {
      if (user && user.uid) {
        dispatch({ type: "SHOW_ACTIVITIES_LOADING", payload: true });
        var myActivities;
        if (lastVisible) {
          // alert(JSON.stringify(lastVisible));
          myActivities = await db
            .collection("activity")
            .where("uid", "==", user.uid)
            .orderBy("date", "desc")
            .startAfter(lastVisible)
            .limit(15)
            .get();
        } else {
          myActivities = await db
            .collection("activity")
            .where("uid", "==", user.uid)
            .orderBy("date", "desc")
            .limit(15)
            .get();
        }
        var images = [];
        let array = [];
        var lastVisibleId = null;
        // Get the last visible document
        if (myActivities && myActivities.size > 0) {
          lastVisibleId = myActivities.docs[myActivities.docs.length - 1];
        }

        myActivities.forEach((activity) => {
          var item = activity.data();
          // alert(JSON.stringify(item));
          array.push(item);
        });
        if (array.length > 0) {
          // alert(myActivities.size);

          var mergedArray = activities.concat(array);
          dispatch({ type: "GET_ACTIVITIES", payload: mergedArray });
          dispatch({ type: "LAST_VISIBLE", payload: lastVisibleId });
        }
      }
    } catch (e) {
      //   alert(e);

      console.log(e);

      let array = [];
    }
  };
};
