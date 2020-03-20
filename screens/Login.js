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
  ScrollView
} from "react-native";
import {
  updateEmail,
  updatePassword,
  login,
  getUser,
  facebookLogin
} from "../actions/user";
import { Ionicons } from "@expo/vector-icons";
import { showLoader } from "../util/Loader";
// import Toast from "react-native-tiny-toast";
import { isNotEmpty, isEmailValid } from "../validations/Validation";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Item, Icon, Input, Label, DatePicker } from "native-base";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.getUser(user.uid, "LOGIN");
        if (this.props.user != null) {
          this.props.navigation.navigate("Home");
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

  render() {
    return (
      <ImageBackground
        source={require("../temp/loginBG.png")}
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
              style={styles.logo3}
              source={require("../assets/logo-2.png")}
            />

            <Item floatingLabel style={[styles.textInput]}>
              <Icon name="ios-person" style={{ color: "#ffffff" }} />
              <Label style={{ color: "#ffffff" }}>Email</Label>
              <Input
                style={{ color: "#ffffff" }}
                value={this.props.user.email}
                onChangeText={input => this.props.updateEmail(input)}
              />
            </Item>

            <Item floatingLabel style={[styles.textInput]}>
              <Icon name="ios-key" style={{ color: "#ffffff" }} />
              <Label style={{ color: "#ffffff" }}>Password</Label>
              <Input
                style={{ color: "#ffffff" }}
                value={this.props.user.password}
                onChangeText={input => this.props.updatePassword(input)}
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
            <TouchableOpacity
              style={styles.buttonFacebook}
              onPress={() => this.props.facebookLogin()}
            >
              <Text style={styles.textA}>Login with Facebook</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateEmail, updatePassword, login, getUser, facebookLogin },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
