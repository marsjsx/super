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
import { showLoader } from "../util/Loader";
import { AntDesign } from "react-native-vector-icons";
import { validURL, openSettingsDialog } from "../util/Helper";

import {
  followUser,
  unfollowUser,
  getUser,
  blockUser,
  deleteAuth,
  unblockUser,
  updateCompressedPhoto,
  updateEmail,
  updatePassword,
  updateUsername,
  updateBio,
  updateUserBio,
  updateWebsiteLabel,
  updateUser,
  deleteUser,
  updatePhone,
  updateGender,
  updateAccountType,
  updateDOB,
  updatePhoto,
  logout,
  createAndUpdatePreview,
} from "../actions/user";
import { uploadPhoto } from "../actions";

import { getMessages } from "../actions/message";
import { likePost, unlikePost, deletePost } from "../actions/post";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
import ImagePicker from "react-native-image-crop-picker";
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
  DatePicker,
  Picker,
  Text as NText,
} from "native-base";

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Message", "Report", "Block", "Cancel"];
var BUTTONS1 = ["Message", "Report", "Unblock", "Cancel"];
import { convertDate } from "../util/DateFormater";
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 3;
const { height, width } = Dimensions.get("window");
import { isUserBlocked } from "../util/Helper";
import { TextInput } from "react-native-gesture-handler";

