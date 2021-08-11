import React from "react";
import styles from "../../styles";
import style from "./styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import * as ImagePicker from "expo-image-picker";
import db from "../../config/firebase";

import { validURL, openSettingsDialog } from "../../util/Helper";
import Scale from "../../helpers/Scale";
import TextInputComponent from "../../component/TextInputComponent";
import ButtonComponent from "../../component/ButtonComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
  Alert,
} from "react-native";
import {
  updatePhoto,
  updateCompressedPhoto,
  updateEmail,
  updateRepresentativeName,
  updatePassword,
  updateUsername,
  updateBio,
  updateUserBio,
  updateWebsiteLabel,
  signup,
  signupWithPhoneNumber,
  updateUser,
  facebookLogin,
  appleLogin,
  deleteAuth,
  deleteAllPosts,
  deleteUser,
  updatePhone,
  updateGender,
  updateAccountType,
  updateDOB,
  logout,
  createAndUpdatePreview,
} from "../../actions/user";
import { uploadPhoto } from "../../actions";
import auth from "@react-native-firebase/auth";
import {
  isNotEmpty,
  isEmailValid,
  isPassValid,
  validatePhoneNumber,
} from "../../validations/Validation";
import {
  Item,
  Input,
  Icon,
  Label,
  DatePicker,
  Picker,
  Container,
  Header,
  Subtitle,
  Left,
  Body,
  Text as NText,
  Right,
  Button,
  Title,
} from "native-base";

import { convertDate } from "../../util/DateFormater";
import ProgressiveImage from "../../component/ProgressiveImage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { showLoader } from "../../util/Loader";
const { height, width } = Dimensions.get("window");
import DropDownPicker from "../../component/dropdownpicker";

