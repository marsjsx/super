import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  Image,
  Easing,
} from "react-native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import constants from "../constants";
import Scale, { moderateScale } from "../helpers/Scale";

// export function FindFriends() {
const CompactLoader = (props) => {
  return (
    <View style={{ marginVertical: Scale.moderateScale(32) }}>
      <Text
        style={{
          color: "rgb(215, 80, 80)",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {props.message}
      </Text>
    </View>
  );
};
export default connect()(CompactLoader);
