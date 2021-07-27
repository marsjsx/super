import React from "react";
import styles from "../styles";
import ENV from "../env";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as ExpoImagePicker from "expo-image-picker";
import { ProcessingManager } from "react-native-video-processing";
import Loader from "../component/Loader";
import EmptyView from "../component/emptyview";
import ImagePicker from "react-native-image-crop-picker";
import { PanoramaView } from "@lightbase/react-native-panorama-view";
import Editor, { displayTextWithMentions } from "../component/mentioneditor";
import db from "../config/firebase";
import { cleanExtractedImagesCache } from "react-native-image-filter-kit";
import { StackActions } from "@react-navigation/native";
import MultiSelect from "../component/MultiSelect";
import { showMessage, hideMessage } from "react-native-flash-message";
import DropDownPicker from "../component/dropdownpicker";
import _ from "lodash";
import Scale from "../helpers/Scale";
import debounce from "lodash/debounce";
import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePhoto,
  createAndUpdatePreview,
  updatePhotoPreview,
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
  Dimensions,
  ImageBackground,
} from "react-native";
const GOOGLE_API =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
import { uploadPhoto } from "../actions/index";

import {
  Item,
  Input,
  Label,
  Picker,
  Icon,
  Button,
  Textarea,
  Form,
  Content,
} from "native-base";

const { height, width } = Dimensions.get("window");

class PostCaption extends React.Component {
  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.lastPress = 0;

