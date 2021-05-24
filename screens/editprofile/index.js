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
import Scale, { moderateScale } from "../../helpers/Scale";
import TextInputComponent from "../../component/TextInputComponent";
import ButtonComponent from "../../component/ButtonComponent";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "../../component/radiobutton";
import { buildPreview } from "../../component/BuildingPreview";
import FastImage from "react-native-fast-image";
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
  SafeAreaView,
  KeyboardAvoidingView,
  Linking,
  Alert,
} from "react-native";
import {
  updatePhoto,
  updateBgImage,
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

var radio_props = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
];
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
      value: 0,
      verificationCode: "",
      loaderText: "",
      user: {},
      confirmationResult: null,
      userAccounts: ["Personal", "Brand"],
    };
  }

  onAccountTypeChange(value) {
    // this.props.updateAccountType(value);

    user.accountType = value;
    this.setState({ user: user });
  }

  onDobChange(value) {
    // this.props.updateDOB(value.getTime());

    user.dob = value.getTime();
    this.setState({ user: user });
  }
  componentDidMount = () => {
    // alert("Called");
    this.setState({ user: { ...this.props.user } });
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

  onPress = async (type = "") => {
    const user = this.state.user;

    if (!user.photo) {
      showMessage({
        message: "STOP",
        description:
          user.accountType == "Brand"
            ? "Please upload brand logo"
            : "Please select an profile image",
        type: "danger",
        duration: 3000,
      });
      return;
    }

    if (user.bio || user.websiteLabel) {
      if (!user.bio) {
        showMessage({
          message: "STOP",
          description: "Please add website link for the website title",
          type: "danger",
          duration: 2000,
        });
        return;
      }

      if (!validURL(user.bio)) {
        showMessage({
          message: "STOP",
          description: "Please add valid website link",
          type: "danger",
          duration: 2000,
        });
        return;
      }

      if (!user.websiteLabel) {
        showMessage({
          message: "STOP",
          description: "Please add website title for the website link",
          type: "danger",
          duration: 2000,
        });
        return;
      }
    }

    // if (!user.accountType) {
    //   // Default Value
    //   this.props.updateAccountType("Personal");
    // }

    this.props.updateUser(user);
    this.props.navigation.goBack();
  };

  cropImage = async (selectedImage, type) => {
    await ImagePicker.openCropper({
      path: selectedImage.path,

      width: width * 1.5,
      height: width * 1.5 * 1.6,
    })
      .then(async (image) => {
        console.log(image);
        var user = this.state.user;
        if (type === "bgImage") {
          // this.props.updateBgImage(image.path);
          user.bgImage = image.path;
          var imagePreview = await buildPreview(image.path, 50, 50);
          var imageData = "data:image/jpeg;base64," + imagePreview.base64;
          user.backgroundPreview = imageData;
          this.setState({ user: user });
        } else {
          // this.props.updatePhoto(image.path);
          // this.props.updateCompressedPhoto(image.path);

          var imagePreview = await buildPreview(image.path, 50, 50);
          var imageData = "data:image/jpeg;base64," + imagePreview.base64;
          user.photo = image.path;
          user.preview = imageData;
          this.setState({ user: user });

          // this.props.createAndUpdatePreview(image.path);
        }
      })
      .catch((err) => {
        // Here you handle if the user cancels or any other errors
      });
  };

  openLibrary = async (type = null) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      ImagePicker.openPicker({
        compressImageQuality: 0.8,
        mediaType: "photo",
      }).then((image) => {
        var user = this.state.user;

        if (this.props.user.accountType == "Brand" && type !== "bgImage") {
          // this.props.updatePhoto(image.path);
          // this.props.updateCompressedPhoto(image.path);

          // alert(JSON.stringify(image));

          user.photo = image.sourceURL;
          user.preview = "";
          this.setState({ user: user });
        } else {
          this.cropImage(image, type);
        }
      });
    } else {
      openSettingsDialog(
        "Failed to Access Photos, Please go to the Settings to enable access",
        this.props.navigation
      );
    }
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

  render() {
    var user = this.state.user;
    const { params } = this.props.route;

    return (
      // <SafeAreaView style={[style.container, { backgroundColor: "red" }]}>
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, styles.space]}>
          <View>
            <ProgressiveImage
              source={{
                uri:
                  this.props.user.accountType == "Brand"
                    ? user.bgImage
                    : user.photo,
              }}
              // style={{ width: width, height: Scale.moderateScale(500) }}
              style={[styles.profilePhoto]}
              resizeMode="cover"
              thumbnailSource={{
                uri:
                  this.props.user.accountType == "Brand"
                    ? user.backgroundPreview
                    : user.preview,
              }}
              transparentBackground="transparent"
            />

            <View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <ProgressiveImage
                source={{
                  uri: this.props.user.accountType == "Brand" ? user.photo : "",
                }}
                resizeMode={
                  this.props.user.accountType == "Brand" ? "contain" : "cover"
                }
                transparentBackground="transparent"
                style={[
                  ,
                  {
                    height: Scale.moderateScale(150),
                    width: Scale.moderateScale(150),
                    borderRadius: Scale.moderateScale(75),
                  },
                ]}
              />
              <Text
                style={[
                  styles.title1,
                  {
                    color: "#fff",
                    alignSelf: "center",
                    marginVertical: Scale.moderateScale(8),
                    shadowOpacity: 0.4,
                  },
                ]}
              >
                {user.username}
              </Text>

              <Text
                style={[
                  styles.textNormal,
                  {
                    color: "#fff",
                    alignSelf: "center",
                    shadowOpacity: 0.4,
                    fontWeight: "600",
                  },
                ]}
              >
                {user.userbio}
              </Text>

              <ButtonComponent
                title={
                  this.props.user.accountType == "Brand"
                    ? user.photo
                      ? "Change brand Logo"
                      : "Add Brand Logo"
                    : user.photo
                    ? "Change profile picture"
                    : "Add profile picture"
                }
                color={constants.colors.superRed}
                colors={["#FFEBEE", "#FFEBEE"]}
                onPress={this.openLibrary}
                textStyle={{ fontSize: 16 }}
                containerStyle={{
                  width: Scale.moderateScale(200),
                  marginTop: Scale.moderateScale(8),
                }}
                linearGradientStyle={{ height: Scale.moderateScale(50) }}
              />
              {this.props.user.accountType == "Brand" && (
                <ButtonComponent
                  title={
                    user.bgImage
                      ? "Change background image"
                      : "Add background image"
                  }
                  color={constants.colors.superRed}
                  colors={["#FFEBEE", "#FFEBEE"]}
                  onPress={() => this.openLibrary("bgImage")}
                  textStyle={{ fontSize: 16 }}
                  containerStyle={{
                    width: Scale.moderateScale(200),
                    marginTop: Scale.moderateScale(16),
                  }}
                  linearGradientStyle={{ height: Scale.moderateScale(50) }}
                />
              )}
            </View>
          </View>

          <View
            style={[
              styles.row,
              styles.space,
              styles.followBar,
              styles.bottomgreyborder,
              styles.topgreyborder,
              {
                paddingVertical: 16,
                justifyContent: "space-between",
                backgroundColor: "transparent",
                marginVertical: Scale.moderateScale(16),
                // paddingBottom: Scale.moderateScale(14),
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.center, {}]}
              onPress={() => {
                this.props.navigation.navigate("MyFollowersAndFollowing", {
                  data: "Followers",
                  route: params.routeName,
                  user: user,
                });
              }}
            >
              <Text
                style={[
                  styles.bold,
                  styles.textF,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {user.followers && user.followers.length
                  ? user.followers.length
                  : "0"}
              </Text>
              <Text style={[styles.grey]}> Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.center, {}]}
              onPress={() => {
                this.props.navigation.navigate("MyFollowersAndFollowing", {
                  data: "Following",
                  route: params.routeName,
                  user: user,
                });
              }}
            >
              <Text
                style={[
                  styles.bold,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {user.following && user.following.length
                  ? user.following.length
                  : "0"}
              </Text>
              <Text style={[styles.grey]}> Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.center, {}]}>
              <Text
                style={[
                  styles.bold,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {"-"}
              </Text>
              <Text style={[styles.grey]}> Posts</Text>
            </TouchableOpacity>
          </View>
          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={
              this.props.user.accountType == "Brand" ? "Brand Name" : "Name"
            }
            title={
              this.props.user.accountType == "Brand" ? "Brand Name" : "Name"
            }
            textContainer={style.textInputBackground}
            value={user.username}
            onChangeText={(input) => {
              // this.props.updateUsername(
              //   input.replace(/\s/g, "").toLowerCase()
              // )
              user.username = input.replace(/\s/g, "").toLowerCase();
              this.setState({ user: user });
            }}
            autoCapitalize={false}
            returnKeyType="next"
          />

          {this.props.user.accountType == "Brand" && (
            <TextInputComponent
              container={{ marginTop: Scale.moderateScale(0) }}
              placeholder={"Representative Name"}
              title={"Representative Name"}
              textContainer={style.textInputBackground}
              value={user.representativeName}
              onChangeText={(input) => {
                // this.props.updateRepresentativeName(input);
                user.representativeName = input;
                this.setState({ user: user });
              }}
            />
          )}

          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={"Bio"}
            title={"Bio"}
            value={user.userbio}
            onChangeText={(input) => {
              // this.props.updateUserBio(input);
              user.userbio = input;
              this.setState({ user: user });
            }}
            autoCapitalize={false}
            returnKeyType="next"
            textContainer={style.textInputBackground}
            multiline={true}
            numberOfLines={7}
            textAlignVertical={"top"}
          />
          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={"Website Label"}
            title={"Website Label"}
            value={user.websiteLabel}
            textContainer={style.textInputBackground}
            maxLength={30}
            onChangeText={(input) => {
              // this.props.updateWebsiteLabel(input);
              user.websiteLabel = input;
              this.setState({ user: user });
            }}
            autoCapitalize={false}
            returnKeyType="next"
          />
          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={"Website"}
            title={"Website"}
            value={user.bio}
            maxLength={30}
            textContainer={style.textInputBackground}
            onChangeText={(input) => {
              // this.props.updateBio(input);
              user.bio = input;
              this.setState({ user: user });
            }}
            autoCapitalize={false}
            returnKeyType="next"
          />

          {this.props.user.accountType == "Personal" && (
            <View>
              <Text
                style={{
                  fontSize: Scale.moderateScale(12),
                  color: constants.colors.primary,
                  alignSelf: "flex-start",
                  padding: Scale.moderateScale(20),
                }}
              >
                {"Gender"}
              </Text>
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingHorizontal: Scale.moderateScale(20),
                }}
              >
                <RadioForm
                  radio_props={radio_props}
                  initial={0}
                  initial={user.gender === "Male" ? 0 : 1}
                  formHorizontal={true}
                  labelHorizontal={true}
                  animation={true}
                  // style={{ paddingHorizontal: 10 }}
                  labelStyle={{ paddingHorizontal: 20 }}
                  onPress={(value) => {
                    // this.props.updateGender(value === 0 ? "Male" : "Female");
                    user.gender = value === 0 ? "Male" : "Female";
                    this.setState({ user: user });
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: Scale.moderateScale(12),
                  color: constants.colors.primary,
                  alignSelf: "flex-start",
                  paddingHorizontal: Scale.moderateScale(20),
                  paddingVertical: Scale.moderateScale(6),
                  marginTop: Scale.moderateScale(8),
                }}
              >
                {"Birth Date"}
              </Text>

              <View
                style={[
                  style.textInputBackground,
                  {
                    marginBottom: Scale.moderateScale(10),
                    borderRadius: Scale.moderateScale(5),
                    height: Scale.moderateScale(40),
                    width: width - Scale.moderateScale(30),
                  },
                ]}
              >
                <DatePicker
                  style={styles.textInput}
                  // defaultDate={""}
                  defaultDate={
                    user.dob == undefined || user.dob == null
                      ? ""
                      : new Date(user.dob)
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
                    user.dob == undefined || user.dob == null
                      ? "Select date of birth"
                      : convertDate(new Date(user.dob))
                  }
                  textStyle={{
                    color: "black",
                    fontSize: Scale.moderateScale(14),
                  }}
                  selectedValue={user.dob}
                  placeHolderTextStyle={{
                    color: "black",
                    fontSize: Scale.moderateScale(14),
                  }}
                  onDateChange={this.onDobChange.bind(this)}
                  disabled={false}
                  ref={(c) => (this.openDatePicker = c)}
                />
              </View>
            </View>
          )}

          <Text
            style={{
              fontSize: Scale.moderateScale(12),
              color: constants.colors.primary,
              alignSelf: "flex-start",
              paddingHorizontal: Scale.moderateScale(20),
              paddingVertical: Scale.moderateScale(6),
              marginTop: Scale.moderateScale(8),
            }}
          >
            {"Account Type"}
          </Text>
          <View
            style={[
              style.textInputBackground,
              {
                justifyContent: "center",
                // alignItems: "center",
                marginBottom: 10,
                borderRadius: 5,
                height: Scale.moderateScale(40),
                width: width - Scale.moderateScale(30),
              },
            ]}
          >
            <Picker
              mode="dropdown"
              style={{ width: 200 }}
              placeholder="Select account type"
              iosHeader="Account Type"
              enabled={false}
              placeholderStyle={{ fontSize: Scale.moderateScale(14) }}
              // placeholderIconColor="#007aff"
              textStyle={{
                fontSize: Scale.moderateScale(14),
              }}
              selectedValue={user.accountType}
              onValueChange={this.onAccountTypeChange.bind(this)}
            >
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Brand" value="Brand" />
            </Picker>
          </View>

          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={"Email"}
            title={"Email"}
            textContainer={style.textInputBackground}
            onChangeText={(input) => {
              // this.props.updateEmail(input);
              user.email = input;
              this.setState({ user: user });
            }}
            value={user.email}
            ref={(ref) => (this.email = ref)}
            keyboardType="email-address"
            autoCapitalize={false}
            returnKeyType="next"
          />

          <TextInputComponent
            container={{ marginTop: Scale.moderateScale(0) }}
            placeholder={"Phone Number"}
            title={"Phone Number"}
            keyboardType={"numeric"}
            maxLength={15}
            editable={false}
            textContainer={style.textInputBackground}
            value={user.phone}
            onChangeText={(input) => {
              user.phone = input;
              this.setState({ user: user });

              // this.props.updatePhone(input);
            }}
          />

          <View
            style={{
              flexDirection: "row",
              marginTop: Scale.moderateScale(24),
              justifyContent: "space-between",
            }}
          >
            <ButtonComponent
              title={"Blocked Contacts"}
              containerStyle={{
                width: Scale.moderateScale(150),
                alignSelf: "flex-end",
              }}
              color={constants.colors.superRed}
              colors={[
                constants.colors.transparent,
                constants.colors.transparent,
              ]}
              textStyle={{ fontSize: 16 }}
              onPress={() => this.props.navigation.navigate("BlockedUsers")}
              linearGradientStyle={{
                paddingHorizontal: Scale.moderateScale(0),
                // marginHorizontal: Scale.moderateScale(0),
              }}
            />
            <ButtonComponent
              title={"Save"}
              color={constants.colors.white}
              textStyle={{ fontSize: 16 }}
              onPress={this.onPress}
              containerStyle={{
                width: Scale.moderateScale(150),
                alignSelf: "center",
              }}
            />
          </View>

          <ButtonComponent
            title={"Reset Password"}
            color={constants.colors.superRed}
            colors={["#FFEBEE", "#FFEBEE"]}
            textStyle={{ fontSize: 16 }}
            onPress={() => this.props.navigation.navigate("Reset")}
            containerStyle={{
              width: width - Scale.moderateScale(30),
              alignSelf: "center",
              marginTop: Scale.moderateScale(24),
            }}
          />
          <ButtonComponent
            title={"Logout"}
            color={constants.colors.superRed}
            colors={["#FFEBEE", "#FFEBEE"]}
            textStyle={{ fontSize: 16 }}
            onPress={this.logout}
            containerStyle={{
              width: width - Scale.moderateScale(30),
              alignSelf: "center",
              marginTop: Scale.moderateScale(24),
            }}
          />
          <ButtonComponent
            title={"Delete Account"}
            color={constants.colors.superRed}
            colors={[
              constants.colors.transparent,
              constants.colors.transparent,
            ]}
            textStyle={{ fontSize: 16 }}
            onPress={this.onPressDel}
            containerStyle={{
              width: width - Scale.moderateScale(30),
              alignSelf: "center",
              marginTop: Scale.moderateScale(24),
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      // </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePhoto,
      updateBgImage,
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
