import React from "react";
import styles from "../styles";
import firebase from "firebase";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
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
} from "react-native";
import {
  updateEmail,
  updatePassword,
  login,
  getUser,
  facebookLogin,
  appleLogin,
} from "../actions/user";
import { Ionicons } from "@expo/vector-icons";
import { showLoader } from "../util/Loader";
// import Toast from "react-native-tiny-toast";
import { isNotEmpty, isEmailValid } from "../validations/Validation";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Item, Icon, Input, Label, DatePicker, Subtitle } from "native-base";
import { name as appName } from "../app.json";

import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.getUser(user.uid, "LOGIN");
        if (this.props.user != null) {
          this.props.navigation.goBack();
          this.props.navigation.navigate("Home");
          this.props.navigation.navigate("WelcomeScreen");
        }
      }
    });
  };

  onClickLogin = async () => {
    if (
      isEmailValid(this.props.user.email) &&
      isNotEmpty("password", this.props.user.password)
    ) {
      this.setState({ showLoading: true });
      await this.props.login();
      this.setState({ showLoading: false });
    }
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

  render() {
    return (
      <ImageBackground
        source={require("../temp/black-gray-back.png")}
        style={[styles.container, styles.center]}
      >
        <KeyboardAvoidingView style={{ flex: 1, width: "100%" }}>
          <ScrollView
            style={[{ width: "100%" }]}
            contentContainerStyle={[styles.center]}
          >
            <Image
              style={styles.logo3}
              source={require("../assets/logo-2.png")}
            />

            <Item floatingLabel style={[styles.textInput]}>
              <Icon name="ios-person" style={{ color: "#ffffff" }} />
              <Label style={{ color: "#ffffff", fontWeight: "500" }}>
                Email or Username
              </Label>
              <Input
                style={{ color: "#ffffff" }}
                value={this.props.user.email}
                onChangeText={(input) => this.props.updateEmail(input)}
              />
            </Item>

            <Item floatingLabel style={[styles.textInput]}>
              <Icon name="ios-key" style={{ color: "#ffffff" }} />
              <Label style={{ color: "#ffffff", fontWeight: "500" }}>
                Password
              </Label>
              <Input
                style={{ color: "#ffffff" }}
                value={this.props.user.password}
                onChangeText={(input) => this.props.updatePassword(input)}
                secureTextEntry={true}
              />
            </Item>

            <TouchableOpacity
              style={styles.buttonForgot}
              onPress={() => this.props.navigation.navigate("Reset")}
            >
              <Text style={styles.textA}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonLogin, styles.center]}
              onPress={() => this.onClickLogin()}
            >
              <Text style={styles.textA}> Login </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.buttonFacebook}
              onPress={() => this.onFaceBookLogin()}
            >
              <Text style={styles.textA}>Login with Facebook</Text>
            </TouchableOpacity>
            {appleAuth.isSupported && (
              <AppleButton
                cornerRadius={5}
                style={styles.buttonApple}
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                onPress={() => this.appleLoginLogin()}
              />
            )} */}

            <Subtitle
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
            </Subtitle>
          </ScrollView>
        </KeyboardAvoidingView>

        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}

        <Image source={require("../assets/logoW.png")} resizeMode="center" />
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { updateEmail, updatePassword, login, getUser, facebookLogin, appleLogin },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
