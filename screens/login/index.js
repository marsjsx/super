import React from "react";
import styles from "../../styles";
import style from "./styles";
import auth from "@react-native-firebase/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import db from "../../config/firebase";
import { Alert } from "react-native";
import MixpanelManager from "../../Analytics";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import {
  updateEmail,
  updatePassword,
  login,
  getUser,
  getLoggedInUserData,
  facebookLogin,
  appleLogin,
  updateAccountType,
} from "../../actions/user";
import ButtonComponent from "../../component/ButtonComponent";
import { showLoader } from "../../util/Loader";
// import Toast from "react-native-tiny-toast";
import {
  isNotEmpty,
  isEmailValid,
  validatePhoneNumber,
} from "../../validations/Validation";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Item, Icon, Input, Label, DatePicker, Subtitle } from "native-base";
import Scale from "../../helpers/Scale";
import CountryPicker from "react-native-country-picker-modal";
import constants from "../../constants";
// import Fumi from "../../component/textinput/Fumi";
import TextInputComponent from "../../component/TextInputComponent";
const { height, width } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";

var autoVerified = true;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      loginMode: "phone",
      countryCode: "US",
      callingCode: "1",
      phone: "",
      loaderText: "",
      otpSent: false,
      verificationCode: "",
      confirmationResult: null,
    };
  }

  componentDidMount = async () => {
    // alert("Called");
    auth().signOut();
    auth().onAuthStateChanged((user) => {
      // alert(JSON.stringify(user));
      if (user) {
        var providerId = user.providerData[0].providerId;

        if (providerId === "phone") {
          if (autoVerified) {
            this.getUser(user);
          }

          return;
        }
        this.props.getUser(user.uid, "LOGIN");
        if (this.props.user != null) {
          // this.props.navigation.goBack();
          // this.props.navigation.navigate("Home");
          this.props.navigation.popToTop();
          this.props.navigation.replace("HomeScreen", {
            showWelcomeScreen: true,
            flow: "Login",
          });
        }
      }
    });

    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (this.state.loginMode === "email") {
              this.setState({ loginMode: "phone" });
            } else {
              this.props.navigation.goBack();
            }
          }}
        >
          <Ionicons
            style={[styles.icon, { marginLeft: 20, color: "#000" }]}
            name={"ios-arrow-back"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });
  };

  onClickLogin = async (type = "") => {
    if (
      this.state.loginMode === "email" ||
      this.props.user.accountType == "Brand"
    ) {
      if (
        isEmailValid(this.props.user.email) &&
        isNotEmpty("password", this.props.user.password)
      ) {
        this.setState({
          showLoading: true,
          loaderText: "Verifying credentials, Please wait...",
        });
        await this.props.login();
        this.setState({ showLoading: false });
      }
    } else if (this.state.loginMode === "phone") {
      let phoneValidationError = validatePhoneNumber(this.state.phone);

      if (phoneValidationError) {
        showMessage({
          message: "Error",
          description: phoneValidationError,
          type: "danger",
          duration: 3000,
        });
        return;
      }
      const number = `+${this.state.callingCode}${this.state.phone}`;
      if (!this.state.confirmationResult) {
        this.signInWithPhoneNumber(number);
        return;
      }

      if (type === "Resend") {
        this.signInWithPhoneNumber(number);
        return;
      }

      if (!this.state.verificationCode) {
        showMessage({
          message: "Error",
          description:
            "Please enter verification code sent to your mobile number",
          type: "danger",
          duration: 3000,
        });
        return;
      }
      this.verifyOTP();
    }
  };

  async verifyOTP() {
    try {
      this.setState({
        showLoading: true,
        loaderText: "Verifying verification code, Please wait....",
      });
      autoVerified = false;
      const response = await this.state.confirmationResult.confirm(
        this.state.verificationCode
      );
      this.setState({
        showLoading: false,
      });
      const { additionalUserInfo, user } = response;

      this.getUser(user);

      // const userQuery = await db.collection("users").doc(user.uid).get();

      // this.setState({
      //   showLoading: false,
      // });
      // let userData = userQuery.data();

      // if (userData && userData.username) {
      //   var eventProperties = {
      //     name: userData.username,
      //     datetime: new Date(),
      //     phone: userData.phone,
      //   };
      //   MixpanelManager.sharedInstance.trackEventWithProperties(
      //     "Login",
      //     eventProperties
      //   );

      //   this.props.getLoggedInUserData(user.uid);

      //   //login
      //   this.props.getUser(user.uid, "LOGIN");

      //   this.props.navigation.popToTop();
      //   this.props.navigation.replace("HomeScreen", {
      //     showWelcomeScreen: true,
      //   });

      //   // this.props.navigation.goBack();
      //   // this.props.navigation.replace("HomeScreen");
      //   // this.props.navigation.navigate("WelcomeScreen");
      // } else {
      //   // Signup

      //   // this.props.navigation.navigate("Signup", { uid: user.uid });
      //   showMessage({
      //     message: "Error",
      //     description: "User Not Found, Please Create your account ",
      //     type: "danger",
      //     duration: 3000,
      //   });
      // }
      // alert(JSON.stringify(response));
    } catch (error) {
      this.setState({
        showLoading: false,
      });
      if (error.code === "auth/invalid-verification-code") {
        console.log("Invalid Verification Code");
        Alert.alert("Error", "Invalid Verification Code!");
      } else if (error.code === "auth/session-expired") {
        console.log("Session Expired");
        // Alert.alert("Error", "Invalid Verification Code!");
      } else {
        alert(error);
      }
    }
  }

  async getUser(user) {
    this.setState({
      showLoading: true,
      loaderText: "Getting User Information, Please wait....",
    });
    const userQuery = await db.collection("users").doc(user.uid).get();

    this.setState({
      showLoading: false,
    });

    let userData = userQuery.data();

    if (userData && userData.username) {
      var eventProperties = {
        name: userData.username,
        datetime: new Date(),
        phone: userData.phone,
      };
      MixpanelManager.sharedInstance.trackEventWithProperties(
        "Login",
        eventProperties
      );

      this.props.getLoggedInUserData(user.uid);

      //login
      this.props.getUser(user.uid, "LOGIN");

      this.props.navigation.popToTop();
      this.props.navigation.replace("HomeScreen", {
        showWelcomeScreen: true,
        flow: "Login",
      });

      // this.props.navigation.goBack();
      // this.props.navigation.replace("HomeScreen");
      // this.props.navigation.navigate("WelcomeScreen");
    } else {
      // Signup

      // this.props.navigation.navigate("Signup", { uid: user.uid });
      showMessage({
        message: "Error",
        description: "User Not Found, Please Create your account ",
        type: "danger",
        duration: 3000,
      });
    }
  }

  async signInWithPhoneNumber(number) {
    try {
      this.setState({
        showLoading: true,
        loaderText: "Sending verification code, Please wait....",
      });
      const confirmation = await auth().signInWithPhoneNumber(number);
      autoVerified = true;
      this.setState({ confirmationResult: confirmation, showLoading: false });

      showMessage({
        message: "Verification Code Sent",
        description:
          "Please enter verification code sent to your entered phone number",
        type: "info",
        duration: 3000,
      });
    } catch (error) {
      this.setState({ showLoading: false });
      Alert.alert("Error", "Invalid Phone Number");
    }
  }

  onFaceBookLogin = async () => {
    this.setState({ showLoading: true });
    try {
      await this.props.facebookLogin();
      this.setState({ showLoading: false });
      // this.props.navigation.goBack();
      //  this.props.navigation.navigate("Home");
    } catch (e) {
      this.setState({ showLoading: false });
      alert(`Facebook Login Error: ${e}`);
    }
  };

  appleLoginLogin = async () => {
    this.setState({ showLoading: true });
    try {
      await this.props.appleLogin();
      this.setState({ showLoading: false });

      // this.props.navigation.goBack();
      //  this.props.navigation.navigate("Home");
    } catch (e) {
      this.setState({ showLoading: false });
      alert(e.message);
    }
  };
  onSelectHandler(country) {
    const { callingCode, cca2, flag, name } = country;
    this.setState({ countryCode: cca2, callingCode: callingCode[0] });
  }

  render() {
    return (
      <ImageBackground
        // source={require("../temp/black-gray-back.png")}
        style={[
          styles.container,
          styles.center,
          { backgroundColor: "#f8f8ff" },
        ]}
      >
        <KeyboardAvoidingView style={{ flex: 1, width: "100%" }}>
          <ScrollView
            style={[{ width: "100%" }]}
            contentContainerStyle={[
              {
                paddingHorizontal: Scale.moderateScale(24),
              },
            ]}
          >
            <Image
              style={style.logo}
              source={require("../../assets/logoH.png")}
            />
            <Text
              style={{
                color: constants.colors.titleColor,
                width: width - Scale.moderateScale(50),
                fontSize: Scale.moderateScale(30),
                marginVertical: Scale.moderateScale(10),
                letterSpacing: 3,
                marginBottom: Scale.moderateScale(24),
              }}
            >
              {`Welcome Back to Super !`}
            </Text>

            {/* <View
              style={{
                flexDirection: "row",
                marginVertical: Scale.moderateScale(20),
              }}
            >
              <TouchableOpacity
                style={[]}
                onPress={() => {
                  this.props.updateAccountType("Personal");
                }}
              >
                <Text
                  style={[
                    this.props.user.accountType == "Personal"
                      ? style.activeLabel
                      : style.inactiveLabel,
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 2,
                  backgroundColor: "black",
                  margin: Scale.moderateScale(10),
                }}
              />
              <TouchableOpacity
                style={[]}
                onPress={() => {
                  this.props.updateAccountType("Brand");
                }}
              >
                <Text
                  style={[
                    this.props.user.accountType == "Brand"
                      ? style.activeLabel
                      : style.inactiveLabel,
                  ]}
                >
                  Brand
                </Text>
              </TouchableOpacity>
            </View> */}

            {(this.state.loginMode === "email" ||
              this.props.user.accountType == "Brand") && (
              <View style={{}}>
                <TextInputComponent
                  container={{ marginTop: Scale.moderateScale(16), padding: 0 }}
                  textContainer={{ paddingHorizontal: 10 }}
                  placeholder={"Email"}
                  onChangeText={(input) => this.props.updateEmail(input)}
                  value={this.props.user.email}
                  ref={(ref) => (this.email = ref)}
                  keyboardType="email-address"
                  autoCapitalize={false}
                  returnKeyType="next"
                />

                <TextInputComponent
                  container={{ marginTop: Scale.moderateScale(16), padding: 0 }}
                  textContainer={{ paddingHorizontal: 10 }}
                  placeholder={"Password"}
                  onChangeText={(input) => this.props.updatePassword(input)}
                  value={this.props.user.password}
                  keyboardType="email-address"
                  autoCapitalize={false}
                  secureTextEntry
                />

                <ButtonComponent
                  title={"Forgot Password?"}
                  containerStyle={{
                    width: Scale.moderateScale(160),
                    alignSelf: "flex-end",
                  }}
                  color={constants.colors.superRed}
                  colors={[
                    constants.colors.transparent,
                    constants.colors.transparent,
                  ]}
                  textStyle={{
                    fontSize: 16,
                    fontFamily: null,
                    color: constants.colors.appRed,
                  }}
                  onPress={() => this.props.navigation.navigate("Reset")}
                  linearGradientStyle={{
                    paddingHorizontal: Scale.moderateScale(0),
                    // marginHorizontal: Scale.moderateScale(0),
                    justifyContent: "flex-end",
                  }}
                />
              </View>
            )}

            {this.state.loginMode === "phone" &&
              this.props.user.accountType !== "Brand" && (
                <View
                  style={{
                    justifyContent: "center",
                    marginTop: Scale.moderateScale(16),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 5,
                      backgroundColor: "#fff",
                      height: Scale.moderateScale(40),
                      paddingHorizontal: 10,
                    }}
                  >
                    <View style={style.pickerContainer}>
                      <CountryPicker
                        countryCode={this.state.countryCode}
                        // withFlag={true}
                        withCallingCode
                        onSelect={(c) => this.onSelectHandler(c)}
                      />

                      <MaterialIcons
                        name="arrow-drop-down"
                        color="#000"
                        size={24}
                      />
                    </View>
                    <View style={style.ccContainer}>
                      <Text
                        style={style.ccText}
                      >{`+${this.state.callingCode}`}</Text>
                    </View>

                    <TextInputComponent
                      container={{ flex: 1, padding: 0 }}
                      placeholder={"Phone Number"}
                      onChangeText={(input) => this.setState({ phone: input })}
                      keyboardType={"numeric"}
                      maxLength={15}
                      value={this.state.phone}
                    />
                  </View>

                  <TextInputComponent
                    container={{ marginTop: 16, padding: 0 }}
                    textContainer={{ paddingHorizontal: 10 }}
                    placeholder={"Enter Code"}
                    onChangeText={(input) =>
                      this.setState({ verificationCode: input })
                    }
                    maxLength={8}
                    value={this.state.verificationCode}
                    keyboardType={"numeric"}
                  />

                  <ButtonComponent
                    title={
                      this.state.confirmationResult
                        ? "Resend Code"
                        : "Send Code"
                    }
                    containerStyle={{
                      width: Scale.moderateScale(160),
                      alignSelf: "flex-end",
                    }}
                    color={constants.colors.appRed}
                    colors={[
                      constants.colors.transparent,
                      constants.colors.transparent,
                    ]}
                    textStyle={{ fontSize: 16, fontFamily: null }}
                    onPress={() => this.onClickLogin("Resend")}
                    linearGradientStyle={{
                      paddingHorizontal: Scale.moderateScale(0),
                      // marginHorizontal: Scale.moderateScale(0),
                      justifyContent: "flex-end",
                    }}
                  />
                </View>
              )}

            {/* <Subtitle
              style={{
                textAlign: "center",
                margin: 10,
                color: "gray",
              }}
            >
              By continuning, you agree to {appName}'s{" "}
              <Text
                style={{ color: "blue" }}
                onPress={() =>
                  Linking.openURL("https://www.lllsuperlll.com/terms-of-use")
                }
              >
                Terms of Use
              </Text>{" "}
              and confirm that you have read {appName}'s
              <Text
                style={{ color: "blue" }}
                onPress={() =>
                  Linking.openURL("https://www.lllsuperlll.com/privacy-policy")
                }
              >
                {" "}
                Privacy policy
              </Text>{" "}
            </Subtitle> */}

            <ButtonComponent
              title={"Log In"}
              color={constants.colors.white}
              textStyle={{ fontSize: 16 }}
              onPress={() => this.onClickLogin()}
              containerStyle={{
                width: Scale.moderateScale(250),
                alignSelf: "center",
                marginTop: Scale.moderateScale(8),
              }}
            />

            <Text
              style={[
                styles.textLabel,
                {
                  color: constants.colors.black,
                  alignSelf: "center",
                  display: "none",
                },
              ]}
            >
              Or{" "}
            </Text>
            <ButtonComponent
              title={"Create account"}
              containerStyle={{
                width: Scale.moderateScale(160),
                alignSelf: "center",
              }}
              color={constants.colors.black}
              colors={[
                constants.colors.transparent,
                constants.colors.transparent,
              ]}
              textStyle={{ fontSize: 16, fontFamily: null }}
              onPress={() => this.props.navigation.navigate("Signup")}
              linearGradientStyle={{
                paddingHorizontal: Scale.moderateScale(0),
                // marginHorizontal: Scale.moderateScale(0),
              }}
            />

            {/* {this.props.user.accountType !== "Brand" && ( */}
            <ButtonComponent
              title={
                this.state.loginMode === "email"
                  ? "Did you sign up with phone number"
                  : "Did you sign up with email"
              }
              containerStyle={{
                width: Scale.moderateScale(300),
                alignSelf: "center",
              }}
              color={constants.colors.pinkPurple}
              colors={[
                constants.colors.transparent,
                constants.colors.transparent,
              ]}
              textStyle={{
                fontSize: 16,
                fontFamily: null,
              }}
              onPress={() => {
                let loginMode = "email";
                if (this.state.loginMode === "email") loginMode = "phone";

                this.setState({ loginMode: loginMode });
              }}
              linearGradientStyle={{
                paddingHorizontal: Scale.moderateScale(0),
                // marginHorizontal: Scale.moderateScale(0),
              }}
            />
            {this.state.loginMode === "phone" && (
              <ButtonComponent
                title={"BUSINESS ACCOUNT"}
                containerStyle={{
                  alignSelf: "center",
                }}
                color={constants.colors.greyText}
                colors={[
                  constants.colors.transparent,
                  constants.colors.transparent,
                ]}
                textStyle={{ fontSize: 16, fontFamily: null }}
                onPress={() => this.setState({ loginMode: "email" })}
                linearGradientStyle={{
                  paddingHorizontal: Scale.moderateScale(0),
                  // marginHorizontal: Scale.moderateScale(0),
                }}
                textStyle={{
                  fontSize: Scale.moderateScale(14),
                  fontFamily: null,
                }}
              />
            )}

            {/* )} */}
          </ScrollView>
        </KeyboardAvoidingView>

        {this.state.showLoading ? showLoader(this.state.loaderText) : null}

        {/* <Image source={require("../assets/logoW.png")} resizeMode="center" /> */}
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateEmail,
      updatePassword,
      login,
      getUser,
      facebookLogin,
      appleLogin,
      getLoggedInUserData,
      updateAccountType,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
