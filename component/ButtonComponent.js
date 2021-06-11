import React from "react";
import {
  Text,
  StyleSheet,
  ViewPropTypes,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import constants from "../constants";
import Scale from "../helpers/Scale";

const ButtonComponent = (props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.containerStyle]}
      onPress={props.onPress}
    >
      <LinearGradient
        colors={props.colors || []}
        start={Platform.OS === "ios" ? { x: 1, y: 0 } : { x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        locations={props.locations}
        style={[styles.linearGradient, props.linearGradientStyle]}
      >
        {props.loading ? (
          <ActivityIndicator color={constants.colors.white} />
        ) : (
          <>
            {props.icon ? (
              <Icon
                name={props.icon}
                color={props.iconColor}
                size={20}
                style={styles.iconStyle}
              />
            ) : null}
            {props.iconComponent}
            <Text
              style={[
                styles.textStyle,
                {
                  color: props.color,
                },
                props.textStyle,
              ]}
            >
              {props.title}
            </Text>
            {props.rightComponent}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    height: Scale.moderateScale(50),
    paddingHorizontal: Scale.moderateScale(10),
    marginHorizontal: Scale.moderateScale(8),
    borderRadius: Scale.moderateScale(1),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: Scale.moderateScale(5),
  },
  container: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { height: 2, width: 1 },
    shadowRadius: Scale.moderateScale(2),
    marginVertical: Scale.moderateScale(5),
    // marginHorizontal: Scale.moderateScale(8),
  },
  textStyle: {
    fontWeight: "400",
    // marginVertical: Scale.moderateScale(5),
    fontSize: Scale.moderateScale(20),
    ...constants.fonts.OswaldSemiBold,
  },
  iconStyle: {
    marginHorizontal: Scale.moderateScale(10),
  },
});

ButtonComponent.propTypes = {
  title: PropTypes.string,
  onPress: () => {},
  color: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  disabled: PropTypes.bool,
  colors: PropTypes.array,
  locations: PropTypes.array,
  containerStyle: ViewPropTypes.style,
  linearGradientStyle: ViewPropTypes.style,
  loading: PropTypes.bool,
};

ButtonComponent.defaultProps = {
  colors: constants.colors.gradients,
  locations: [0, 0.8],
  color: "#fff",
  loading: false,
};
export default ButtonComponent;
