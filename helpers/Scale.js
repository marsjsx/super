"use strict";

import {Dimensions, Platform} from "react-native";
const {width, height} = Dimensions.get("window");
// console.log("height & width ===>os", height, width, Platform.OS);

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => {
  if (Platform.OS === "web") {
    factor = 0.1;
  }
  return size + (scale(size) - size) * factor;
};

export default {scale, verticalScale, moderateScale};