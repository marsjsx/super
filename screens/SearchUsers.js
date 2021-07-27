import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import db from "../config/firebase";
import { getUser } from "../actions/user";
import { getMorePosts } from "../actions/post";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ProgressiveImage from "../component/ProgressiveImage";
import _ from "lodash";
const { height, width } = Dimensions.get("window");

import { isUserBlocked } from "../util/Helper";
import Scale from "../helpers/Scale";

const aspectRatio = width / height;
class SearchUsers extends React.Component {
  state = {
    search: "",
    focused: false,
    showLoading: false,
    refreshing: false,
    searchingUser: false,
    query: [],
    users: [],
    timer: null,
  };

  componentDidMount() {}

  searchUser = async () => {
    let search = [];
    this.setState({ searchingUser: true });
    const query = await db
      .collection("users")
      .where("user_name", ">=", this.state.search.trim().toLowerCase())
      .where("user_name", "<", this.state.search.trim().toLowerCase() + `z`)

      .limit(20)
      .get();
    query.forEach((response) => {
      let user = response.data();
      if (!isUserBlocked(this.props.user, user.uid)) {
        search.push(user);
      }
    });
    this.setState({ query: search });

    var mergedArray = search.concat(this.state.users);
    var uniqueUsersByID = _.uniqBy(mergedArray, "uid");
    this.setState({ searchingUser: false });
    this.setState({ users: uniqueUsersByID });
  };
  searchFilterFunction = (text) => {
    this.setState({ search: text });
    const newData = this.state.users.filter((item) => {
      const itemData = `${item.username.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ query: newData });
    if (newData.length < 1) {
      //search data from api
      this.start(text);
    }
  };
  onChangeHandler = async (message) => {
    this.start(message);
  };

  goToUser = (user) => {
    this.props.navigation.navigate("Profile", { uid: user.uid });
  };

  onSelect = (item, index) => {
    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
    this.props.navigation.navigate("PostListScreen", {
      selectedIndex: index,
      route: routeName,
    });
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
      //search users here
      this.searchUser();
      this.resetTimer();
    }, 600);
    this.setState({ timer });

    //  this.props.updateDescription(searchQuery)
  }

  searchUserHeaderComponent() {
    if (this.state.searchingUser) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            margin: 10,
          }}
        >
          <ActivityIndicator />
          <Text
            style={{ margin: 5 }}
          >{`Searching for "${this.state.search}"`}</Text>
        </View>
      );
    }
    return null;
  }
  renderUserItem = ({ item, index }) => (
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
    </TouchableOpacity>
  );
  renderPostItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.center,
        styles.squareLarge,
        { marginRight: 3, marginBottom: 3 },
      ]}
      onPress={() => [this.onSelect(item, index)]}
    >
      <ProgressiveImage
        thumbnailSource={{
          uri: item.preview,
        }}
        source={{ uri: item.postPhoto }}
        style={styles.squareLarge}
        type={item.type}
        resizeMode="cover"
      />
      {item.type === "video" ? (
        <Ionicons
          name="ios-play"
          size={40}
          color="white"
          style={{
            backgroundColor: "transparent",
            alignSelf: "center",
            position: "absolute",
          }}
        />
      ) : null}
    </TouchableOpacity>
  );

  getUserItemLayout = (data, index) => ({
    length: Scale.moderateScale(60),
    offset: Scale.moderateScale(60) * index,
    index,
  });

  getPostItemLayout = (data, index) => ({
    length: width * 0.33 * (height / width),
    offset: width * 0.33 * (height / width) * index,
    index,
  });
  listHeaderComponent() {
    return (
      <View style={[styles.container, {}]}>
        <View style={[styles.row, styles.center, { marginTop: 48 }]}>
          <TextInput
            ref="input"
            style={{
              flex: 1,
              height: 40,
              margin: 10,
              padding: 10,
              borderColor: "#d3d3d3",
              borderWidth: 1,
              borderRadius: 5,
              fontSize: 16,
            }}
            onChangeText={(search) => this.searchFilterFunction(search.trim())}
            value={this.state.search}
            returnKeyType="send"
            placeholder="Search users"
            autoFocus={true}
            onFocus={() => this.setState({ focused: true })}
            // onBlur={() => alert("onBlured")}
            onSubmitEditing={this.searchUser}
          />
          {this.state.focused && (
            <TouchableOpacity
              onPress={() => {
                this.refs.input.blur();
                this.setState({ focused: false });
                this.props.navigation.goBack();
              }}
            >
              <Text style={{ color: "blue", margin: 10 }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.focused &&
          !this.state.searchingUser &&
          this.state.query.length < 1 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
              }}
            >
              <Text>Find friends and family</Text>
            </View>
          )}
        {this.state.focused && (
          <FlatList
            initialNumToRender="10"
            maxToRenderPerBatch="6"
            windowSize={10}
            ListHeaderComponent={this.searchUserHeaderComponent()}
            data={this.state.query}
            keyExtractor={(item) => item.uid}
            renderItem={this.renderUserItem}
            getItemLayout={this.getUserItemLayout}
          />
        )}
      </View>
    );
  }
  // Render Footer
  renderFooter = () => {
    try {
      // Check If Loading
      if (this.state.refreshing) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return this.listHeaderComponent();
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser, getMorePosts }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchUsers);
