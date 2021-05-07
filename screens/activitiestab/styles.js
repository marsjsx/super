import { Dimensions } from "react-native";
import Scale from "../../helpers/Scale";

export const styles = {
  activeLabel: {
    fontWeight: "bold",
    padding: 5,
    color: "#db565b",
    fontSize: Scale.moderateScale(24),
  },
  inactiveLabel: {
    padding: 5,
    color: "#000",
    fontSize: Scale.moderateScale(24),
  },
  container: {
    flex: 1,
  },
  bottomwhiteborder: {
    // borderBottomWidth: 2,
    // marginLeft: Scale.moderateScale(10),
    // marginRight: Scale.moderateScale(10),
    // borderBottomColor: "#00ff00",
  },
  bottomgreyborder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#dcdcdc",
  },
};

export default styles;
