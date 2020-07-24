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
