import React from "react";
import * as ImageManipulator from "expo-image-manipulator";

export const buildPreview = (imageUri, width, height) => {
  return ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: width, height: height } }],
    { format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );
};
