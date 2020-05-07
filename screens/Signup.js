import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { validURL } from "../util/Helper";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
  Alert,
} from "react-native";
import {
  updatePhoto,
  updateEmail,
  updatePassword,
  updateUsername,
  updateBio,
  updateWebsiteLabel,
  signup,
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
} from "../actions/user";
import { uploadPhoto } from "../actions";
import firebase from "firebase";
import {
  isNotEmpty,
  isEmailValid,
  isPassValid,
} from "../validations/Validation";
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

import { convertDate } from "../util/DateFormater";
import ProgressiveImage from "../component/ProgressiveImage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { showLoader } from "../util/Loader";
import { name as appName } from "../app.json";

import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      showEditProfile: true,
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
    const { routeName } = this.props.navigation.state;
    if (routeName === "Signup") {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // this.props.getUser(user.uid, "LOGIN");
          if (this.props.user != null) {
            this.props.navigation.goBack();
            this.props.navigation.navigate("Home");
          }
        }
      });
    }
  };

  beginDel = async () => {
    /* this.props.deleteAllPosts() */
    await this.props.deleteUser();
    await this.props.deleteAuth();
    firebase.auth().signOut();
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
  onPress = async () => {
    const { routeName } = this.props.navigation.state;
    if (routeName === "Signup") {
      if (
        isEmailValid(this.props.user.email) &&
        isPassValid(this.props.user.password) &&
        isNotEmpty("username", this.props.user.username)
      ) {
        this.setState({ showLoading: true });
        try {
          this.props.signup();
          // this.props.navigation.goBack();
          //  this.props.navigation.navigate("Home");
        } catch (e) {
          alert(e);
        }
        this.setState({ showLoading: false });
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

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        this.props.updatePhoto(image.uri);
        this.props.createAndUpdatePreview(image.uri);
      } else {
      }
    }
  };

  onEditProfile = (edit) => {
    // this.setState({ showEditProfile: edit });
  };

  logout = () => {
    firebase.auth().signOut();
    this.props.logout();
    showMessage({
      message: "User Logged Out Successfully",
      type: "success",
      duration: 2000,
    });
    this.props.navigation.navigate("login");
  };

  render() {
    const { routeName } = this.props.navigation.state;
    return (
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
        {routeName === "Signup" ? (
          <ImageBackground
            source={require("../temp/white-grey-back.png")}
            style={[styles.container, styles.center]}
          >
            <KeyboardAvoidingView
              style={{ flex: 1, width: "100%" }}
              behavior={"padding"}
            >
              <ScrollView
                style={[{ width: "100%" }]}
                contentContainerStyle={[styles.center]}
              >
                <Image
                  style={[styles.logo2]}
                  source={require("../assets/logo-2.png")}
                />

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Email</Label>
                  <Input
                    value={this.props.user.email}
                    onChangeText={(input) => this.props.updateEmail(input)}
                  />
                </Item>

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Password</Label>
                  <Input
                    value={this.props.user.password}
                    onChangeText={(input) => this.props.updatePassword(input)}
                    secureTextEntry={true}
                  />
                </Item>

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Username</Label>
                  <Input
                    value={this.props.user.username}
                    onChangeText={(input) => this.props.updateUsername(input)}
                  />
                </Item>

                {/* <Item floatingLabel style={[styles.textInput]}>
                  <Label>Bio</Label>
                  <Input
                    value={this.props.user.bio}
                    onChangeText={(input) => this.props.updateBio(input)}
                  />
                </Item> */}

                <TouchableOpacity
                  style={[styles.buttonSignup, { marginTop: 40 }]}
                  onPress={this.onPress}
                >
                  <Text style={styles.textA}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity
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
                )}

                <Subtitle
                  style={{
                    textAlign: "center",
                    margin: 10,
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
                </Subtitle>
              </ScrollView>
            </KeyboardAvoidingView>
            {this.state.showLoading
              ? showLoader("Loading, Please wait... ")
              : null}
          </ImageBackground>
        ) : (
          <ScrollView>
            <View style={[styles.container, styles.space]}>
              <ProgressiveImage
                thumbnailSource={{
                  uri: this.props.user.preview,
                }}
                source={{ uri: this.props.user.photo }}
                style={[styles.profilePhoto, styles.bottomLine]}
                resizeMode="cover"
              />
              <ImageBackground
                style={[
                  styles.profileEditPhoto,
                  styles.bottomLine,
                  { position: "absolute", justifyContent: "flex-end" },
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
              </ImageBackground>

              <TouchableOpacity
                style={[
                  styles.center,
                  {
                    marginTop: 25,
                  },
                ]}
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
                      onChangeText={(input) => this.props.updateUsername(input)}
                    />
                  </Item>

                  <Item
                    inlineLabel
                    style={[styles.textInput, { marginTop: 10 }]}
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
                    style={[styles.textInput, { marginTop: 10 }]}
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
                    style={[styles.textInput, { marginTop: 10 }]}
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

                  <Item picker style={[styles.textInput, { marginTop: 10 }]}>
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
                    style={[styles.textInput, { marginTop: 10 }]}
                  >
                    <Label>Phone</Label>
                    <Input
                      value={this.props.user.phone}
                      keyboardType="number-pad"
                      onChangeText={(input) => this.props.updatePhone(input)}
                    />
                  </Item>

                  <Item picker style={[styles.textInput, { marginTop: 10 }]}>
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

                  <Item picker style={[styles.textInput, { marginTop: 10 }]}>
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
                  <Header transparent>
                    <Left>
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
                    </Left>

                    <Right>
                      <Button hasText transparent onPress={this.onPress}>
                        <Text style={[styles.bold, { color: "white" }]}>
                          SAVE
                        </Text>
                      </Button>
                    </Right>
                  </Header>
                ) : (
                  <Header transparent>
                    <Left>
                      <Button
                        transparent
                        onPress={() => this.props.navigation.goBack()}
                      >
                        <Icon name="arrow-back" />
                      </Button>
                    </Left>
                  </Header>
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
      uploadPhoto,
      updateUser,
      updateEmail,
      updatePassword,
      updateUsername,
      updateBio,
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
