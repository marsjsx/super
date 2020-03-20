import React from "react";
import styles from "../styles";
import ENV from "../env";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { NavigationEvents } from "react-navigation";
import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePhoto,
  createAndUpdatePreview
} from "../actions/post";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ImageBackground
} from "react-native";
const GOOGLE_API =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
import { uploadPhoto } from "../actions/index";

import { Item, Input, Label, Picker, Icon } from "native-base";
import Constants from "expo-constants";

import { Dropdown } from "react-native-material-dropdown";

import {
  Ionicons,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
  Octicons
} from "@expo/vector-icons";

class Post extends React.Component {
  state = {
    showModal: false,
    locations: [],
    language: "",
    selectedLocation: ""
  };

  componentDidMount() {
    this.getLocations();
  }

  post = async () => {
    if (this.props.post.photo == null || this.props.post.photo == undefined) {
      showMessage({
        message: "STOP",
        description: "Please select an image",
        type: "danger",
        duration: 3000
      });

      return;
    }
    this.props.uploadPost();
    this.props.navigation.navigate("Home");
  };

  onWillFocus = () => {
    if (!this.props.post.photo) {
      this.openLibrary();
    }
  };

  renderTopBar = () => (
    <View
      style={{
        backgroundColor: "transparent",
        alignSelf: "flex-end",
        position: "absolute",
        paddingTop: Constants.statusBarHeight
      }}
    >
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => this.openLibrary()}
      >
        <Foundation name="thumbnails" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => this.props.navigation.navigate("Camera")}
      >
        <Ionicons name="ios-reverse-camera" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        this.props.updatePhoto(image.uri);
        this.props.createAndUpdatePreview(image.uri);
      }
    }
  };

  getLocations = async () => {
    const permission = await Permissions.askAsync(Permissions.LOCATION);
    if (permission.status === "granted") {
      const location = await Location.getCurrentPositionAsync();
      const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&rankby=distance&key=${ENV.googleApiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ locations: data.results });
    }
  };

  locationItems = () =>
    this.state.locations.map((s, i) => {
      return (
        <Picker.Item
          label={s.name + "\n" + s.vicinity}
          value={s}
          onPress={() => this.setLocation(item)}
        />
      );
    });

  setLocation(location) {
    const place = {
      name: location.name + "\n" + location.vicinity,
      coords: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng
      }
    };
    this.props.updateLocation(place);
    this.setState({ selectedLocation: location });
  }

  render() {
    let data = [
      {
        value: "Brian Helm"
      },
      {
        value: "Pat Hustad"
      }
    ];
    let dataLoc = [
      {
        value: "Pacific City"
      },
      {
        value: "RC Cafe"
      },
      {
        value: "Pub House"
      },
      {
        value: "Left Coast Brewing"
      }
    ];
    return (
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%" }}
          behavior={"padding"}
        >
          <ScrollView
            style={[{ width: "100%" }]}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <NavigationEvents onWillFocus={this.onWillFocus} />
            <Image
              style={styles.postPhotoPreview}
              source={{ uri: this.props.post.photo }}
            />
            {this.renderTopBar()}

            <View style={{ margin: 10 }}>
              <Item floatingLabel>
                <Label>Write a caption..</Label>
                <Input
                  value={this.props.post.description}
                  onChangeText={text => this.props.updateDescription(text)}
                />
              </Item>
              {this.state.locations.length > 0 ? (
                <Item underline>
                  <Picker
                    iosIcon={<Icon name="arrow-down" />}
                    mode="dropdown"
                    style={{ width: undefined }}
                    placeholder="Add a Location"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.selectedLocation}
                    onValueChange={this.setLocation.bind(this)}
                  >
                    {this.locationItems()}
                  </Picker>
                </Item>
              ) : null}
              <TouchableOpacity style={[styles.buttonPost]} onPress={this.post}>
                <Text>Post</Text>
              </TouchableOpacity>
            </View>
            {/* <Dropdown label='Tag People' data={data} containerStyle={styles.dropDown}/>
      <Dropdown label='Add Location' data={dataLoc} containerStyle={styles.dropDown} />
      <View style={[styles.postShare, styles.row, styles.space,]}>
        <Text style={[styles.left,{ color: 'rgba(150,150,150,0.9)' }]}>Facebook</Text>
        <TouchableOpacity style={[styles.buttonShare, styles.right]}>
          <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.postShare, styles.row, styles.space,]}>
        <Text style={[styles.left, { color: 'rgba(150,150,150,0.9)' }]}>Twitter</Text>
        <TouchableOpacity style={[styles.buttonShare, styles.right]}>
          <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
        </TouchableOpacity>
      </View> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDescription,
      uploadPost,
      updateLocation,
      uploadPhoto,
      updatePhoto,
      createAndUpdatePreview
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    post: state.post,
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
