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

import EmptyView from "../../component/emptyview";
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

  componentDidMount = async () => {};

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
        <EmptyView
          desc="All user activities will appear here"
          button="Signup/Login"
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={<Feather style={{ margin: 5 }} name="activity" size={64} />}
        />
      );
    }

    // alert(JSON.stringify(this.props.activity.activities));
    return (
      // <View style={[styles.container, { marginTop: 100 }]}>
      <View style={[styles.container]}>
        <View
          style={{
            flexDirection: "row",
            // position: "absolute",
            // shadowOpacity: 0.5,
            // transform: [{ rotate: "90deg" }],
            top: Scale.moderateScale(44),
            left: Scale.moderateScale(10),
            // right: Scale.moderateScale(-55),
            // bottom: height * 0.3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginHorizontal: 20, color: "#000" }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity> */}
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
          </View>
          <TouchableOpacity
            style={{
              marginRight: 24,
              display: this.state.selectedTab == 1 ? "flex" : "none",
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
        </View>

        <View
          style={{
            flex: 1,
            marginTop: Scale.moderateScale(50),
            display: this.state.selectedTab == 0 ? "flex" : "none",
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
