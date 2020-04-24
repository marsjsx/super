import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
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
import Splash from "../screens/Splash";
import Login from "../screens/Login";

import AuthNavigator from "../navigation/SwitchNavigator";
import { name as appName } from "../app.json";
import { TouchableOpacity } from "react-native-gesture-handler";

// import AuthNavigator from './AuthNavigator.js'

const { height, width } = Dimensions.get("window");

// var createReactClass = require('create-react-class');

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  global: {
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 20,
  },
  desc: {
    width: 280,
    textAlign: "center",
  },
  button: {
    color: "white",
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
          {this._getElement("title")}
          {this._getElement("icon")}
          {this._getElement("desc")}
          {!this.props.userId && this._getElement("button")}
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
            <Container style={{ flex: 1, width: "100%" }}>
              <Header transparent>
                <Left>
                  <Button transparent onPress={() => this.RBSheet.close()}>
                    <Ionicons name="ios-close" size={32} />
                  </Button>
                </Left>

                <Right>
                  <Button transparent>
                    <Ionicons name="ios-help-circle-outline" size={32} />
                  </Button>
                </Right>
              </Header>
              <Title>Sign up for {appName} </Title>
              <Subtitle style={{ textAlign: "center", margin: 10 }}>
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
                      this.props.navigation.navigate("Signup");
                    }}
                  >
                    <Ionicons size={24} name="md-person" />

                    <Text style={{ marginLeft: 20 }}>Use phone or email</Text>
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
                </View>
                <Subtitle
                  style={{
                    textAlign: "center",
                    margin: 10,
                  }}
                >
                  By continuning, you agree to {appName}'s Terms of Use and
                  confirm that you have read {appName}'s Privacy policy
                </Subtitle>
              </View>

              <Footer>
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
                  <Text> Already have an account?</Text>
                  <Text style={{ color: "red" }}> Log in </Text>
                </TouchableOpacity>
              </Footer>
            </Container>

            {/* <Splash navigation = {this.props.navigation}/> */}
            {/* <AuthNavigator /> */}
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
              resizeMode="stretch"
              style={[styles.global, styles.image, this.props.stylesheet.image]}
            />
          );

        case "title":
          return (
            <Text
              style={[styles.global, styles.title, this.props.stylesheet.title]}
            >
              {this.props.title}
            </Text>
          );

        case "icon":
          return this.props.icon;

        case "desc":
          return (
            <Text style={[styles.global, styles.desc]}>{this.props.desc}</Text>
          );

        case "button":
          return (
            <Button danger onPress={() => this.RBSheet.open()}>
              <Text
                style={[styles.button, { marginLeft: 20, marginRight: 20 }]}
              >
                {" "}
                {this.props.button}{" "}
              </Text>
            </Button>
          );
      }
    }

    return;
  },
});
