import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";
import constants from "../constants";
import Scale from "../helpers/Scale";

// eslint-disable-next-line react/display-name
const TextInputComponent = forwardRef((props, ref) => {
  return (
    <View style={[styles.container, props.container]}>
      {props.title ? (
        <Text style={[styles.styleSelectedText, props.titleStyle]}>
          {props.title}
        </Text>
      ) : null}
      <View style={[styles.textContainer, props.textContainer]}>
        <TextInput
          ref={ref}
          autoCapitalize={props.autoCapitalize}
          autoCorrect={props.autoCorrect}
          autoFocus={props.autoFocus}
          editable={props.editable}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          multiline={props.multiline}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onChangeText={props.onChangeText}
          blurOnSubmit={props.blurOnSubmit}
          onContentSizeChange={props.onContentSizeChange}
          onEndEditing={props.onEndEditing}
          onFocus={props.onFocus}
          onSelectionChange={props.onSelectionChange}
          onSubmitEditing={props.onSubmitEditing}
          onScroll={props.onScroll}
          onKeyPress={props.onKeyPress}
          placeholder={props.placeholder}
          placeholderTextColor={constants.colors.warmGrey}
          returnKeyType={props.returnKeyType}
          secureTextEntry={props.secureTextEntry}
          style={[styles.inputStyle, props.style]}
          value={props.value}
          textAlignVertical={"top"}
          numberOfLines={props.numberOfLines}
        />
        {props.isValid ? (
          <Icon
            name="check"
            size={15}
            color={constants.colors.primary}
            // style={{marginRight: Scale.moderateScale(10)}}
          />
        ) : null}
        {props.cancel ? (
          <Icon
            name="remove"
            size={20}
            color={constants.colors.primary}
            onPress={props.cancelPress}
            style={{ marginRight: Scale.moderateScale(10) }}
          />
        ) : null}
      </View>
      {props.suggestions ? (
        <Text style={[styles.suggestions]}>{props.suggestions}</Text>
      ) : null}
      {props.mandatory ? (
        <Text
          style={{
            position: "absolute",
            right: 11,
            top: 5,
            color: constants.colors.red,
          }}
        >
          *
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: Scale.moderateScale(5),
  },
  textContainer: {
    paddingHorizontal: Scale.moderateScale(5),
    padding: Scale.moderateScale(10),
    backgroundColor: constants.colors.white,
    borderRadius: Scale.moderateScale(5),
    // height: Scale.moderateScale(40),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: Scale.moderateScale(10),
  },
  titleStyle: {
    color: constants.colors.lightSecondary,
    fontSize: Scale.moderateScale(14),
    lineHeight: Scale.moderateScale(20),
    ...constants.fonts.PoppinsRegular,
  },
  styleSelectedText: {
    fontSize: Scale.moderateScale(12),
    padding: Scale.moderateScale(5),
    color: constants.colors.primary,
    marginTop: Scale.moderateScale(5),
  },
  inputStyle: {
    ...constants.fonts.PoppinsRegular,
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: Scale.moderateScale(12),
    width: "95%",
    color: "#000",
  },
  suggestions: {
    ...constants.fonts.PoppinsRegular,
    fontSize: Scale.moderateScale(9),
    paddingTop: Scale.moderateScale(8),
    color: constants.colors.warmGrey,
  },
});

TextInputComponent.propTypes = {
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  autoCorrect: PropTypes.bool,
  autoFocus: PropTypes.bool,
  editable: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    "default",
    "email-address",
    "numeric",
    "phone-pad",
    "number-pad",
    "decimal-pad",
    "ascii-capable",
    "numbers-and-punctuation",
    "url",
    "name-phone-pad",
    "twitter",
    "web-search",
    "visible-password",
  ]),
  maxLength: PropTypes.number,
  numberOfLines: PropTypes.number,
  multiline: PropTypes.bool,
  onBlur: () => {},
  onChange: () => {},
  onChangeText: () => {},
  onContentSizeChange: () => {},
  onEndEditing: () => {},
  onFocus: () => {},
  onSelectionChange: () => {},
  onSubmitEditing: () => {},
  onScroll: () => {},
  onKeyPress: () => {},
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  returnKeyType: PropTypes.oneOf([
    "default",
    "go",
    "google",
    "join",
    "next",
    "route",
    "search",
    "send",
    "yahoo",
    "done",
    "emergency-call",
  ]),
  secureTextEntry: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  cancel: PropTypes.bool.isRequired,
};

TextInputComponent.defaultProps = {
  placeholderTextColor: constants.colors.grey,
  style: {},
  isValid: false,
  cancel: false,
};
export default TextInputComponent;
