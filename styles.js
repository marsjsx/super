import { StyleSheet, Dimensions, Platform } from "react-native";
const { height, width } = Dimensions.get("window");
const aspectRatio = width / height;
import constants from "./constants";

// import { useHeaderHeight } from "@react-navigation/stack";
import Scale from "./helpers/Scale";
// const headerHeight = useHeaderHeight();
const headerHeight = 80;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: null,
    height: null,
  },

  androidshadow: {
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    shadowOpacity: 1,
    elevation: 3,
    // background color must be set
    backgroundColor: "#0000", // invisible color
  },

  iconshadowandroid: {
    ...Platform.select({
      ios: {},
      android: {
        shadowOpacity: 2,
        textShadowRadius: 4,
        textShadowOffset: { width: 2, height: 2 },
      },
    }),
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoDescriptionContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 13,
    backgroundColor: "transparent",
    color: "black",
  },
  textPhotographer: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textContainer: {
    flexDirection: "row",
    textAlign: "left",
    paddingTop: 0,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "white",
  },
  absolute: {
    position: "absolute",
    bottom: 40,
  },
  image: {
    marginTop: 10,
    height: 280,
    width: "92%",
  },
  card: {
    height: 345,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 2,
  },
  icon: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    borderRadius: 160,
    alignSelf: "center",
    opacity: 0,
  },
  url: {
    color: "red",
    textDecorationLine: "underline",
  },
  space: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    alignItems: "flex-start",
  },
  right: {
    alignItems: "flex-end",
  },
  smallMargin: {
    margin: 15,
  },
  margin10: {
    margin: 10,
  },
  row: {
    flexDirection: "row",
  },
  bold: {
    fontWeight: "bold",
  },
  white: {
    color: "#fff",
  },
  red: {
    color: "rgba(209, 84, 84, 0.85)",
  },
  gray: {
    color: "#adadad",
  },
  grey: {
    color: "#696969",
  },
  black: {
    color: "#000",
  },
  small: {
    fontSize: 10,
  },
  medium: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 15,
  },
  url: {
    color: "red",
    textDecorationLine: "underline",
  },

  email: {
    textDecorationLine: "underline",
  },

  text: {
    color: "black",
    fontSize: 15,
  },

  phone: {
    color: "blue",
    textDecorationLine: "underline",
  },

  name: {
    color: "red",
  },

  username: {
    color: "rgba(209, 84, 84, 0.85)",
    fontWeight: "bold",
  },

  magicNumber: {
    fontSize: 42,
    color: "pink",
  },

  hashTag: {
    fontStyle: "italic",
  },
  input: {
    width: width * 0.8,
    margin: 10,
    padding: 10,
    alignSelf: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
  },
  inputSearch: {
    width: width * 0.8,
    margin: 10,
    padding: 10,
    // alignSelf: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  facebookButton: {
    backgroundColor: "#3b5998",
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "#3b5998",
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  border: {
    width: "85%",
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center",
    padding: 0,
  },
  border2: {
    width: width,
    marginBottom: 0,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    textAlign: "left",
  },
  border3: {
    width: "75%",
    marginBottom: 0,
    padding: 5,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "left",
  },
  borderAll: {
    borderColor: "#d3d3d3",
    borderWidth: 1,
  },
  border4: {
    width: "85%",
    borderColor: "rgb(175,175,175)",
    borderBottomWidth: 1,
    textAlign: "center",
    padding: 0,
  },
  postPhoto: {
    ...Platform.select({
      ios: {
        height: height - 0,
      },
      android: {
        height: height - 0,
      },
    }),
    // height: height ,
    width: width,
  },
  fullScreen: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  fullHeight: {
    width: "100%",
    height: Dimensions.get("screen").height,
  },
  fullWidth: {
    width: Dimensions.get("screen").width,
  },
  postPhotoPreview: {
    height: height - Scale.moderateScale(115),
    width: width,
    marginBottom: 0,
  },
  videoPlayer: {
    // height: height - (Header.HEIGHT + Scale.moderateScale(20)),
    height: height - (headerHeight + Scale.moderateScale(40)),
    width: width,
    // flex: 1,
    marginBottom: 0,
  },
  roundImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
    backgroundColor: "#adadad",
  },

  roundImage60s: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 30,
    backgroundColor: "#adadad",
  },
  roundImage60: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#adadad",
  },
  roundImage80: {
    width: Scale.moderateScale(80),
    height: Scale.moderateScale(80),
    borderRadius: Scale.moderateScale(40),
    marginTop: Scale.moderateScale(10),
    marginBottom: Scale.moderateScale(10),
    marginLeft: Scale.moderateScale(10),
    marginRight: Scale.moderateScale(10),
    backgroundColor: "#adadad",
  },
  roundImage100: {
    width: Scale.moderateScale(100),
    height: Scale.moderateScale(100),
    borderRadius: Scale.moderateScale(50),
    marginTop: Scale.moderateScale(10),
    marginBottom: Scale.moderateScale(10),
    marginLeft: Scale.moderateScale(10),
    marginRight: Scale.moderateScale(10),
    backgroundColor: "#adadad",
  },
  squareLarge: {
    width: width * 0.33,
    // aspectRatio: aspectRatio,
    height: width * 0.33 * (height / width),
    margin: 1,
    backgroundColor: "#d3d3d3",
  },
  profilePosts: {
    width: width * 0.33,
    // aspectRatio: aspectRatio,
    aspectRatio: 2 / 3,
    // height: 170,
    margin: 1,
    backgroundColor: "#d3d3d3",
  },
  squareLargeDouble: {
    width: width * 0.66,
    height: 340,
    margin: 1,
    backgroundColor: "#d3d3d3",
  },
  cameraButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: "center",
    backgroundColor: "#fff",
    marginBottom: 50,
  },
  changeCameraButton: {
    height: 30,
    width: 30,
    borderRadius: width / 2,
    padding: 10,
    marginBottom: 30,
    borderColor: "#000000",
    alignSelf: "flex-end",
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  buttonPost: {
    marginBottom: 40,
    marginTop: 40,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: "center",
    width: 275,
  },
  buttonSmall: {
    margin: 10,
    marginBottom: 0,
    padding: 5,
    alignItems: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    width: 125,
  },
  buttonXsmall: {
    padding: 10,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0)",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    width: 60,
    height: 60,
  },
  buttonMessage: {
    marginTop: -20,
  },
  buttonLogin: {
    marginTop: 15,
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    backgroundColor: "rgba(209,84,84,0.85)",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "rgba(200,100,200,0.8)",
  },
  buttonLogin1: {
    marginTop: 15,
    paddingTop: 11,
    paddingBottom: 11,
    flex: 1,
    backgroundColor: constants.colors.superRed,
    borderRadius: 5,
    borderWidth: 0,
  },
  buttonApple: {
    marginTop: 15,
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    borderRadius: 20,
    height: 40,
  },
  buttonSignup: {
    marginTop: 15,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    backgroundColor: "rgba(209,84,84,0.85)",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "#fff",
  },
  buttonReset: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    backgroundColor: "rgba(38, 94, 53,0.8)",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "rgb(38, 94, 53)",
  },
  buttonLogin2: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    backgroundColor: "rgba(237,124,128,0.85)",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "#fff",
    marginBottom: 40,
  },
  textInput: {
    marginTop: 8,
    width: "90%",
  },
  buttonSignup2: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    backgroundColor: "rgba(243,177,174,0.85)",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "#fff",
  },
  buttonFilter: {
    marginTop: 15,
    paddingBottom: 6,
    paddingTop: 6,
    width: width * 0.85,
    backgroundColor: "rgba(209,84,84,0)",
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "rgb(237,124,128)",
  },
  buttonSelected: {
    marginTop: 15,
    paddingBottom: 6,
    paddingTop: 6,
    width: width * 0.85,
    backgroundColor: "rgba(237,124,128,1)",
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "rgb(237,124,128)",
  },
  buttonFacebook: {
    backgroundColor: "rgba(59, 89, 152,0.8)",
    marginTop: 15,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "rgba(59, 89, 152,0.8)",
    borderWidth: 0,
    borderRadius: 20,
    width: 250,
  },
  buttonDelete: {
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    backgroundColor: "rgba(225,30,30,0.85)",
    borderRadius: 5,
    borderWidth: 0,
    borderColor: "#fff",
  },
  buttonCircle: {
    marginTop: -50,
    marginBottom: 0,

    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(81, 137, 226,0.95)",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 50,
    width: 70,
    height: 70,
    zIndex: 1,
  },
  buttonSave: {
    paddingTop: 11,
    paddingBottom: 11,
    width: 125,
    backgroundColor: "rgba(255,255,255,0)",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "#fff",
    zIndex: 100,
  },
  buttonCancel: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    backgroundColor: "rgb(3,3,2)",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "#fff",
  },
  buttonLogout: {
    marginTop: -50,
    marginBottom: 0,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#d3d3d3",
    backgroundColor: "rgb(255, 67, 35)",
    borderWidth: 1,
    borderRadius: 50,
    width: 70,
    height: 70,
    zIndex: 100,
  },
  buttonShare: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(255,255,255,0)",
    borderWidth: 0,
    width: 70,
    height: 20,
  },
  buttonForgot: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "flex-end",
  },
  logo2: {
    width: 100,
    height: 100,
    marginTop: 40,
    marginBottom: 20,
    transform: [{ rotate: "90deg" }],
  },
  logo3: {
    width: 100,
    height: 100,
    marginTop: 60,
    marginBottom: 20,
    transform: [{ rotate: "90deg" }],
  },
  textPlaceholder: {
    letterSpacing: 2,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  textPlaceholderB: {
    letterSpacing: 3,
    color: "rgb(3,3,2)",
    textAlign: "center",
    fontWeight: "500",
  },
  textA: {
    letterSpacing: 2,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  textB: {
    letterSpacing: 3,
    color: "rgb(3,3,2)",
    textAlign: "center",
    fontWeight: "500",
  },
  textL: {
    letterSpacing: 3,
    color: "rgb(215, 80, 80)",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  textD: {
    letterSpacing: 1,
    color: "rgb(255, 255, 255)",
    textAlign: "left",
    fontWeight: "300",
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 7,
    // textShadowColor: "#000000",
  },
  textE: {
    letterSpacing: 1,
    color: "rgb(255, 255, 255)",
    textAlign: "left",
    fontWeight: "300",
    fontSize: 10,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 7,
    textShadowColor: "#000000",
  },
  textF: {
    color: "rgb(55, 55, 55)",
    textAlign: "center",
  },
  textG: {
    color: "rgb(2, 2, 2)",
    textAlign: "left",
    textAlignVertical: "center",
    fontWeight: "400",
    fontSize: 16,
  },
  textH: {
    marginTop: "6%",
    marginLeft: "3%",
    letterSpacing: 2,
    color: "rgb(255, 67, 35)",
    textAlign: "left",
    fontWeight: "600",
    fontSize: 16,
  },
  textW: {
    color: "rgb(255, 255, 255)",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 7,
    textShadowColor: "#000000",
  },
  textJ: {
    letterSpacing: 1,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  textK: {
    letterSpacing: 1,
    color: "#fff",
    textAlign: "left",
    fontWeight: "300",
    fontSize: 18,
  },
  textChatOut: {
    color: "rgb(255, 255, 255)",
    textAlign: "left",
  },
  textChatInc: {
    color: "rgb(3,3,3)",

    textAlign: "left",
  },
  textInputA: {
    width: "85%",
    marginTop: 0,
    padding: 0,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    borderColor: "rgba(0,0,0,0)",
    borderBottomWidth: 0,
    textAlign: "center",
    letterSpacing: 1,
    marginLeft: "-5%",
  },
  bottom: {
    width: width,
    flex: 0.95,
    justifyContent: "flex-end",
    paddingBottom: 65,
  },
  bottomProfile: {
    width: width,
    flex: 1,
    flex: 0.98,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  squareImage: {
    width: 60,
    height: 60,
    borderRadius: 0,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#adadad",
  },
  logoHeader: {
    ...Platform.select({
      ios: {},
      android: {
        // marginLeft: width / 5,
      },
    }),
  },
  // profilePhoto: {
  //   height: height * 1,
  //   width: width,
  // },

  profilePhoto22: {
    height: height * 0.6,
    width: width - 20,
  },
  profileEditPhoto: {
    height: height * 0.92,
    width: width,
  },
  profilePhoto: {
    // height: height * 1 - width * 0.33 * 1.5,
    width: width,
    aspectRatio: 3 / 5,
    height: "auto",
  },
  viewProfilePhoto: {
    // height: height * 1 - width * 0.33 * 1.5,
    width: width,
    aspectRatio: 3 / 4,
    height: "auto",
  },
  profilePhotoSmall: {
    // width: Scale.moderateScale(50),
    // aspectRatio: 3 / 5,
    height: Scale.moderateScale(120),
    aspectRatio: 3 / 5,
    // width: 100,
  },
  profilePhotoSignup: {
    height: height * 1 - width * 0.1,
    width: width,
  },
  profileLogo: {
    // ...Platform.select({
    //   ios: {},
    //   android: {
    //     marginLeft: width / 2.5,
    //   },
    // }),
    width: 50,
    height: 50,
  },
  profileLogo1: {
    width: 80,
    height: 80,
    marginHorizontal: 10,
  },
  followBar: {
    paddingHorizontal: "10%",
    paddingVertical: 5,
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255,255,255,1)",
    width: "100%",
  },
  profileInfo: {
    paddingHorizontal: 20,
  },
  topLine: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,1)",
    width: width,
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: "rgb(75,75,75)",
    width: width,
  },
  dropDown: {
    width: width,
  },
  postShare: {
    flex: 1,

    paddingVertical: 20,
    width: width,
    borderBottomWidth: 0.5,
    borderColor: "rgba(150,150,150,0.9)",
  },
  chatBlue: {
    backgroundColor: "rgb(66, 135, 245)",
    borderRadius: 30,
    borderWidth: 0,
  },
  chatWhite: {
    borderWidth: 0.5,
    borderColor: "rgb(1, 1, 1)",
    borderRadius: 30,
  },
  hide: {
    height: "0",
    width: "0",
  },
  tintGreen: {
    width: width,
    height: height,
    backgroundColor: "rgba(85, 160, 112,0.1)",
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    marginRight: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    paddingBottom: 25,
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    flex: 0.12,
    flexDirection: "row",
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    // flex: 1,
    flexDirection: "row",
  },

  activeLabel: {
    fontWeight: "bold",
    padding: 5,
    color: "rgb(215, 80, 80)",
    fontSize: Scale.moderateScale(16),
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
  inactiveLabel: {
    fontWeight: "bold",
    padding: 5,
    color: "white",
    fontSize: Scale.moderateScale(16),
  },
});
