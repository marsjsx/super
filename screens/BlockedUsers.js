import React from "react";
import styles from "../styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showLoader } from "../util/Loader";
import db from "../config/firebase";
import ProgressiveImage from "../component/ProgressiveImage";
import EmptyView from "../component/emptyview";
import MyFollowers from "./Followers";
import { getUser, getBlockedUser, unblockUser } from "../actions/user";
import { followUser } from "../actions/user";
import { showMessage, hideMessage } from "react-native-flash-message";
import { _ } from "lodash";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
  Octicons,
} from "@expo/vector-icons";
import { Badge, Button, Left, Right, Body } from "native-base";

import {
  View,
  FlatList,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { groupBy, values } from "lodash";
var self;

class BlockedUsers extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     title: navigation.getParam("title", ""),
  //   };
  // };

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      users: [],
      page: 1,
      uniqueIds: [],
      allViewers: [],
      isLoading: false,
      isRefreshing: false,
    };

    self = this;
  }

  componentDidMount = async () => {
    const user = this.props.user;

    if (!user.blockedUsers) {
      this.setState({ showLoading: true });
    }

    await this.props.getBlockedUser();

    this.setState({ showLoading: false });
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

  goToUser = (user) => {
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile");
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.goToUser(item)}
        style={[styles.row, styles.space]}
      >
        <ProgressiveImage
          thumbnailSource={{
            uri: item.preview,
          }}
          transparentBackground="transparent"
          source={{ uri: item.photo }}
          style={styles.roundImage}
        />
        {/* <Image style={styles.roundImage} source={{ uri: item.photo }} /> */}

        <View style={[styles.container, styles.left]}>
          <Text style={styles.bold}>{item.username}</Text>
          <Text style={styles.gray}>{item.bio}</Text>
        </View>

        <TouchableOpacity
          style={{
            marginRight: 12,
            borderWidth: 0.5,
            width: 90,
            borderRadius: 5,
            borderColor: "black",
          }}
          onPress={() => this.unBlockUser(item)}
        >
          <Text style={{ padding: 6, textAlign: "center" }}>Unblock</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  render() {
    const user = this.props.user;

    return (
      <View style={{ flex: 1 }}>
        {/* {flow && (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                padding: 24,
                justifyContent: "center",
                alignItems: "center",
                borderBottomColor: "gray",
                borderBottomWidth: 0.5,
              }}
            >
              <Feather
                style={{
                  margin: 0,
                }}
                name={"play"}
                size={32}
              />
              <Text style={{ fontSize: 16 }}>{`${views.length} views`}</Text>
            </View>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", margin: 10 }}
            >{`Liked by`}</Text>
          </View>
        )} */}
        <FlatList
          initialNumToRender="10"
          maxToRenderPerBatch="10"
          onEndThreshold={0}
          data={user.blockedUsers ? user.blockedUsers : []}
          ListEmptyComponent={<EmptyView desc="No Users Found" />}
          keyExtractor={(item) => JSON.stringify(item.uid)}
          renderItem={this.renderItem}
        />

        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { getUser, followUser, getBlockedUser, unblockUser },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockedUsers);
