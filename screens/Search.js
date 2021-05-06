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
class Search extends React.Component {
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

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => {
            this.props.navigation.navigate("SearchUsers");
          }}
        >
          <Ionicons name="ios-search" size={32} color="black" />
        </TouchableOpacity>
      ),
    });
  }

  searchUser = async () => {
    let search = [];
    this.setState({ searchingUser: true });

    // alert(this.state.search.trim().toLowerCase());
    const query = await db
      .collection("users")
      .where("user_name", ">=", this.state.search.trim().toLowerCase())
      .where("user_name", "<", this.state.search.trim().toLowerCase() + `z`)
      // .where("username", ">=", this.state.search.trim().toLowerCase())
      // .where("username", "<", this.state.search.trim() + `z`)
      .limit(20)
      .get();
    query.forEach((response) => {
      // if (
      //   response
      //     .data()
      //     .username.includes(this.state.search.trim().toUpperCase())
      // ) {
      //   // 0;
      //   search.push(response.data());
      // }
      // const itemData = `${response.data().username.toUpperCase()}`;

      // const textData = this.state.search.trim().toUpperCase();

      // if (itemData.indexOf(textData) > -1) {
      //   search.push(response.data());
      // }

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
    // const newData = this.state.users.filter((item) => {
    //   const itemData = `${item.username.toUpperCase()}`;

    //   const textData = this.state.search.toUpperCase();

    //   return itemData.indexOf(textData) > -1;
    // });

    //    this.searchFilterFunction(this.state.search);
  };
  searchFilterFunction = (text) => {
    // alert(text);
    this.setState({ search: text });
    const newData = this.state.users.filter((item) => {
      const itemData = `${item.username.toUpperCase()}`;

      const textData = text.toUpperCase();
      // alert(textData);

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
      <View>
        <View
          style={[
            styles.container,
            styles.row,
            styles.center,
            { display: "none" },
          ]}
        >
          <TextInput
            ref="input"
            style={[styles.inputSearch]}
            onChangeText={(search) => this.searchFilterFunction(search.trim())}
            value={this.state.search}
            returnKeyType="send"
            placeholder="Search"
            onFocus={() => this.setState({ focused: true })}
            // onBlur={() => alert("onBlured")}
            onSubmitEditing={this.searchUser}
          />
          {this.state.focused && (
            <TouchableOpacity
              onPress={() => {
                this.refs.input.blur();
                this.setState({ focused: false });
              }}
            >
              <Text style={{ color: "blue", padding: 10 }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
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
              <Text>No User Found</Text>
            </View>
          )}
        {/* 
        <TouchableOpacity
          style={{ backgroundColor: "#000", alignItems: "center" }}
          onPress={() => this.props.navigation.navigate("Channels")}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: Scale.moderateScale(20),
              letterSpacing: Scale.moderateScale(6),
              margin: Scale.moderateScale(24),
            }}
          >
            {"CHANNELS"}
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Channels")}
        >
          <ProgressiveImage
            // thumbnailSource={{
            //   uri: item.preview,
            // }}
            source={{
              uri:
                "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fskate.jpeg?alt=media&token=73c51ea0-9634-43f0-beef-bc7c2ce93cc4",
            }}
            style={{ height: Scale.moderateScale(160) }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              height: Scale.moderateScale(1450),
              alignItems: "center",
              width: "100%",
              opacity: 0.5,
              // flex: 1,
              backgroundColor: "#000",
            }}
          />
          <View
            style={{
              position: "absolute",
              height: Scale.moderateScale(145),
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              // flex: 1,
              // backgroundColor: "#000",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "300",
                fontSize: Scale.moderateScale(28),
                letterSpacing: Scale.moderateScale(8),
              }}
            >
              {"CHANNELS"}
            </Text>
          </View>
        </TouchableOpacity>
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
  // Retrieve More
  retrieveMore = async () => {
    if (!this.state.refreshing) {
      this.setState({
        refreshing: true,
      });
      // alert("More Called");
      try {
        // Set State: Refreshing
        // this.setState({
        //   refreshing: true,
        // });
        // alert("More Called");

        await this.props.getMorePosts();
        this.setState({
          refreshing: false,
        });
        // alert("Load More");
      } catch (error) {
        // alert(error);
        console.log(error);
        this.setState({
          refreshing: false,
        });
      }
    }
  };

  render() {
    return (
      // <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={12}
            contentContainerStyle={{ paddingBottom: 100, marginTop: 16 }}
            horizontal={false}
            numColumns={3}
            ListHeaderComponent={this.listHeaderComponent()}
            data={this.props.post.feed}
            keyExtractor={(item) => item.id}
            renderItem={this.renderPostItem}
            // removeClippedSubviews={true}
            onEndReachedThreshold={1}
            ListFooterComponent={this.renderFooter}
            // On End Reached (Takes a function)
            onEndReached={this.retrieveMore}
            // Refreshing (Set To True When End Reached)
            refreshing={this.state.refreshing}
            getItemLayout={this.getPostItemLayout}
          />
        </View>
      </SafeAreaView>
      // </ScrollView>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
