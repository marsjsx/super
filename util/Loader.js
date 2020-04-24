// import Toast from "react-native-tiny-toast";
import React from "react";
import Loader from "../component/Loader";

export const showLoader = message => {
  return <Loader message={message} />;
};


export const hideLoader = toast => {
  return Toast.hide(toast);
};
