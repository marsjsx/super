import React from "react";
import {
  Text,
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import constants from "../constants";
import Scale from "../helpers/Scale";

const DataSecurityModal = ({ Show, Hide }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={Show}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={Hide}
            style={{
              padding: Scale.moderateScale(12),
              width: Scale.moderateScale(10),
              alignSelf: "flex-end",
            }}
          >
            <Icon name="clear" size={25} color="black" style={styles.icon} />
          </TouchableOpacity>
          <Text
            style={{
              color: constants.colors.red,
              marginTop: 10,
              fontSize: 18,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {"Data Security Statement"}
          </Text>

          <Text
            style={{
              color: "#000",
              margin: Scale.moderateScale(10),
              marginTop: Scale.moderateScale(20),
              textAlign: "justify",
            }}
          >
            {`We value your privacy and we will not sell or misuse your data!\n\nLogin and signup with phone number are to prevent fake users and maintain a clean and positive platform !`}
          </Text>

          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: Scale.moderateScale(20),
            }}
            onPress={Hide}
          >
            {"OK, got it!"}
          </Text>
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
    height: undefined,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 30,
    shadowColor: constants.colors.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    paddingVertical: Scale.moderateScale(8),
  },
  icon: { right: 10, position: "absolute", top: 10 },
});

export default DataSecurityModal;
