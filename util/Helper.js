import React from "react";

import { Alert } from "react-native";
import { openSettings } from "react-native-permissions";

export const validURL = (str) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

export const convertDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const isUserBlocked = (loggedinUser, userId) => {
  // alert(JSON.stringify(loggedinUser.blocked));
  if (!loggedinUser) {
    // alert("User is not logged in ");
    return false;
  }
  if (loggedinUser.blocked) {
    if (loggedinUser.blocked.includes(userId)) {
      return true;
    }
  }

  if (loggedinUser.blockedBy) {
    if (loggedinUser.blockedBy.includes(userId)) {
      return true;
    }
  }
  return false;
};

export const isFollowing = (loggedinUser, userId) => {
  // alert(JSON.stringify(loggedinUser.blocked));
  if (!loggedinUser) {
    // alert("User is not logged in ");
    return false;
  }
  if (loggedinUser.following) {
    if (loggedinUser.following.includes(userId)) {
      return true;
    }
  }
  return false;
};

export const openSettingsDialog = (message, navigation) => {
  Alert.alert("Tips", message, [
    {
      text: "Cancel",
      onPress: () => navigation.goBack(),
      style: "cancel",
    },
    {
      text: "Open Settings",
      onPress: () => openSettings().catch(() => alert("cannot open settings")),
    },
  ]);
};
