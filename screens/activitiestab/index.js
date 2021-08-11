import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import EmptyView from "../../component/emptyviewLayout1";
import { getUser } from "../../actions/user";
import { getMoreActivities } from "../../actions/activity";
import Scale from "../../helpers/Scale";
import { styles } from "./styles";
import { showLoader } from "../../util/Loader";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { followUser } from "../../actions/user";
import { getPostById } from "../../actions/post";
import ActivityScreen from "../../screens/Activity";
import MessagesScreen from "../../screens/Messages";
import constants from "../../constants";
import { showMessage, hideMessage } from "react-native-flash-message";
import FastImage from "react-native-fast-image";

class ActivitiesTab extends React.Component {
  state = {
    activity: [],
    refreshing: false,
    showLoading: false,
    selectedTab: 0,
  };

  componentDidMount = async () => {
    this.setHeaderButton();
  };

  setHeaderButton() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginRight: Scale.moderateScale(24),
          }}
          onPress={() => this.props.navigation.navigate("BrandRequests")}
        >
          <Ionicons
            style={{
              color: constants.colors.white,
            }}
            name={"ios-people"}
            size={32}
          />
          <View
            style={{
              right: -0,
              top: -0,
              position: "absolute",
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: constants.colors.red,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }

  async changeSelectedTab(position) {
    this.setState({ selectedTab: position });
  }

  getUnSeenMessageCount() {
    let unseenMessageCount = 0;
    if (this.props.messages.length) {
      this.props.messages.forEach((element) => {
        element.chats.forEach((item) => {
          if (!item.seenBy[this.props.user.uid]) {
            unseenMessageCount++;
          }
        });
      });
    }

    return unseenMessageCount;
  }

  render() {
    if (this.state.showLoading) return showLoader("Loading, Please wait... ");
    if (!this.props.user.uid) {
      return (
        // <EmptyView
        //   desc="All user activities will appear here"
        //   button="Signup/Login"
        //   userId={this.props.user.uid}
        //   navigation={this.props.navigation}
        //   icon={<Feather style={{ margin: 5 }} name="activity" size={64} />}
        // />

        <EmptyView
          title={`Rad vibes, good times `}
          button="Signup"
          textButton="Create account"
          image={require("../../assets/logoH.png")}
          userId={this.props.user.uid}
          imageStyle={{
            width: Scale.moderateScale(120),
            height: Scale.moderateScale(120),
          }}
          navigation={this.props.navigation}
        />
      );
    }

    // alert(JSON.stringify(this.props.activity.activities));
    return (
      // <View style={[styles.container, { marginTop: 100 }]}>
      <View style={[styles.container]}>
        {/* <View
          style={{
            flexDirection: "row",
            // position: "absolute",
            // shadowOpacity: 0.5,
            // transform: [{ rotate: "90deg" }],
            top: Scale.moderateScale(44),
            left: Scale.moderateScale(10),
            right: Scale.moderateScale(10),
            // right: Scale.moderateScale(-55),
            // bottom: height * 0.3,
          }}
        > */}
        {/* <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={[
                this.state.selectedTab == 0 ? styles.bottomwhiteborder : null,
                {},
              ]}
              onPress={() => this.changeSelectedTab(0)}
            >
              <Text
                style={[
                  this.state.selectedTab == 0
                    ? styles.activeLabel
                    : styles.inactiveLabel,
                  {
                    // textShadowColor: "rgba(0, 0, 0, 0.75)",
                    // textShadowOffset: { width: -1, height: 1 },
                    // textShadowRadius: 10,
                    // ...constants.fonts.FreightSansLight,
                  },
                ]}
              >
                Activity
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: 2,
                backgroundColor: "#000",
                margin: Scale.moderateScale(10),
              }}
            />
            <TouchableOpacity
              style={[
                this.state.selectedTab == 1 ? styles.bottomwhiteborder : null,
                {},
              ]}
              onPress={() => this.changeSelectedTab(1)}
            >
              <Text
                style={[
                  this.state.selectedTab == 1
                    ? styles.activeLabel
                    : styles.inactiveLabel,
                  {
                    // textShadowColor: "rgba(0, 0, 0, 0.75)",
                    // textShadowOffset: { width: -1, height: 1 },
                    // textShadowRadius: 10,
                    // ...constants.fonts.FreightSansLight,
                  },
                ]}
              >
                {`Inbox ${
                  this.getUnSeenMessageCount()
                    ? this.getUnSeenMessageCount()
                    : ""
                }`}
              </Text>
            </TouchableOpacity>
          </View> */}
        {/* {this.state.selectedTab == 1 && (
            <TouchableOpacity
              style={{
                marginRight: 24,
              }}
              onPress={() => this.messageRef.goToNewMessage()}
            >
              <Ionicons
                style={{
                  color: "#000",
                }}
                name="md-add"
                size={32}
              />
            </TouchableOpacity>
          )} */}

        {/* {this.state.selectedTab == 0 &&
            this.props.user.isSuperAdmin &&
            this.setHeaderButton()} */}
        {/* </View> */}

        <View
          style={{
            flex: 1,
            // marginTop: Scale.moderateScale(50),
            display: this.state.selectedTab == 0 ? "flex" : "none",
            backgroundColor: constants.colors.appBackgroundColor,
          }}
        >
          <ActivityScreen navigation={this.props.navigation} />
        </View>
        <View
          style={{
            flex: 1,
            marginTop: Scale.moderateScale(50),
            display: this.state.selectedTab == 1 ? "flex" : "none",
          }}
        >
          <MessagesScreen
            refs={(ref) => {
              this.messageRef = ref;
            }}
            navigation={this.props.navigation}
          />
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUser,
      followUser,
      getMoreActivities,
      getPostById,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
    activity: state.activity,
    messages: state.messages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesTab);
