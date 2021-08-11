import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Subtitle,
  Footer,
} from "native-base";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import ButtonComponent from "../component/ButtonComponent";
import appleAuth, {
  AppleButton,
} from "@invertase/react-native-apple-authentication";

import { name as appName } from "../app.json";
import Scale from "../helpers/Scale.js";
// import { TouchableOpacity } from "react-native-gesture-handler";
import constants from "../constants";
const { height, width } = Dimensions.get("window");

// var createReactClass = require('create-react-class');

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: constants.colors.appBackgroundColor,
    justifyContent: "center",
    padding: Scale.moderateScale(16),
    // paddingTop: Scale.moderateScale(60),
    // alignItems: "center",
  },
  global: {
    marginBottom: Scale.moderateScale(20),
  },
  image: {
    width: Scale.moderateScale(250),
    height: Scale.moderateScale(250),
  },
  title: {
    fontSize: Scale.moderateScale(20),
    marginTop: Scale.moderateScale(16),
    letterSpacing: 1,
    marginLeft: Scale.moderateScale(8),
    color: constants.colors.white,
  },
  desc: {
    width: 280,
    textAlign: "center",
  },
  button: {
    color: "white",
    fontSize: Scale.moderateScale(32),
    ...constants.fonts.OswaldSemiBold,
  },
});

module.exports = createReactClass({
  propTypes: {
    showIf: PropTypes.bool.isRequired,
    view: PropTypes.node.isRequired,
    image: PropTypes.any, // TODO: validate Image type
    title: PropTypes.node,
    desc: PropTypes.node,
    button: PropTypes.object,
    navigation: PropTypes.any, // TODO: validate Image type
    background: PropTypes.string, // TODO: validate colors
  },

  openSheet() {
    this.RBSheet.open();
  },
  render() {
    if (!this.props.showIf) {
      return (
        <View style={styles.container}>
          {this._getElement("image")}

          <Image
            style={[
              styles.logoHeader,
              {
                width: Scale.moderateScale(240),
                height: Scale.moderateScale(90),
                transform: [{ scale: 1 }],
                marginTop: Scale.moderateScale(20),
                marginLeft: Scale.moderateScale(-30),
                tintColor: constants.colors.white,
              },
            ]}
            source={require("../assets/logo.png")}
            resizeMode="contain"
          />
          {this._getElement("title")}
          {this._getElement("icon")}
          {this._getElement("desc")}
          {!this.props.userId && this._getElement("button")}
          {!this.props.userId && this._getElement("textButton")}
          {/* {this._getElement("navigation")} */}
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            height={height * 0.8}
            flow="resume"
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center",
              },
            }}
          >
            <Container
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Button transparent onPress={() => this.RBSheet.close()}>
                    <Ionicons name="ios-close" size={32} />
                  </Button>
                </View>

                <View>
                  <Button transparent>
                    <Ionicons name="ios-help-circle-outline" size={32} />
                  </Button>
                </View>
              </View>
              <Title style={{ color: "black" }}>Sign up for {appName} </Title>
              <Subtitle
                style={{ textAlign: "center", margin: 15, color: "gray" }}
              >
                Create a profile, follow other accounts, make your own videos,
                and more{" "}
              </Subtitle>

              <View style={{ margin: 20, flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    block
                    bordered
                    iconLeft
                    onPress={() => {
                      this.RBSheet.close();
                      this.props.navigation.navigate("Login");
                    }}
                  >
                    {/* <Ionicons size={24} name="md-person" />
Login
Signup
                    <Text style={{ marginLeft: 20 }}>Use phone or email</Text> */}
                    <Text style={{ fontWeight: "500" }}>L O G I N</Text>
                  </Button>
                  <Button
                    block
                    bordered
                    iconLeft
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      this.RBSheet.close();
                      this.props.navigation.navigate("Signup");
                    }}
                  >
                    {/* <Ionicons size={24} name="md-person" />

                    <Text style={{ marginLeft: 20 }}>
                      Login with phone or email
                    </Text> */}
                    <Text style={{ fontWeight: "500" }}>S I G N U P</Text>
                  </Button>
                  {/* <Button
                    block
                    bordered
                    iconLeft
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      this.RBSheet.close();
                      this.props.navigation.navigate("Signup");
                    }}
                  >
                    <View>
                      <Entypo
                        style={{ color: "#3b5998" }}
                        name="facebook-with-circle"
                        size={24}
                      />
                      <EvilIcons
                        style={{
                          position: "absolute",
                          margin: 2,
                          color: "rgb(255,255,255)",
                        }}
                        name="sc-facebook"
                        size={24}
                      />
                    </View>
                    <Text style={{ marginLeft: 20 }}>
                      Continue with Facebook
                    </Text>
                  </Button>
                  {appleAuth.isSupported && (
                    <AppleButton
                      cornerRadius={5}
                      style={{
                        marginTop: 15,
                        paddingTop: 11,
                        paddingBottom: 11,
                        width: width - 40,
                        borderRadius: 20,
                        height: 40,
                      }}
                      buttonStyle={AppleButton.Style.BLACK}
                      buttonType={AppleButton.Type.CONTINUE}
                      onPress={() => {
                        this.RBSheet.close();
                        this.props.navigation.navigate("Signup");
                      }}
                    />
                  )} */}
                </View>
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
              </View>

              <Footer style={{ backgroundColor: "#F5F5F5" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.RBSheet.close();
                    this.props.navigation.navigate("Login");
                  }}
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {" "}
                    Already have an account?
                  </Text>
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {" "}
                    Log in{" "}
                  </Text>
                </TouchableOpacity>
              </Footer>
            </Container>

            {/* <Splash navigation = {this.props.navigation}/> */}
          </RBSheet>
        </View>
      );
    }

    return this.props.view;
  },
  _getElement(type) {
    if (typeof this.props[type] !== "undefined") {
      switch (type) {
        case "image":
          return (
            <Image
              source={this.props.image}
              resizeMode="cover"
              style={[styles.global, styles.image, this.props.imageStyle, {}]}
            />
          );

        case "title":
          return (
            <Text style={[styles.global, styles.title, this.props.titleStyle]}>
              {this.props.title}
            </Text>
          );

        case "icon":
          return this.props.icon;

        case "desc":
          return (
            <Text style={[styles.global, styles.desc, this.props.descStyle]}>
              {this.props.desc}
            </Text>
          );

        case "button":
          return (
            <ButtonComponent
              title={"Login"}
              containerStyle={{
                width: Scale.moderateScale(160),
                marginTop: Scale.moderateScale(20),
              }}
              color="#fff"
              colors={[
                constants.colors.primaryColor,
                constants.colors.primaryColor,
              ]}
              textStyle={{}}
              onPress={() => this.props.navigation.navigate("Login")}
            />
          );
        case "textButton":
          return (
            <ButtonComponent
              title={this.props.textButton}
              containerStyle={{
                width: Scale.moderateScale(160),
                marginTop: Scale.moderateScale(10),
              }}
              color={constants.colors.white}
              colors={[
                constants.colors.appLightGrey,
                constants.colors.appLightGrey,
              ]}
              onPress={() => this.props.navigation.navigate("Signup")}
              // linearGradientStyle={{
              //   paddingHorizontal: Scale.moderateScale(0),
              //   // marginHorizontal: Scale.moderateScale(0),
              //   justifyContent: "flex-start",
              // }}
            />
          );
      }
    }

    return;
  },
});
