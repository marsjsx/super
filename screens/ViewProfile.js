import React from "react";
import styles from "../styles";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  Platform,
  Linking,
  UIManager,
  findNodeHandle,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { validURL } from "../util/Helper";
import { showLoader } from "../util/Loader";
import { AntDesign } from "react-native-vector-icons";

import {
  followUser,
  unfollowUser,
  getUser,
  blockUser,
  unblockUser,
  logout,
  updateBio,
  updateUser,
  updateWebsiteLabel,
} from "../actions/user";
import { getMessages } from "../actions/message";
import { likePost, unlikePost, deletePost } from "../actions/post";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Dialog from "react-native-dialog";

import moment from "moment";
import DoubleTap from "../component/DoubleTap";
import FadeInView from "../component/FadeInView";
import ProgressiveImage from "../component/ProgressiveImage";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AvView from "../component/AvView";
import { showMessage, hideMessage } from "react-native-flash-message";
import EmptyView from "../component/emptyview";
import Scale from "../helpers/Scale";

import {
  Button,
  Content,
  Title,
  Icon,
  Subtitle,
  ActionSheet,
  Text as NText,
} from "native-base";

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Message", "Report", "Block", "Cancel"];
var BUTTONS1 = ["Message", "Report", "Unblock", "Cancel"];

var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 3;
const { height, width } = Dimensions.get("window");
import { isUserBlocked } from "../util/Helper";

