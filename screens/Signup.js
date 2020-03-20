import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import {
  updatePhoto,
  updateEmail,
  updatePassword,
  updateUsername,
  updateBio,
  signup,
  updateUser,
  facebookLogin,
  deleteAuth,
  deleteAllPosts,
  deleteUser,
  updatePhone,
  updateGender,
  updateDOB,
  createAndUpdatePreview
} from "../actions/user";
import { uploadPhoto } from "../actions";
import firebase from "firebase";
import {
  isNotEmpty,
  isEmailValid,
  isPassValid
} from "../validations/Validation";
import { Item, Input, Icon, Label, DatePicker, Picker } from "native-base";
import { convertDate } from "../util/DateFormater";
import ProgressiveImage from "../component/ProgressiveImage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { showLoader } from "../util/Loader";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false
    };
  }

  onGenderChange(value) {
    this.props.updateGender(value);
  }
  onDobChange(value) {
    this.props.updateDOB(value.getTime());
  }
  componentDidMount = () => {
    const { routeName } = this.props.navigation.state;

    /* console.log(routeName) */
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
          style: "cancel"
        },
        { text: "OK", onPress: () => this.beginDel() }
      ],
      { cancelable: false }
    );
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

        await this.props.signup();
        this.setState({ showLoading: false });

        this.props.navigation.navigate("Edit");
      }
    } else {
      if (!this.props.user.photo) {
        showMessage({
          message: "STOP",
          description: "Please select an profile image",
          type: "danger",
          duration: 3000
        });
        return;
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

  render() {
    const { routeName } = this.props.navigation.state;
    return (
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
        {routeName === "Signup" ? (
          <ImageBackground
            source={require("../temp/signupBG.png")}
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
                  style={styles.logo2}
                  source={require("../assets/logo-2.png")}
                />

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Email</Label>
                  <Input
                    value={this.props.user.email}
                    onChangeText={input => this.props.updateEmail(input)}
                  />
                </Item>

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Password</Label>
                  <Input
                    value={this.props.user.password}
                    onChangeText={input => this.props.updatePassword(input)}
                    secureTextEntry={true}
                  />
                </Item>

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Username</Label>
                  <Input
                    value={this.props.user.username}
                    onChangeText={input => this.props.updateUsername(input)}
                  />
                </Item>

                <Item floatingLabel style={[styles.textInput]}>
                  <Label>Bio</Label>
                  <Input
                    value={this.props.user.bio}
                    onChangeText={input => this.props.updateBio(input)}
                  />
                </Item>

                <TouchableOpacity
                  style={[styles.buttonSignup, { marginTop: 60 }]}
                  onPress={this.onPress}
                >
                  <Text style={styles.textA}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonFacebook]}
                  onPress={() => this.props.facebookLogin()}
                >
                  <Text style={styles.textA}>Signup with Facebook</Text>
                </TouchableOpacity>
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
                  uri: this.props.user.preview
                }}
                source={{ uri: this.props.user.photo }}
                style={[styles.profileEditPhoto, styles.bottomLine]}
                resizeMode="cover"
              />
              <ImageBackground
                style={[
                  styles.profileEditPhoto,
                  styles.bottomLine,
                  { position: "absolute", justifyContent: "flex-end" }
                ]}
              >
                <TouchableOpacity
                  style={[styles.center, { marginBottom: 30 }]}
                  onPress={this.openLibrary}
                >
                  <Text
                    style={[
                      styles.bold,
                      {
                        color: "rgb(237,75,75)",
                        textDecorationLine: "underline"
                      }
                    ]}
                  >
                    Change profile photo
                  </Text>
                </TouchableOpacity>
              </ImageBackground>

              <Item floatingLabel style={[styles.textInput]}>
                <Label>Username</Label>
                <Input
                  value={this.props.user.username}
                  onChangeText={input => this.props.updateUsername(input)}
                />
              </Item>

              <Item floatingLabel style={[styles.textInput]}>
                <Label>Bio</Label>
                <Input
                  value={this.props.user.bio}
                  onChangeText={input => this.props.updateBio(input)}
                />
              </Item>

              <Item floatingLabel style={[styles.textInput]}>
                <Label>Email</Label>
                <Input
                  editable={false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                />
              </Item>

              <Item floatingLabel style={[styles.textInput]}>
                <Label>Phone</Label>
                <Input
                  value={this.props.user.phone}
                  keyboardType="number-pad"
                  onChangeText={input => this.props.updatePhone(input)}
                />
              </Item>

              <Item picker style={[styles.textInput]}>
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
                </Picker>
              </Item>

              <Item picker style={[styles.textInput]}>
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
                  ref={c => (this.openDatePicker = c)}
                />
              </Item>

              <TouchableOpacity
                style={[styles.buttonLogin2, { marginTop: 20 }]}
                onPress={this.onPress}
              >
                <Text style={styles.textA}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonDelete, { marginBottom: 25 }]}
                onPress={this.onPressDel}
              >
                <Text style={styles.textA}>! Delete User !</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updatePhoto,
      uploadPhoto,
      updateUser,
      updateEmail,
      updatePassword,
      updateUsername,
      updateBio,
      signup,
      facebookLogin,
      deleteAuth,
      deleteAllPosts,
      deleteUser,
      updatePhone,
      updateGender,
      updateDOB,
      createAndUpdatePreview
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