import constants from "../../constants";
import CountryPicker from "react-native-country-picker-modal";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "react-native-vector-icons";
import DataSecurityModal from "../../component/DataSecurityModal";
var autoVerified = true;

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      showEditProfile: true,
      loginMode: "email",
      countryCode: "US",
      callingCode: "1",
      uid: "",
      phone: "",
      selectedTab: 1,
      verificationCode: "",
      loaderText: "",
      confirmationResult: null,
      userAccounts: ["Personal", "Brand"],
      showDataSecurityModal: false,
    };
  }

  onGenderChange(value) {
    this.props.updateGender(value);
  }

  onAccountTypeChange(value) {
    this.props.updateAccountType(value);
  }

  onDobChange(value) {
    this.props.updateDOB(value.getTime());
  }
  componentDidMount = async () => {
    // const { routeName } = this.props.navigation.state;
    const routeName = this.props.route.name;

    if (routeName === "Signup") {
      auth().signOut();

      auth().onAuthStateChanged((user) => {
        if (user) {
          var providerId = user.providerData[0].providerId;

          if (providerId === "phone") {
            if (autoVerified) {
              this.getUser(user);
            }
            return;
          }
          // this.props.getUser(user.uid, "LOGIN");
          if (this.props.user != null) {
            // this.props.navigation.goBack();
            // this.props.navigation.replace("HomeScreen");
            // this.props.navigation.navigate("WelcomeScreen");

            // this.props.navigation.popToTop();
            // this.props.navigation.replace("HomeScreen");
            // this.props.navigation.navigate("WelcomeScreen");

            this.props.navigation.popToTop();
            this.props.navigation.replace("HomeScreen", {
              showWelcomeScreen: true,
              flow: "Signup",
            });
          }
        }
      });
    }

    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (this.props.user.accountType === "Brand") {
              this.props.updateAccountType("Personal");
            } else {
              this.props.navigation.goBack();
            }
            // this.props.navigation.goBack();
          }}
        >
          <Ionicons
            style={[styles.icon, { marginLeft: 20, color: "#fff" }]}
            name={"ios-arrow-back"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });
  };

  onPress = async (type = "") => {
    const routeName = this.props.route.name;

    if (isNotEmpty("username", this.props.user.username)) {
      if (this.props.user.accountType == "Brand") {
        if (!isPassValid(this.props.user.password)) {
          return;
        }

        if (
          !isEmailValid(this.props.user.email) ||
          !isNotEmpty("Representative Name", this.props.user.representativeName)
        ) {
          return;
        }

        this.setState({
          showLoading: true,
          loaderText: "Creating User, Please wait...",
        });
        try {
          await this.props.signup();
          this.setState({ showLoading: false });

          // this.props.navigation.goBack();
          //  this.props.navigation.navigate("Home");
        } catch (e) {
          this.setState({ showLoading: false });

          alert(e);
        }
      } else if (this.props.user.accountType == "Personal") {
        // if (this.props.user.accountType == "Brand") {
        //   if (
        //     !isEmailValid(this.props.user.email) ||
        //     !isNotEmpty(
        //       "Representative Name",
        //       this.props.user.representativeName
        //     )
        //   ) {
        //     return;
        //   }
        // }

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

      // let userData = userQuery.data();
      // if (userData && userData.username) {
      //   showMessage({
      //     message: "Error",
      //     description: "User Account Already Exist",
      //     type: "danger",
      //     duration: 3000,
      //   });
      // } else {
      //   // Signup

      //   this.props.signupWithPhoneNumber(
      //     user.uid,
      //     this.props.navigation,
      //     this.state.phone,
      //     this.state.callingCode
      //   );
      // }
      // alert(JSON.stringify(response));
    } catch (error) {
      this.setState({
        showLoading: false,
      });
      if (error.code === "auth/invalid-verification-code") {
        console.log("Invalid Verification Code");
        Alert.alert("Error", "Invalid Verification Code!");
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
      showMessage({
        message: "Error",
        description: "User Account Already Exist",
        type: "danger",
        duration: 3000,
      });
    } else {
      // Signup

      this.props.signupWithPhoneNumber(
        user.uid,
        this.props.navigation,
        this.state.phone,
        this.state.callingCode
      );
    }
  }

  async signInWithPhoneNumber(number) {
    try {
      this.setState({
        showLoading: true,
        loaderText: "Sending verification code, Please wait....",
      });
      const confirmation = await auth().signInWithPhoneNumber(number);

      this.setState({ confirmationResult: confirmation, showLoading: false });

      showMessage({
        message: "Verification Code Sent",
        description:
          "Please enter verification code sent to your entered phone number",
        type: "info",
        duration: 3000,
      });
    } catch (error) {
      // alert(JSON.stringify(error));
      this.setState({ showLoading: false });
      Alert.alert("Error", "Invalid Phone Number");
    }
  }

  onEditProfile = (edit) => {
    // this.setState({ showEditProfile: edit });
  };

  onSelectHandler(country) {
    const { callingCode, cca2, flag, name } = country;
    this.setState({ countryCode: cca2, callingCode: callingCode[0] });
  }
  render() {
    // const { routeName } = this.props.navigation.state;
    const routeName = this.props.route.name;

    return (
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { width: "100%", height: "100%" }]}>
          <ImageBackground
            style={[
              styles.container,
              styles.center,
              {
                backgroundColor: constants.colors.appBackgroundColor,
                height: height,
              },
            ]}
          >
            {/* <KeyboardAvoidingView style={{ flex: 1, width: "100%" }}> */}
            <ScrollView
              style={[{ width: "100%" }]}
              contentContainerStyle={[
                { paddingHorizontal: Scale.moderateScale(24) },
              ]}
            >
              <Image
                style={{
                  width: Scale.moderateScale(120),
                  height: Scale.moderateScale(120),
                  marginTop: Scale.moderateScale(120),
                  alignSelf: "center",
                }}
                source={require("../../assets/logoH.png")}
              />

              <Text
                style={{
                  color: constants.colors.white,
                  width: width - Scale.moderateScale(50),
                  fontSize: Scale.moderateScale(30),
                  marginVertical: Scale.moderateScale(24),
                  letterSpacing: 3,
                }}
              >
                {`Welcome  to Plaed !`}
              </Text>

              {/* <View
                style={{
                  flexDirection: "row",
                  shadowOpacity: 0.1,
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

              <TextInputComponent
                container={{ padding: 0 }}
                textContainer={{ paddingHorizontal: 10 }}
                placeholder={
                  this.props.user.accountType == "Personal"
                    ? "Username"
                    : "Brand Name"
                }
                onChangeText={(input) =>
                  this.props.updateUsername(
                    input.replace(/\s/g, "").toLowerCase()
                  )
                }
                value={this.props.user.username}
                returnKeyType="next"
              />
              {this.props.user.accountType == "Brand" && (
                <TextInputComponent
                  container={{
                    marginTop: Scale.moderateScale(16),
                    padding: 0,
                  }}
                  textContainer={{ paddingHorizontal: 10 }}
                  placeholder={"Email"}
                  onChangeText={(input) => this.props.updateEmail(input)}
                  value={this.props.user.email}
                  ref={(ref) => (this.email = ref)}
                  keyboardType="email-address"
                  autoCapitalize={false}
                />
              )}
              {this.props.user.accountType == "Brand" && (
                <TextInputComponent
                  container={{
                    marginTop: Scale.moderateScale(16),
                    padding: 0,
                  }}
                  textContainer={{ paddingHorizontal: 10 }}
                  placeholder={"Representative Name"}
                  onChangeText={(input) =>
                    this.props.updateRepresentativeName(input)
                  }
                  value={this.props.user.representativeName}
                />
              )}

              {this.props.user.accountType == "Brand" && (
                <TextInputComponent
                  container={{
                    marginTop: Scale.moderateScale(16),
                    padding: 0,
                  }}
                  textContainer={{ paddingHorizontal: 10 }}
                  placeholder={"Password"}
                  onChangeText={(input) => this.props.updatePassword(input)}
                  value={this.props.user.password}
                  autoCapitalize={false}
                  secureTextEntry
                />
              )}
              {/* {this.props.user.accountType == "Brand" && (
                <TextInputComponent
                  container={{ marginTop: 8 }}
                  placeholder={"Password"}
                  onChangeText={(input) => this.props.updatePassword(input)}
                  value={this.props.user.password}
                  keyboardType="email-address"
                  autoCapitalize={false}
                  secureTextEntry
                />
              )} */}
              {/* <View
                style={{
                  display: this.state.loginMode === "email" ? "flex" : "none",
                }}
              >
                <Item floatingLabel style={[styles.textInput]}>
                  <Label style={{ fontWeight: "500" }}>Password</Label>
                  <Input
                    value={this.props.user.password}
                    onChangeText={(input) => this.props.updatePassword(input)}
                    secureTextEntry={true}
                  />
                </Item>
              </View> */}

              {this.props.user.accountType !== "Brand" && (
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
                    <Ionicons
                      name="ios-help-circle-outline"
                      color={constants.colors.primaryColor}
                      size={28}
                      onPress={() =>
                        this.setState({ showDataSecurityModal: true })
                      }
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
                    color={constants.colors.primaryColor}
                    colors={[
                      constants.colors.transparent,
                      constants.colors.transparent,
                    ]}
                    textStyle={{ fontSize: 16 }}
                    onPress={() => this.onPress("Resend")}
                    linearGradientStyle={{
                      paddingHorizontal: Scale.moderateScale(0),
                      // marginHorizontal: Scale.moderateScale(0),
                      justifyContent: "flex-end",
                    }}
                  />
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  display: "none",
                  // borderBottomColor: "grey",
                  // borderBottomWidth: 0.4,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  height: 47,
                }}
              >
                <Text
                  style={{
                    color: constants.colors.black,
                    fontSize: Scale.moderateScale(12),
                    flex: 1,
                    fontWeight: "bold",
                    marginHorizontal: 10,
                  }}
                >
                  {"Account Type"}
                </Text>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, flex: 1 }}
                  placeholder="Select account type"
                  iosHeader="Account Type"
                  placeholderStyle={{ fontSize: Scale.moderateScale(14) }}
                  // placeholderIconColor="#007aff"
                  textStyle={{
                    fontSize: Scale.moderateScale(14),
                  }}
                  selectedValue={this.props.user.accountType}
                  onValueChange={this.onAccountTypeChange.bind(this)}
                >
                  <Picker.Item label="Personal" value="Personal" />
                  <Picker.Item label="Brand" value="Brand" />
                </Picker>
              </View>

              <ButtonComponent
                title={"Sign Up"}
                color={constants.colors.white}
                textStyle={{ fontSize: 16 }}
                onPress={this.onPress}
                containerStyle={{
                  width: Scale.moderateScale(250),
                  alignSelf: "center",
                  marginTop: Scale.moderateScale(32),
                }}
                colors={[
                  constants.colors.primaryColor,
                  constants.colors.primaryColor,
                ]}
              />
              <TouchableOpacity
                style={[styles.buttonForgot, { display: "none" }]}
                onPress={() => {
                  let loginMode = "email";
                  if (this.state.loginMode === "email") loginMode = "phone";

                  this.setState({ loginMode: loginMode });
                }}
              >
                <Text style={[styles.textA, { color: constants.colors.black }]}>
                  {this.state.loginMode === "email"
                    ? "By Phone Number"
                    : "By Email"}
                </Text>
              </TouchableOpacity>

              <ButtonComponent
                title={"Back to Login"}
                containerStyle={{
                  width: Scale.moderateScale(160),
                  alignSelf: "center",
                }}
                color={constants.colors.white}
                colors={[
                  constants.colors.transparent,
                  constants.colors.transparent,
                ]}
                textStyle={{ fontSize: 16 }}
                onPress={() => {
                  this.props.updateAccountType("Personal");
                  this.props.navigation.navigate("Login");
                }}
                linearGradientStyle={{
                  paddingHorizontal: Scale.moderateScale(0),
                  // marginHorizontal: Scale.moderateScale(0),
                }}
              />
              {this.props.user.accountType === "Personal" && (
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
                  onPress={() => this.props.updateAccountType("Brand")}
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
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
            {this.state.showLoading ? showLoader(this.state.loaderText) : null}

            {/* <Image source={require("../assets/logo.png")} resizeMode="center" /> */}
          </ImageBackground>
          <DataSecurityModal
            Show={this.state.showDataSecurityModal}
            Hide={() => {
              this.setState({
                showDataSecurityModal: false,
              });
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePhoto,
      updateCompressedPhoto,
      uploadPhoto,
      updateUser,
      updateEmail,
      updateRepresentativeName,
      updatePassword,
      updateUsername,
      updateBio,
      updateUserBio,
      updateWebsiteLabel,
      signup,
      facebookLogin,
      appleLogin,
      deleteAuth,
      deleteAllPosts,
      deleteUser,
      updatePhone,
      updateGender,
      updateAccountType,
      updateDOB,
      logout,
      createAndUpdatePreview,
      signupWithPhoneNumber,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