class ViewProfile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    if (params && params.routeName != "MyProfile") {
      //Show Header by returning header
      return {
        title: navigation.getParam("title", ""),
        // title: navigation.getParam("title", ""),

        headerRight: (
          <TouchableOpacity
            style={{ marginRight: 24, shadowOpacity: 1 }}
            onPress={navigation.getParam("showActionSheet")}
          >
            <SimpleLineIcons
              style={{ color: "white" }}
              name={"paper-plane"}
              size={40}
            />
          </TouchableOpacity>
        ),
      };
    } else {
      //Hide Header by returning null
      // return { headerRight: null };
      return { title: navigation.getParam("title", ""), headerRight: null };
    }
  };

  constructor(props) {
    super(props);
    this.page;
    this.cellRefs = {};
    this.user = {};
    this.state = {
      flatListSmall: true,
      showHide: "hide",
      position: 0,
      visible: false,
      changes: 1,
      website: "",
      userBlocked: false,
      websiteLabel: "",
      showLoading: false,
      profile: null,
      dialogVisible: false,
    };
    this.scroll = null;
    this.scrollView = null;
  }

  componentDidMount = async () => {
    const { state, navigate } = this.props.navigation;
    const { uid } = state.params;

    this.props.navigation.setParams({
      showActionSheet: this.showActionSheet,
    });

    this.props.navigation.setParams({
      goToChat: this.goToChat,
    });

    // if (state.routeName === "Profile") {
    //   if (uid) {
    //     this.props.navigation.setParams({
    //       userProfile: "show",
    //     });
    //     this.setState({ showLoading: true });

    //     await this.props.getUser(uid);
    //     this.setState({ showLoading: false });
    //   }
    // } else {
    //   this.props.getUser(this.props.user.uid, "LOGIN");
    // }

    var user = this.props.profile;

    this.setState({ profile: user });
    // alert(JSON.stringify(user.uid));
  };

  goToChat() {
    // this.setState({ profile: user });
    // alert("Called");
    // var user = this.props.profile;
    // const { params } = this.props.navigation.state;
    // if (params.routeName === "Profile") {
    //   // this.props.navigation.navigate("Chat", this.props.profile.uid);
    //   this.props.navigation.navigate("Chat", {
    //     uid: user.uid,
    //     title: user.username,
    //   });
    // }
  }

  goIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
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

  onButtonPress = (item) => {
    this.setState({
      flatListSmall: !this.state.flatListSmall,
    });
    Platform.OS === "android"
      ? this.scroll.scrollTo({ y: 12000, animated: true })
      : this.scroll.scrollTo({ y: 120, animated: true });
  };

  refreshScript = () => {
    this.setState({ state: this.state });
  };

  onSelect = (item, index) => {
    const { state, navigate } = this.props.navigation;
    this.props.navigation.navigate("PostListScreen", {
      selectedIndex: index,
      route: state.routeName,
    });

    // this.visibleSwitch(item);
  };

  follow = (user) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    var message = "";
    var type = "success";
    if (this.props.user.following.indexOf(user.uid) >= 0) {
      this.props.unfollowUser(user);
      message = "User unfollowed successfully";
      type = "danger";
    } else {
      this.props.followUser(user);
      message = "User followed successfully";
    }

    showMessage({
      message: message,
      type: type,
      duration: 2000,
    });
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        const url = await this.props.uploadPhoto(image);
        this.props.updatePhoto(url);
        /* console.log(url) */
      }
    }
  };

  showActionSheet = () => {
    var user = this.props.profile;
    this.props.navigation.navigate("Chat", {
      uid: user.uid,
      title: user.username,
    });
    // alert(JSON.stringify(user.uid));
  };

  unBlockUser(user) {
    Alert.alert(
      `Unblock ${user.username}?`,
      "They will now be able to see your posts and follow you on l l l s u p e r l l l.\n l l l s u p e r l l l won't let them know that you've unblocked them.",
      [
        {
          text: "Cancel",
          // onPress: () => alert("Cancelled"),
          style: "cancel",
        },
        {
          text: "Unblock",
          onPress: () => {
            this.props.unblockUser(user.uid);
          },
        },
      ],
      { cancelable: false }
    );
  }
  openUrl = async (user) => {
    var url = user.bio;

    if (!url) {
      if (this.props.user.uid === user.uid) {
        this.setState({ dialogVisible: true });
      } else {
        showMessage({
          message: "STOP",
          description: `No Link Attached`,
          type: "danger",
          duration: 2000,
        });
      }
    } else {
      if (!url.startsWith("http")) {
        url = `http://${url}`;
      }

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        Linking.openURL(url);
      } else {
        showMessage({
          message: "STOP",
          description: `Don't know how to open this URL: ${url}`,
          type: "danger",
          duration: 2000,
        });
      }
    }
  };
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleOnUpdate = async () => {
    if (this.state.website || this.state.websiteLabel) {
      if (!this.state.website) {
        showMessage({
          message: "STOP",
          description: "Please add website link for the website title",
          type: "danger",
          duration: 2000,
        });
        return;
      }

      if (!validURL(this.state.website)) {
        showMessage({
          message: "STOP",
          description: "Please add valid website link",
          type: "danger",
          duration: 2000,
        });
        return;
      }

      if (!this.state.websiteLabel) {
        showMessage({
          message: "STOP",
          description: "Please add website title for the website link",
          type: "danger",
          duration: 2000,
        });
        return;
      }
    }
    this.props.updateBio(this.state.website);
    this.props.updateWebsiteLabel(this.state.websiteLabel);

    this.props.updateUser();

    this.setState({ dialogVisible: false });
  };

  getProfileComponent(user) {
    const { state, navigate } = this.props.navigation;
    let userblocked = isUserBlocked(this.props.user, user.uid);
    const { params } = this.props.navigation.state;

    return (
      <View>
        <View style={[styles.center]}>
          <TouchableOpacity>
            <ProgressiveImage
              transparentBackground="transparent"
              source={{ uri: user.photo }}
              style={styles.roundImage100}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontWeight: "400",
                fontSize: 18,
                color: "#000",
              }}
            >
              {user.username}
            </Text>
          </TouchableOpacity> */}

          <View
            style={[
              styles.row,
              styles.space,
              styles.followBar,
              styles.bottomgreyborder,
              {
                marginTop: Scale.moderateScale(14),
                marginBottom: Scale.moderateScale(14),
                paddingBottom: Scale.moderateScale(14),
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.center, {}]}
              onPress={() => {
                this.props.navigation.navigate("MyFollowersAndFollowing", {
                  data: "Followers",
                  route: params.routeName,
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
            <TouchableOpacity style={[styles.center, {}]} onPress={() => {}}>
              <Text
                style={[
                  styles.bold,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {"-"}
              </Text>
              <Text style={[styles.grey]}> Likes</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(24),
                marginRight: Scale.moderateScale(24),
              }}
            >
              <Text
                style={[styles.bold, styles.black, { width: "30%" }]}
              ></Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { width: "70%", textAlign: "right" },
                ]}
              ></Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(24),
                marginRight: Scale.moderateScale(24),
              }}
            >
              <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                Name:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.username}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(24),
                marginRight: Scale.moderateScale(24),
              }}
            >
              <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                Bio:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.userbio || "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(24),
                marginRight: Scale.moderateScale(24),
              }}
            >
              <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                Website:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.bio}
              </Text>
            </View>

            {params.routeName === "MyProfile" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: Scale.moderateScale(24),
                  marginRight: Scale.moderateScale(24),
                }}
              >
                <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                  Website Label:
                </Text>
                <Text
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                >
                  {user.websiteLabel}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(24),
                marginRight: Scale.moderateScale(24),
              }}
            >
              <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                Gender:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.gender}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(24),
                marginRight: Scale.moderateScale(24),
              }}
            >
              <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                Birthdate:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.dob ? moment(user.dob).format("ll") : "-"}
              </Text>
            </View>
            {params.routeName === "MyProfile" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: Scale.moderateScale(24),
                  marginRight: Scale.moderateScale(24),
                }}
              >
                <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                  Account Type:
                </Text>
                <Text
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                >
                  {user.accountType}
                </Text>
              </View>
            )}
            {params.routeName === "MyProfile" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: Scale.moderateScale(24),
                  marginRight: Scale.moderateScale(24),
                }}
              >
                <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                  Email:
                </Text>
                <Text
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                >
                  {user.email}
                </Text>
              </View>
            )}

            {params.routeName === "MyProfile" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: Scale.moderateScale(24),
                  marginRight: Scale.moderateScale(24),
                }}
              >
                <Text style={[styles.bold, styles.black, { flex: 1.5 }]}>
                  Phone:
                </Text>
                <Text
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                >
                  {user.phone}
                </Text>
              </View>
            )}
          </View>
          {params.routeName === "MyProfile" && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 15,
                marginTop: Scale.moderateScale(10),
              }}
              onPress={() => {
                this.props.navigation.navigate("BlockedUsers");
              }}
            >
              <Text style={{ flex: 1 }}>Blocked Accounts </Text>
              <Ionicons name="ios-arrow-forward" size={20} color="black" />
            </TouchableOpacity>
          )}

          {params.routeName === "MyProfile" && (
            <Button block light style={styles.margin10} onPress={this.logout}>
              <Text>Logout</Text>
            </Button>
          )}

          {params.routeName === "MyProfile" && (
            <Button
              color="rgba(209,84,84,0.85)"
              block
              style={[
                styles.margin10,
                { backgroundColor: "rgba(209,84,84,0.85)", marginBottom: 30 },
              ]}
              onPress={() => {
                if (params.routeName === "MyProfile") {
                  this.props.navigation.navigate("Edit");
                }
              }}
            >
              <Text style={{ color: "white" }}>Edit Profile</Text>
            </Button>
          )}
        </View>
      </View>
    );
  }

  render() {
    let user = {};

    const { state, navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    if (params.routeName === "Profile") {
      user = this.props.profile;
      this.user = this.props.profile;
    } else {
      user = this.props.user;
      this.user = this.props.profile;

      if (!this.props.user.uid) {
        return (
          <EmptyView
            desc="Your Profile will appear here"
            button="Signup"
            userId={this.props.user.uid}
            navigation={this.props.navigation}
            icon={
              <MaterialCommunityIcons
                style={{ margin: 5 }}
                name="face-profile"
                size={64}
              />
            }
          />
        );
      }
    }
    let userblocked = isUserBlocked(this.props.user, user.uid);

    // if (!user.posts) return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container, { marginTop: Scale.moderateScale(100) }]}>
        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}

        <ScrollView style={{ marginBottom: 0 }} ref={(c) => (this.scroll = c)}>
          {this.getProfileComponent(user)}
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      followUser,
      unfollowUser,
      getMessages,
      deletePost,
      likePost,
      blockUser,
      unblockUser,
      unlikePost,
      getUser,
      logout,
      updateBio,
      updateUser,
      updateWebsiteLabel,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
    profile: state.profile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);

{
  /* <TouchableOpacity
              style={{
                marginTop: Scale.moderateScale(10),
              }}
              onPress={() => {
                if (params.routeName === "MyProfile") {
                  this.props.navigation.navigate("Edit");
                }
              }}
            >
              <Image
                style={[
                  styles.profileLogo1,
                  { transform: [{ rotate: "90deg" }] },
                ]}
                source={require("../assets/logo-1.png")}
              />
            </TouchableOpacity> */
}
