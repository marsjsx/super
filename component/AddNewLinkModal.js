import React, { useState, useEffect } from "react";
import {
  Text,
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ButtonComponent from "../component/ButtonComponent";
import TextInputComponent from "../component/TextInputComponent";
import Icon from "react-native-vector-icons/MaterialIcons";
import Scale from "../helpers/Scale";
import constants from "../constants";
const AddNewLinkModal = ({ Show, websiteLabel, website, Hide, onSave }) => {
  const [websiteTitle, setWebsiteTitle] = useState(websiteLabel);
  const [websiteLink, setWebsiteLink] = useState(website);

  return (
    <Modal animationType="fade" transparent={true} visible={Show}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 20, color: "#000", fontWeight: "bold" }}>
              {websiteLink ? "Edit Link" : "Create New Link"}
            </Text>

            <TouchableOpacity
              onPress={Hide}
              style={
                {
                  // padding: Scale.moderateScale(12),
                  // width: Scale.moderateScale(10),
                }
              }
            >
              <Icon name="clear" size={25} color="black" style={{}} />
            </TouchableOpacity>
          </View>
          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(16) }}
            placeholder={"Enter title"}
            title={"Enter title"}
            value={websiteTitle}
            textContainer={{ backgroundColor: "#f5f5f5" }}
            onChangeText={(input) => setWebsiteTitle(input)}
          />
          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={"Enter website"}
            title={"Enter website"}
            value={websiteLink}
            autoCapitalize={false}
            textContainer={{ backgroundColor: "#f5f5f5" }}
            onChangeText={(input) => setWebsiteLink(input)}
          />

          <ButtonComponent
            title={"Save"}
            color={constants.colors.white}
            textStyle={{ fontSize: 16 }}
            onPress={() => onSave(websiteLink, websiteTitle)}
            colors={[
              constants.colors.primaryColor,
              constants.colors.primaryColor,
            ]}
            containerStyle={{
              width: Scale.moderateScale(150),
              alignSelf: "center",
              marginTop: Scale.moderateScale(16),
              marginBottom: Scale.moderateScale(16),
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    height: 600,
  },
  modal: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: "white",
  },
  icon: { right: 10, position: "absolute", top: 10 },
  matchFamilyText: {
    color: "#EC38DA",
    textAlign: "center",
    fontSize: 22,
    marginTop: 15,
    fontFamily: "Poppins-light",
  },
  imageContainerView: {
    flexDirection: "row",
    justifyContent: "space-around",
    display: "flex",
    marginTop: 30,
  },
  image: {
    aspectRatio: 0.8,
    width: undefined,
    height: Scale.moderateScale(100),
    // width: Scale.moderateScale(100),
    // height: Scale.moderateScale(100),
  },
  wowText: {
    color: "#5227B1",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    fontSize: 20,
  },
  chatButton: {
    backgroundColor: "#5D30D8",
    marginTop: 30,
    borderRadius: 5,
    padding: 10,
  },
  continueButton: { backgroundColor: "#CE64F4", borderRadius: 5, padding: 10 },
});

export default AddNewLinkModal;