    this.state = {
      showModal: false,
      locations: [],
      customLocation: null,
      users: [],
      country: "",
      timer: null,
      showLoading: false,
      selectedSource: "",
      selectedSource: "",
      language: "",
      startTime: 0,
      endTime: 59,
      showSignUpSheet: false,
      selectedLocation: "",
      currentTime: 0,
      initialValue: "",
      showEditor: true,
      message: null,
      messages: [],
      selectedChannels: [],
      index: 0,
      clearInput: false,
      showMentions: false /**use this parameter to programmatically trigger the mentionsList */,
    };
    this.start = this.start.bind(this);
  }

  async componentDidMount() {
    this.post = debounce(this.post.bind(this), 500);

    this.getLocations();
    const selectedFile = this.props.post.photo;

    let search = this.state.users;

    const query = await db.collection("users").get();

    query.forEach((response) => {
      let user = response.data();
      if (user.user_name) {
        var data = {
          id: user.uid,
          name: user.username,
          username: user.user_name,
          gender: "",
          photo: user.photo,
        };

        search.push(data);
      }
    });
    this.setState({ users: search });
  }

  post = async () => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    if (this.props.post.photo == null || this.props.post.photo == undefined) {
      showMessage({
        message: "STOP",
        description: "Please select an image/video",
        type: "danger",
        duration: 3000,
      });

      return;
    }

    if (
      this.props.user.accountType == "Brand" &&
      this.props.user.accountStatus !== "approved"
    ) {
      showMessage({
        message: "Profile not approved",
        description: "Please check your account status in your profile",
        type: "danger",
        duration: 4000,
      });

      return;
    }

    // alert(JSON.stringify(this.state.selectedChannels));
    if (
      this.props.user.accountType == "Brand" &&
      this.state.selectedChannels.length < 1
    ) {
      showMessage({
        message: "Select Channel",
        description: "Please select channels in which you want to post",
        type: "danger",
        duration: 4000,
      });

      return;
    }
    // if (this.props.user.accountType == "Brand") {
    //   showMessage({
    //     message: "Post feed not allowed",
    //     description: "Currently brands feed not allowed",
    //     type: "danger",
    //     duration: 4000,
    //   });

    //   return;
    // }
    if (this.props.post.photo.type === "image") {
      // const { filteredImage } = this.props.navigation.state.params;
      const { filteredImage } = this.props.route.params;

      if (filteredImage) {
        // alert(this.state.filteredImage);

        var selectedFile = this.props.post.photo;
        selectedFile.uri = filteredImage;

        this.props.updatePhoto(selectedFile);
      }
    } else if (this.props.post.photo.type === "vr") {
    } else {
    }

    this.props.uploadPost(this.state.selectedChannels);
    this.props.navigation.dispatch(StackActions.popToTop());
    this.props.navigation.navigate("Home");
  };

  getLocations = async () => {
    const permission = await await Location.requestPermissionsAsync();
    if (permission.status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      // const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&radius=500000&type=cities&key=${ENV.googleApiKey}`;
      const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&radius=20000&key=${ENV.googleApiKey}`;

      // const url = `${GOOGLE_API}?location=31.12168,77.13203&rankby=distance&key=${ENV.googleApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      let locations = data.results.reduce((i, j) => {
        console.log("j=====>", j);
        i.push({ label: j.name + "\n" + j.vicinity, value: j });
        return i;
      }, []);
      this.setState({ locations: locations });
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
    // alert(JSON.stringify(location));
    if (location.value.name) {
      const place = {
        name: location.value.name + "\n" + location.value.vicinity,
        coords: {
          lat: location.value.geometry.location.lat,
          lng: location.value.geometry.location.lng,
        },
      };
      this.props.updateLocation(place);
    } else {
      const place = {
        name: location.label,
        coords: {
          lat: 0.0,
          lng: 0.0,
        },
      };
      this.props.updateLocation(place);
    }

    this.setState({ selectedLocation: location });
  }

  onChangeHandler = async (message) => {
    var searchQuery = message.displayText;
    this.props.updateDescription(searchQuery);
    var index = searchQuery.lastIndexOf("@");
    if (index >= 0) {
      var query = searchQuery.substring(index, searchQuery.length);
      // alert(query);
      var search = query.replace("@", "");
      if (search.length > 0) {
        // alert(search);
        // var search = message.text.replace("@", "");
        this.start(search);
      }
    }
  };

  resetTimer() {
    clearInterval(this.state.timer);
  }

  start(searchQuery) {
    // alert(searchQuery);

    var self = this;
    if (this.state.timer != null) {
      this.resetTimer();
    }

    let timer = setInterval(async () => {
      this.resetTimer();
    }, 500);
    this.setState({ timer });

    this.setState({
      clearInput: false,
    });
    //  this.props.updateDescription(searchQuery)
  }

  toggleEditor = () => {
    /**
     * This callback will be called
     * once user left the input field.
     * This will handle blur event.
     */
    // this.setState({
    //   showEditor: false,
    // })
  };

  onHideMentions = () => {
    /**
     * This callback will be called
     * When MentionsList hide due to any user change
     */
    this.setState({
      showMentions: false,
    });
  };

  render() {
    // const filter = this.filters[this.state.index];
    var locations = [];

    if (this.state.customLocation) {
      locations = [...this.state.locations, this.state.customLocation];
    } else {
      locations = this.state.locations;
    }

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{ height: 0 }}>
            <EmptyView
              ref={(ref) => {
                this.sheetRef = ref;
              }}
              navigation={this.props.navigation}
            />
          </View>

          {/* <TouchableOpacity
              style={{
                position: "absolute",
                right: 16,
                top: 100,
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                alert("Clicked");
              }}
            >
              <Text
                style={{
                  color: "blue",
                  padding: 10,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Next{" "}
              </Text>
            </TouchableOpacity> */}

          <View style={{}}>
            {/* <Item floatingLabel> */}
            {/* <Label>Write a caption..</Label> */}
            {/* <Textarea
                  rowSpan={5}
                  placeholder="Write a caption....."
                  bordered
                  value={this.props.post.description}
                  onChangeText={(text) => this.props.updateDescription(text)}
                /> */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                borderBottomWidth: 0.5,
                paddingBottom: Scale.moderateScale(20),
                borderBottomColor: "#dcdcdc",
              }}
            >
              {/* this.props.post.photo */}
              <Image
                style={{
                  height: width * 0.3,
                  aspectRatio: 3 / 5,
                  // width: width * 0.16,
                }}
                // source={{
                //   uri: filteredImage
                //     ? filteredImage
                //     : this.props.post.preview,
                // }}
                source={{
                  uri: this.props.post.preview,
                }}
                resizeMode={"cover"}
              />
              <View style={{ width: width * 0.8 }}>
                <Editor
                  list={this.state.users}
                  initialValue={this.state.initialValue}
                  clearInput={this.state.clearInput}
                  onChange={this.onChangeHandler}
                  showEditor={this.state.showEditor}
                  toggleEditor={this.toggleEditor}
                  showMentions={this.state.showMentions}
                  onHideMentions={this.onHideMentions}
                  placeholder="Write a caption....."
                />
              </View>
            </View>
            {/* </Item> */}
            {this.state.locations.length > 0 ? (
              <DropDownPicker
                items={locations}
                defaultValue={this.state.country}
                containerStyle={{ height: 40, marginTop: 20 }}
                searchable={true}
                placeholder={"Add a Location"}
                searchableError={(searchableText) => {
                  this.setState({
                    customLocation: {
                      label: searchableText,
                      value: searchableText,
                    },
                  });
                  return null;

                  // return <Text>Not {searchableText}</Text>;
                }}
                searchablePlaceholder="Search a Location"
                searchablePlaceholderTextColor="gray"
                style={{ backgroundColor: "#fafafa" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#fafafa" }}
                onChangeItem={this.setLocation.bind(this)}
              />
            ) : null}
            {this.props.user.accountType === "Brand" && (
              <>
                <View style={{ height: 24 }} />
                <MultiSelect
                  value={this.state.selectedChannels}
                  onSelectionsChange={(selectedChannels) => {
                    this.setState({
                      selectedChannels,
                    });
                  }}
                  data={this.props.channels.multiSelectChannelsList}
                  title={"Choose Channels"}
                  heading={"Choose Channels in which you want to post"}
                />
              </>
            )}

            <TouchableOpacity style={[styles.buttonPost]} onPress={this.post}>
              <Text>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {this.state.showLoading ? (
          <Loader message="Posting, Please wait... " bgColor="white" />
        ) : null}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateDescription,
      uploadPost,
      updateLocation,
      uploadPhoto,
      updatePhoto,
      createAndUpdatePreview,
      updatePhotoPreview,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    channels: state.channels,
    post: state.post,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCaption);