class ViewProfile extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   const { params } = navigation.state;

  //   if (params && params.routeName != "MyProfile") {
  //     //Show Header by returning header
  //     return {
  //       title: navigation.getParam("title", ""),
  //       // title: navigation.getParam("title", ""),

  //       headerRight: (
  //         <TouchableOpacity
  //           style={{ marginRight: 24 }}
  //           onPress={navigation.getParam("showActionSheet")}
  //         >
  //           <SimpleLineIcons
  //             style={{ color: "#000" }}
  //             name={"paper-plane"}
  //             size={30}
  //           />
  //         </TouchableOpacity>
  //       ),
  //     };
  //   } else {
  //     //Hide Header by returning null
  //     // return { headerRight: null };
  //     return { title: navigation.getParam("title", ""), headerRight: null };
  //   }
  // };

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

  onDobChange(value) {
    this.props.updateDOB(value.getTime());
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
      // const image = await ImagePicker.launchImageLibraryAsync({ quality: 0.1 });
      // if (!image.cancelled) {
      //   this.props.updatePhoto(image.uri);
      //   this.props.createAndUpdatePreview(image.uri);
      // } else {
      // }

      ImagePicker.openPicker({
        compressImageQuality: 0.8,
      }).then((image) => {
        // alert(JSON.stringify(image));
        this.cropImage(image);
      });
    } else {
      openSettingsDialog(
        "Failed to Access Photos, Please go to the Settings to enable access",
        this.props.navigation
      );
    }
  };

  cropImage = async (selectedImage) => {
    // alert(JSON.stringify(this.props.post.photo.uri));

    await ImagePicker.openCropper({
      path: selectedImage.path,
      // cropping: true,
      // width: 1200,
      width: width * 1.5,
      height: width * 1.5 * 1.6,
      // width: selectedImage.width,
      // height: selectedImage.height,
      // // height: 1500,

      // compressImageQuality: 0.8,
    })
      .then((image) => {
        console.log(image);
        this.props.updatePhoto(image.path);
        this.props.updateCompressedPhoto(image.path);

        this.props.createAndUpdatePreview(image.path);
      })
      .catch((err) => {
        // Here you handle if the user cancels or any other errors
      });
  };

  showActionSheet = () => {
    // var user = this.props.profile;
    var user = this.user;
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

  onGenderChange(value) {
    this.props.updateGender(value);
  }

  onAccountTypeChange(value) {
    this.props.updateAccountType(value);
  }

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

  onSave = async () => {
    // this.props.navigation.navigate("Home");
    // return;

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
  beginDel = async () => {
    /* this.props.deleteAllPosts() */
    await this.props.deleteUser();
    await this.props.deleteAuth();
    firebase.auth().signOut();
    this.props.navigation.navigate("Splash");
  };
  getProfileComponent(user) {
    const { state, navigate } = this.props.navigation;
    let userblocked = isUserBlocked(this.props.user, user.uid);
    const { params } = this.props.navigation.state;

    return (
      <View>
        <View style={[styles.center]}>
          <TouchableOpacity>
            {/* <ProgressiveImage
              transparentBackground="transparent"
              source={{ uri: user.photo }}
              style={styles.roundImage100}
              thumbnailSource={{
                uri: user.preview,
              }}
            /> */}

            <ProgressiveImage
              thumbnailSource={{
                uri: user.preview,
              }}
              source={{ uri: user.photo }}
              style={[styles.viewProfilePhoto]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {params.routeName === "MyProfile" && (
            <TouchableOpacity
              style={[styles.center, { marginBottom: 10 }]}
              onPress={this.openLibrary}
            >
              <Text
                style={[
                  {
                    color: "rgb(237,75,75)",
                    marginVertical: Scale.moderateScale(10),
                    textDecorationLine: "underline",
                  },
                ]}
              >
                Change profile photo
              </Text>
            </TouchableOpacity>
          )}

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
                // marginTop: Scale.moderateScale(14),
                // paddingBottom: Scale.moderateScale(14),
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.center, {}]}
              onPress={() => {
                this.props.navigation.navigate("MyFollowersAndFollowing", {
                  data: "Followers",
                  route: params.routeName,
                  user: user,
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
                  user: user,
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
                height: Scale.moderateScale(8),
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
              <TextInput
                editable={params.routeName === "MyProfile" ? true : false}
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
                value={user.username}
                autoCapitalize="none"
                onChangeText={(input) =>
                  this.props.updateUsername(
                    input.replace(/\s/g, "").toLowerCase()
                  )
                }
              />
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
              <TextInput
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
                editable={params.routeName === "MyProfile" ? true : false}
                value={user.userbio || "-"}
                onChangeText={(input) => this.props.updateUserBio(input)}
              />
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
              <TextInput
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
                editable={params.routeName === "MyProfile" ? true : false}
                value={this.props.user.bio}
                onChangeText={(input) => this.props.updateBio(input)}
              />
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
                <TextInput
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                  editable={params.routeName === "MyProfile" ? true : false}
                  value={this.props.user.websiteLabel}
                  maxLength={30}
                  onChangeText={(input) => this.props.updateWebsiteLabel(input)}
                />
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
              {/* <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.gender}
              </Text> */}
              <Picker
                mode="dropdown"
                note={false}
                style={{ width: undefined }}
                placeholder="Select your gender"
                textStyle={[styles.grey]}
                placeholderStyle={[styles.grey]}
                enabled={params.routeName === "MyProfile" ? true : false}
                // placeholderStyle={{ color: "#bfc6ea" }}
                // placeholderIconColor="#007aff"
                selectedValue={this.props.user.gender}
                onValueChange={this.onGenderChange.bind(this)}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Gender Neutral" value="Gender Neutral" />
              </Picker>
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
              {/* <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { flex: 3, textAlign: "right" },
                ]}
              >
                {user.dob ? moment(user.dob).format("ll") : "-"}
              </Text> */}

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
                textStyle={[styles.grey]}
                selectedValue={this.props.user.dob}
                placeHolderTextStyle={[styles.grey]}
                onDateChange={this.onDobChange.bind(this)}
                disabled={params.routeName === "MyProfile" ? false : true}
                ref={(c) => (this.openDatePicker = c)}
              />
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
                {/* <Text
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                >
                  {user.accountType}
                </Text> */}
                <Picker
                  mode="dropdown"
                  note={false}
                  style={{ width: undefined }}
                  placeholder="Select account type"
                  textStyle={[styles.grey]}
                  placeholderStyle={[styles.grey]}
                  enabled={params.routeName === "MyProfile" ? true : false}
                  // placeholderStyle={{ color: "#bfc6ea" }}
                  // placeholderIconColor="#007aff"
                  selectedValue={this.props.user.accountType}
                  onValueChange={this.onAccountTypeChange.bind(this)}
                >
                  <Picker.Item label="Personal" value="Personal" />
                  <Picker.Item label="Business" value="Business" />
                </Picker>
                {/* <Picker
                  mode="dropdown"
                  placeholder="Select One"
                  placeholderStyle={{ color: "#2874F0" }}
                  note={false}
                >
                  <Picker.Item label="Wallet" value="key0" />
                  <Picker.Item label="ATM Card" value="key1" />
                  <Picker.Item label="Debit Card" value="key2" />
                  <Picker.Item label="Credit Card" value="key3" />
                  <Picker.Item label="Net Banking" value="key4" />
                </Picker> */}
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
                <TextInput
                  style={[
                    styles.grey,
                    styles.margin10,
                    { flex: 3, textAlign: "right" },
                  ]}
                  onChangeText={(input) => this.props.updatePhone(input)}
                  value={this.props.user.phone}
                  editable={params.routeName === "MyProfile" ? true : false}
                />
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
            <Button
              color="rgba(209,84,84,0.85)"
              block
              style={[
                styles.margin10,
                { backgroundColor: "rgba(209,84,84,0.85)" },
              ]}
              // onPress={() => {
              //   if (params.routeName === "MyProfile") {
              //     this.props.navigation.navigate("Edit");
              //   }
              // }}
              onPress={this.onSave}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </Button>
          )}
          {params.routeName === "MyProfile" && (
            <Button
              block
              light
              style={[styles.margin10, {}]}
              onPress={() => this.props.navigation.navigate("Reset")}
            >
              <Text>Reset Password</Text>
            </Button>
          )}
          {params.routeName === "MyProfile" && (
            <Button
              block
              light
              style={[styles.margin10, {}]}
              onPress={this.logout}
            >
              <Text>Logout</Text>
            </Button>
          )}
          {params.routeName === "MyProfile" && (
            <Button
              transparent
              style={[styles.margin10, { marginBottom: 30 }]}
              onPress={this.onPressDel}
            >
              <Text style={styles.textB}>! Delete User !</Text>
            </Button>
          )}
        </View>
      </View>
    );
  }

  render() {
    let userProfile = {};

    const { state, navigate } = this.props.navigation;
    // const { params } = this.props.navigation.state.params;
    const { routeName, user } = this.props.navigation.state.params;
    // alert(routeName);
    if (routeName === "Profile") {
      userProfile = user;
      this.user = user;
    } else {
      userProfile = this.props.user;
      this.user = this.props.user;

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
    let userblocked = isUserBlocked(this.props.user, userProfile.uid);

    // if (!user.posts) return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container, { marginTop: Scale.moderateScale(0) }]}>
        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}

        <ScrollView style={{ marginBottom: 0 }} ref={(c) => (this.scroll = c)}>
          {this.getProfileComponent(userProfile)}
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePhoto,
      updateCompressedPhoto,
      uploadPhoto,
      updateUser,
      updateEmail,
      updatePassword,
      updateUsername,
      updateBio,
      updateUserBio,
      updateWebsiteLabel,
      updatePhone,
      updateGender,
      updateAccountType,
      updateDOB,
      logout,
      createAndUpdatePreview,
      followUser,
      unfollowUser,
      deleteUser,
      deleteAuth,
      getMessages,
      deletePost,
      likePost,
      blockUser,
      unblockUser,
      unlikePost,
      getUser,
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
