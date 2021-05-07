import React from "react";
import styles from "../../styles";
import style from "./styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import * as ImagePicker from "expo-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import db from "../../config/firebase";

import * as Permissions from "expo-permissions";
import { validURL, openSettingsDialog } from "../../util/Helper";
import { Ionicons } from "@expo/vector-icons";
import Scale from "../../helpers/Scale";
import TextInputComponent from "../../component/TextInputComponent";
import ButtonComponent from "../../component/ButtonComponent";

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
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import constants from "../../constants";
import CountryPicker from "react-native-country-picker-modal";
import { MaterialIcons } from "@expo/vector-icons";
class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      showEditProfile: true,
      loginMode: "phone",
      countryCode: "US",
      callingCode: "1",
      uid: "",
      phone: "",
      verificationCode: "",
      loaderText: "",
      confirmationResult: null,
      userAccounts: ["Personal", "Brand"],
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
  componentDidMount = () => {
    // const { routeName } = this.props.navigation.state;
    const routeName = this.props.route.name;

    if (routeName === "Signup") {
      auth().onAuthStateChanged((user) => {
        if (user) {
          var providerId = user.providerData[0].providerId;

          if (providerId === "phone") {
            return;
          }
          // this.props.getUser(user.uid, "LOGIN");
          if (this.props.user != null) {
            this.props.navigation.goBack();
            // this.props.navigation.navigate("Home");
            // this.props.navigation.replace("Home");
            this.props.navigation.replace("HomeScreen");

            // this.props.navigation.replace("HomeScreen");

            this.props.navigation.navigate("WelcomeScreen");
          }
        }
      });
    }
  };

  beginDel = async () => {
    /* this.props.deleteAllPosts() */
    await this.props.deleteUser();
    await this.props.deleteAuth();
    auth().signOut();
    this.props.navigation.navigate("Splash");
  };

  onPressDel = () => {
    Alert.alert(
      "Delete Account?",
      "Press OK to Delete. This action is irreversible, it cannot be undone. This will not delete your posts.",
      [
        {
          text: "Cancel",
          onPress: () => alert("Cancelled"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.beginDel() },
      ],
      { cancelable: false }
    );
  };

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
  onPress = async (type = "") => {
    // this.props.signupWithPhoneNumber("", this.props.navigation, "", "");
    // return;
    // const { routeName } = this.props.navigation.state;
    const routeName = this.props.route.name;

    // if (routeName === "Signup") {
    //   if (
    //     isEmailValid(this.props.user.email) &&
    //     isNotEmpty("username", this.props.user.username)
    //   ) {
    if (routeName === "Signup") {
      if (isNotEmpty("username", this.props.user.username)) {
        if (this.state.loginMode === "email") {
          if (!isPassValid(this.props.user.password)) {
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
      }
    } else {
      if (!this.props.user.photo) {
        showMessage({
          message: "STOP",
          description: "Please select an profile image",
          type: "danger",
          duration: 3000,
        });
        return;
      }

      if (this.props.user.bio || this.props.user.websiteLabel) {
        if (!this.props.user.bio) {
          showMessage({
            message: "STOP",
            description: "Please add website link for the website title",
            type: "danger",
            duration: 2000,
          });
          return;
        }

        if (!validURL(this.props.user.bio)) {
          showMessage({
            message: "STOP",
            description: "Please add valid website link",
            type: "danger",
            duration: 2000,
          });
          return;
        }

        if (!this.props.user.websiteLabel) {
          showMessage({
            message: "STOP",
            description: "Please add website title for the website link",
            type: "danger",
            duration: 2000,
          });
          return;
        }
      }

      if (!this.props.user.accountType) {
        // Default Value
        this.props.updateAccountType("Personal");
      }

      this.props.updateUser();
      this.props.navigation.goBack();
    }
  };
  async verifyOTP() {
    try {
      this.setState({
        showLoading: true,
        loaderText: "Verifying verification code, Please wait....",
      });
      const response = await this.state.confirmationResult.confirm(
        this.state.verificationCode
      );
      const { additionalUserInfo, user } = response;

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
  cropImage = async (selectedImage) => {
    // alert(JSON.stringify(this.props.post.photo.uri));

    await ImagePicker.openCropper({
      path: selectedImage.path,
      // cropping: true,
      // width: 1200,
      width: width * 1.5,
      height: height * 1.5,
      // width: selectedImage.width,
      // height: selectedImage.height,
      // // height: 1500,

      // compressImageQuality: 0.8,
    })
      .then((image) => {
        console.log(image);
        // alert(JSON.stringify(image));

        // var selectedFile = {};
        // selectedFile.height = image.height;
        // selectedFile.width = image.width;
        // selectedFile.size = image.size;
        // selectedFile.uri = image.path;
        // selectedFile.type = "image";

        this.props.updatePhoto(image.path);
        this.props.updateCompressedPhoto(image.path);

        this.props.createAndUpdatePreview(image.path);
      })
      .catch((err) => {
        // Here you handle if the user cancels or any other errors
      });
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      // const image = await ImagePicker.launchImageLibraryAsync({ quality: 0.1 });
      // if (!image.cancelled) {
      //   this.props.updatePhoto(image.uri);
      //   this.props.createAndUpdatePreview(image.uri);
      // } else {
      // }

      ImagePicker.openPicker({
        compressImageQuality: 0.8,
      }).then((image) => {
        // alert(JSON.stringify(image));
        this.cropImage(image);
        // this.props.updatePhoto(image.path);
        // this.props.createAndUpdatePreview(image.path);
        // console.log(image);
      });
    } else {
      // alert("Denied");

      openSettingsDialog(
        "Failed to Access Photos, Please go to the Settings to enable access",
        this.props.navigation
      );
    }
  };

  onEditProfile = (edit) => {
    // this.setState({ showEditProfile: edit });
  };

  logout = () => {
    auth().signOut();
    this.props.logout();
    showMessage({
      message: "User Logged Out Successfully",
      type: "success",
      duration: 2000,
    });
    // this.props.navigation.navigate("login");
    // this.props.navigation.navigate("Auth");
    this.props.navigation.replace("Auth");
  };
  onSelectHandler(country) {
    const { callingCode, cca2, flag, name } = country;

    this.setState({ countryCode: cca2, callingCode: callingCode });
  }
  render() {
    // const { routeName } = this.props.navigation.state;
    const routeName = this.props.route.name;

    return (
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
        {routeName === "Signup" ? (
          <ImageBackground
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
                  { paddingHorizontal: Scale.moderateScale(24) },
                ]}
              >
                <Image
                  style={style.logo}
                  source={require("../../assets/logoH.png")}
                />
                <Text
                  style={{
                    color: constants.colors.titleColor,
                    width: "80%",
                    fontSize: Scale.moderateScale(40),
                    ...constants.fonts.OswaldSemiBold,
                  }}
                >
                  {`Welcome to Super.!✌`}
                </Text>

                {/* <Item
                  floatingLabel
                  style={[
                    styles.textInput,
                    { marginTop: Scale.moderateScale(40) },
                  ]}
                >
                  <Label style={{ fontWeight: "500" }}>Email</Label>
                  <Input
                    value={this.props.user.email}
                    onChangeText={(input) => this.props.updateEmail(input)}
                  />
                </Item> */}

                {/* <TextInputComponent
                  container={{ marginTop: 32 }}
                  placeholder={"Email"}
                  onChangeText={(input) => this.props.updateEmail(input)}
                  value={this.props.user.email}
                  ref={(ref) => (this.email = ref)}
                  keyboardType="email-address"
                  autoCapitalize={false}
                  returnKeyType="next"
                /> */}

                {/* <Item floatingLabel style={[styles.textInput]}>
                  <Label style={{ fontWeight: "500" }}>Username</Label>
                  <Input
                    value={this.props.user.username}
                    autoCapitalize="none"
                    onChangeText={(input) =>
                      this.props.updateUsername(
                        input.replace(/\s/g, "").toLowerCase()
                      )
                    }
                  />
                </Item> */}

                <TextInputComponent
                  container={{ marginTop: 32, padding: 0 }}
                  textContainer={{ height: 47, paddingHorizontal: 10 }}
                  placeholder={"Username"}
                  onChangeText={(input) =>
                    this.props.updateUsername(
                      input.replace(/\s/g, "").toLowerCase()
                    )
                  }
                  value={this.props.user.username}
                  ref={(ref) => (this.email = ref)}
                  autoCapitalize={false}
                  returnKeyType="next"
                />
                <View
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
                </View>

                <View
                  style={{
                    display: this.state.loginMode === "phone" ? "flex" : "none",
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
                      container={{ flex: 1 }}
                      placeholder={"Phone Number"}
                      onChangeText={(input) => this.setState({ phone: input })}
                      keyboardType={"numeric"}
                      maxLength={15}
                      value={this.state.phone}
                    />
                  </View>

                  <TextInputComponent
                    container={{ marginTop: 16, padding: 0 }}
                    textContainer={{ height: 47, paddingHorizontal: 10 }}
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
                    color={constants.colors.black}
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

                {/* 
                  <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Select account type"
                      // placeholderStyle={{ color: "#bfc6ea" }}
                      // placeholderIconColor="#007aff"
                      selectedValue={this.props.user.accountType}
                      onValueChange={this.onAccountTypeChange.bind(this)}
                    > */}

                {/* <DropDownPicker
                    items={this.state.userAccounts}
                    defaultValue={this.props.user.accountType}
                    containerStyle={{ height: 80, marginTop: 20 }}
                    searchable={false}
                    placeholder={"Add a Location"}
                    style={{ backgroundColor: "grey" }}
                    itemStyle={{
                      justifyContent: "flex-start",
                    }}
                    dropDownStyle={{ backgroundColor: "grey" }}
                    // onChangeItem={this.onAccountTypeChange.bind(this)}
                  /> */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
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
                {/* <Item floatingLabel style={[styles.textInput]}>
                  <Label>Bio</Label>
                  <Input
                    value={this.props.user.bio}
                    onChangeText={(input) => this.props.updateBio(input)}
                  />
                </Item> */}

                {/* <TouchableOpacity
                  style={[styles.buttonSignup, { marginTop: 40 }]}
                  onPress={this.onPress}
                >
                  <Text style={styles.textA}>Signup</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  style={[
                    styles.buttonLogin1,
                    styles.center,
                    {
                      marginTop: 40,
                    },
                  ]}
                  onPress={this.onPress}
                >
                  <Text style={styles.textA}> SIGNUP </Text>
                </TouchableOpacity> */}
                <ButtonComponent
                  title={"Sign Up"}
                  color={constants.colors.white}
                  textStyle={{ fontSize: 16 }}
                  onPress={this.onPress}
                  containerStyle={{
                    width: Scale.moderateScale(250),
                    alignSelf: "center",
                    marginTop: Scale.moderateScale(16),
                  }}
                />
                <TouchableOpacity
                  style={[styles.buttonForgot, { display: "none" }]}
                  onPress={() => {
                    let loginMode = "email";
                    if (this.state.loginMode === "email") loginMode = "phone";

                    this.setState({ loginMode: loginMode });
                  }}
                >
                  <Text
                    style={[styles.textA, { color: constants.colors.black }]}
                  >
                    {this.state.loginMode === "email"
                      ? "By Phone Number"
                      : "By Email"}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={[{ marginTop: 40 }]}
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text style={[styles.textB, { letterSpacing: 0 }]}>
                    BACK TO LOGIN
                  </Text>
                </TouchableOpacity> */}

                <ButtonComponent
                  title={"BACK TO LOGIN"}
                  containerStyle={{
                    width: Scale.moderateScale(160),
                    alignSelf: "center",
                  }}
                  color={constants.colors.black}
                  colors={[
                    constants.colors.transparent,
                    constants.colors.transparent,
                  ]}
                  textStyle={{ fontSize: 16 }}
                  onPress={() => this.props.navigation.navigate("Login")}
                  linearGradientStyle={{
                    paddingHorizontal: Scale.moderateScale(0),
                    // marginHorizontal: Scale.moderateScale(0),
                  }}
                />

                {/* <TouchableOpacity
                  style={[styles.buttonFacebook]}
                  onPress={() => this.onFaceBookLogin()}
                >
                  <Text style={styles.textA}>Signup with Facebook</Text>
                </TouchableOpacity>
                {appleAuth.isSupported && (
                  <AppleButton
                    cornerRadius={5}
                    style={styles.buttonApple}
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_IN}
                    onPress={() => this.appleLoginLogin()}
                  />
                )} */}

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
                      Linking.openURL(
                        "https://www.lllsuperlll.com/terms-of-use"
                      )
                    }
                  >
                    Terms of Use
                  </Text>{" "}
                  and confirm that you have read {appName}'s
                  <Text
                    style={{ color: "blue" }}
                    onPress={() =>
                      Linking.openURL(
                        "https://www.lllsuperlll.com/privacy-policy"
                      )
                    }
                  >
                    {" "}
                    Privacy policy
                  </Text>{" "}
                </Subtitle> */}
              </ScrollView>
            </KeyboardAvoidingView>
            {this.state.showLoading ? showLoader(this.state.loaderText) : null}

            {/* <Image source={require("../assets/logo.png")} resizeMode="center" /> */}
          </ImageBackground>
        ) : (
          <ScrollView>
            <View style={[styles.container, styles.space]}>
              <ProgressiveImage
                thumbnailSource={{
                  uri: this.props.user.preview,
                }}
                source={{ uri: this.props.user.photo }}
                style={[styles.profilePhotoSignup, styles.bottomLine]}
                resizeMode="cover"
              />
              <ImageBackground
                style={[
                  styles.profileEditPhoto,
                  styles.bottomLine,
                  {
                    position: "absolute",
                    justifyContent: "flex-end",
                  },
                ]}
              >
                <View style={[styles.bottom, { width: "100%" }]}>
                  {this.props.user.photo === "" ? (
                    <View
                      style={[
                        styles.center,
                        styles.container,
                        { width: "100%" },
                      ]}
                    >
                      <Button bordered danger onPress={this.openLibrary}>
                        <Text style={{ color: "red" }}>Add Profile Photo</Text>
                      </Button>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.center, { marginBottom: 10 }]}
                  onPress={this.openLibrary}
                >
                  <Text
                    style={[
                      styles.bold,
                      {
                        color: "rgb(237,75,75)",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Change profile photo
                  </Text>
                </TouchableOpacity>
              </ImageBackground>

              {!this.state.showEditProfile ? (
                <TouchableOpacity
                  style={[
                    styles.center,
                    {
                      marginTop: 25,
                    },
                  ]}
                  onPress={() => {
                    this.onEditProfile(true);
                  }}
                >
                  <Text
                    style={[
                      styles.bold,
                      {
                        color: "black",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    EDIT PROFILE
                  </Text>
                </TouchableOpacity>
              ) : null}

              {this.state.showEditProfile ? (
                <View style={{ marginTop: 25 }}>
                  <Item floatingLabel style={[styles.textInput]}>
                    <Label>Username</Label>
                    <Input
                      value={this.props.user.username}
                      autoCapitalize="none"
                      onChangeText={(input) =>
                        this.props.updateUsername(
                          input.replace(/\s/g, "").toLowerCase()
                        )
                      }
                    />
                  </Item>

                  <Item
                    floatingLabel
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Bio</Label>
                    <Input
                      value={this.props.user.userbio}
                      onChangeText={(input) => this.props.updateUserBio(input)}
                    />
                  </Item>

                  <Item
                    inlineLabel
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Password</Label>
                    <Button
                      transparent
                      onPress={() => this.props.navigation.navigate("Reset")}
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      <Text>Reset Password</Text>
                    </Button>
                  </Item>

                  <Item
                    floatingLabel
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Website</Label>
                    <Input
                      value={this.props.user.bio}
                      keyboardType="url"
                      onChangeText={(input) => this.props.updateBio(input)}
                    />
                  </Item>
                  <Item
                    floatingLabel
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Website Label</Label>
                    <Input
                      value={this.props.user.websiteLabel}
                      maxLength={30}
                      onChangeText={(input) =>
                        this.props.updateWebsiteLabel(input)
                      }
                    />
                  </Item>

                  <Item
                    picker
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Account Type: </Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Select account type"
                      // placeholderStyle={{ color: "#bfc6ea" }}
                      // placeholderIconColor="#007aff"
                      selectedValue={this.props.user.accountType}
                      onValueChange={this.onAccountTypeChange.bind(this)}
                    >
                      <Picker.Item label="Personal" value="Personal" />
                      <Picker.Item label="Business" value="Business" />
                    </Picker>
                  </Item>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 15,
                      marginTop: Scale.moderateScale(15),
                      borderBottomWidth: 0.5,
                      borderBottomColor: "black",
                    }}
                    onPress={() =>
                      this.props.navigation.navigate("BlockedUsers")
                    }
                  >
                    <Text style={{ flex: 1 }}>Blocked Accounts </Text>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.bold,
                      {
                        color: "rgb(237,75,75)",
                        margin: 30,
                        alignSelf: "center",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Personal Information
                  </Text>

                  <Item floatingLabel style={[styles.textInput]}>
                    <Label>Email</Label>
                    <Input
                      editable={false}
                      value={this.props.user.email}
                      onChangeText={(input) => this.props.updateEmail(input)}
                    />
                  </Item>

                  <Item
                    floatingLabel
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Phone</Label>
                    <Input
                      value={this.props.user.phone}
                      keyboardType="number-pad"
                      onChangeText={(input) => this.props.updatePhone(input)}
                    />
                  </Item>

                  <Item
                    picker
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Gender: </Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Select your gender"
                      // placeholderStyle={{ color: "#bfc6ea" }}
                      // placeholderIconColor="#007aff"
                      selectedValue={this.props.user.gender}
                      onValueChange={this.onGenderChange.bind(this)}
                    >
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item
                        label="Gender Neutral"
                        value="Gender Neutral"
                      />
                    </Picker>
                  </Item>

                  <Item
                    picker
                    style={[
                      styles.textInput,
                      { marginTop: Scale.moderateScale(15) },
                    ]}
                  >
                    <Label>Birthdate: </Label>

                    <DatePicker
                      style={styles.textInput}
                      // defaultDate={""}
                      defaultDate={
                        this.props.user.dob == undefined ||
                        this.props.user.dob == null
                          ? ""
                          : new Date(this.props.user.dob)
                      }
                      // defaultDate={new Date(this.props.user.dob) }
                      maximumDate={new Date()}
                      locale={"en"}
                      modalVisible={true}
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"default"}
                      // placeHolderText={"sajkdjkasdsajdk"}
                      placeHolderText={
                        this.props.user.dob == undefined ||
                        this.props.user.dob == null
                          ? "Select date of birth"
                          : convertDate(new Date(this.props.user.dob))
                      }
                      textStyle={{ color: "black" }}
                      selectedValue={this.props.user.dob}
                      placeHolderTextStyle={{ color: "black" }}
                      onDateChange={this.onDobChange.bind(this)}
                      disabled={false}
                      ref={(c) => (this.openDatePicker = c)}
                    />
                  </Item>

                  {/* <TouchableOpacity
                    style={[styles.buttonLogin2, { marginTop: 20 }]}
                    onPress={this.onPress}
                  >
                    <Text style={styles.textA}>Save</Text>
                  </TouchableOpacity> */}
                  <View style={styles.smallMargin} />

                  <Button
                    block
                    style={[styles.margin10, { backgroundColor: "#E0E0E0" }]}
                    onPress={this.onPress}
                  >
                    <Text style={styles.textB}>Save</Text>
                  </Button>

                  <Button
                    block
                    light
                    style={styles.margin10}
                    onPress={this.logout}
                  >
                    <Text>Logout</Text>
                  </Button>

                  <Button
                    transparent
                    style={[styles.margin10, styles.center]}
                    onPress={this.onPressDel}
                  >
                    <NText style={styles.textB}>! Delete User !</NText>
                  </Button>
                </View>
              ) : null}
              <View style={{ position: "absolute", top: 0, width: "100%" }}>
                {this.state.showEditProfile ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                    }}
                  >
                    <View>
                      <Button
                        hasText
                        transparent
                        onPress={() => {
                          this.props.navigation.goBack();
                        }}
                      >
                        <Text style={[styles.bold, { color: "white" }]}>
                          CANCEL
                        </Text>
                      </Button>
                    </View>

                    <View>
                      <Button hasText transparent onPress={this.onPress}>
                        <Text style={[styles.bold, { color: "white" }]}>
                          SAVE
                        </Text>
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View style={{ justifyContent: "flex-start" }}>
                    <View>
                      <Button
                        transparent
                        onPress={() => this.props.navigation.goBack()}
                      >
                        <Icon name="arrow-back" />
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
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
