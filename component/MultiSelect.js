import React, { useState, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SelectMultiple from "./MultiSelectPackage/SelectMultiple";
import Icon from "react-native-vector-icons/FontAwesome";
import constants from "../constants";
import Scale from "../helpers/Scale";

const MultiSelect = (props) => {
  const [show, setShow] = useState(false);
  const onCaretPress = useCallback(() => {
    setShow(!show);
  }, [show]);

  const onSelectionsChange = useCallback((data) => {
    console.log("data=========", data);
    props.onSelectionsChange(data);
  }, []);

  const getSelectedItems = () => {
    return (
      props.value &&
      props.value
        .reduce((i, j) => {
          console.log("j=====>", j);
          // alert(JSON.stringify(j));
          i.push(j.value);
          return i;
        }, [])
        .join()
    );
  };

  return (
    <>
      {props.heading ? (
        <Text
          style={{
            color: constants.colors.white,
            marginLeft: 5,
            marginTop: 15,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {props.heading}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[styles.container, props.styles]}
        onPress={onCaretPress}
      >
        <Text
          numberOfLines={1}
          style={[styles.styleSelectedText, props.styleTextDropdown]}
        >
          {getSelectedItems() || props.title}
        </Text>
        <View
          style={{ flexDirection: "column", justifyContent: "space-around" }}
        >
          {props.mandatory ? (
            <Text style={{ color: constants.colors.red }}>*</Text>
          ) : null}

          <Icon name={"caret-down"} color={constants.colors.black} size={20} />
        </View>
      </TouchableOpacity>
      <SelectMultiple
        items={props.data}
        selectedItems={props.value}
        onSelectionsChange={onSelectionsChange}
        rowStyle={styles.searchInputStyle}
        labelStyle={styles.styleTextDropdown}
        checkboxStyle={{
          color: "red",
          tintColor: constants.colors.primaryColor,
        }}
        maxSelect={props.maxSelect}
        style={{
          display: show ? "flex" : "none",
          height: Scale.moderateScale(200),
          marginHorizontal: Scale.moderateScale(20),
        }}
        selectedCheckboxStyle={{}}
      />
    </>
  );
};

export default MultiSelect;

const styles = StyleSheet.create({
  container: {
    // margin: Scale.moderateScale(5),
    marginLeft: 5,
    marginRight: 5,
    padding: Scale.moderateScale(5),
    backgroundColor: constants.colors.lightWhite,
    borderRadius: Scale.moderateScale(5),
    height: Scale.moderateScale(40),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: Scale.moderateScale(10),
  },
  styleInputGroup: {
    backgroundColor: constants.colors.primary,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: Scale.moderateScale(10),
    borderBottomColor: constants.colors.primary,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  searchInputStyle: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: constants.colors.white,
  },
  styleItemsContainer: {
    backgroundColor: constants.colors.black,
  },
  styleTextDropdown: {
    flex: 1,
    fontSize: Scale.moderateScale(12),
    paddingTop: Scale.moderateScale(2),
    color: constants.colors.black,
  },
  styleSelectedText: {
    flex: 1,
    fontSize: Scale.moderateScale(12),
    paddingTop: Scale.moderateScale(2),
    color: constants.colors.warmGrey,
  },
  styleDropdownMenuSubsection: {
    backgroundColor: constants.colors.transparent,
    borderBottomColor: constants.colors.primary,
  },
});
