import React from "react";
import styles from "../styles";
import {
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  Image
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { passwordResetEmail, updateEmail } from "../actions/user";
import { Ionicons } from "@expo/vector-icons";
import { isEmpty, isEmailValid } from "../validations/Validation";
import { Item, Icon, Input, Label, DatePicker } from "native-base";

class Reset extends React.Component {

  onResetPress = () => {
    if (isEmailValid(this.props.user.email)) {
      this.props.passwordResetEmail();
      // this.props.navigation.goBack();
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
            style={[styles.tintGreen]}
            contentContainerStyle={styles.center}
          >
            <Image
              style={[styles.logo3]}
              source={require("../assets/logo-2.png")}
            />
             <Item floatingLabel style={[styles.textInput,{marginTop:30}]}>
              <Icon name="ios-person" style={{ color: "#ffffff" }} />
              <Label style={{ color: "#ffffff" }}>Email</Label>
              <Input
                style={{ color: "#ffffff" }}
                value={this.props.user.email}
                onChangeText={input => this.props.updateEmail(input)}
              />
            </Item>
 
            <TouchableOpacity
              style={[styles.buttonReset, { marginTop: 60 }]}
              onPress={this.onResetPress}
            >
              <Text style={styles.textA}>Send Reset Email</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ passwordResetEmail, updateEmail }, dispatch);
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reset);

{
  /* <TextInput
              style={[styles.border4, styles.textB, { marginTop: 30 }]}
              onChangeText={(input) => this.setState({ input })}
              value={this.state.input}
              placeholder='email'
              placeholderTextColor='rgb(75,75,75)'
            /> */
}
