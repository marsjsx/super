import { StyleSheet, Dimensions } from "react-native";
import constants from "../../constants";
import Scale from "../../helpers/Scale";

const H = Dimensions.get("window").height;
const W = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 16,
  },
  inputContainer: {
    height: H * 0.062,
    width: W * 0.9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: constants.colors.border,
    borderRadius: 1,
  },
  pickerContainer: {
    height: H * 0.06,
    width: W * 0.16,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'orange',
    flexDirection: "row",
  },
  ccContainer: {
    height: H * 0.04,
    width: W * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: constants.colors.border,
    borderLeftWidth: 0.5,
    // backgroundColor: 'orange',
  },
  ccText: {
    color: constants.colors.black,
    fontWeight: "500",
    fontSize: 17,
  },
  textInput: {
    height: H * 0.06,
    flex: 1,
    color: constants.colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    fontSize: 17,
    fontWeight: "500",
  },
  logo: {
    width: Scale.moderateScale(150),
    height: Scale.moderateScale(150),
    marginTop: Scale.moderateScale(60),
    marginLeft: Scale.moderateScale(-32),
    marginBottom: Scale.moderateScale(-20),
  },
});

export default styles;
