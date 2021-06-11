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
  ImageBackground,
} from "react-native";
import db from "../config/firebase";
import { getUser } from "../actions/user";
import { getChannels } from "../actions/channels";
import { getMorePosts } from "../actions/post";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ProgressiveImage from "../component/ProgressiveImage";
import _ from "lodash";
const { height, width } = Dimensions.get("window");
import { uploadChannels, uploadChannelPosts } from "../actions/InitialData";
import { isUserBlocked } from "../util/Helper";
import Scale from "../helpers/Scale";
import { showLoader } from "../util/Loader";
const aspectRatio = width / height;
import FlatListSlider from "../component/imageslider/FlatListSlider";
class Channels extends React.Component {
  state = {
    search: "",
    focused: false,
    showLoading: false,
    refreshing: false,
    searchingUser: false,
    query: [],
    users: [],
    timer: null,
    data: [
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/1%20copy.png?alt=media&token=0062c4e0-2fc3-42ff-8f78-c453e8ddad00",
        desc: "Silent Waters in the mountains in midst of Himilayas",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/2%20copy.png?alt=media&token=ebbfeb6f-1fd0-4e94-a23c-7049116dff2b",
        desc:
          "Red fort in India New Delhi is a magnificient masterpeiece of humans",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/3%20copy.png?alt=media&token=78f2dd05-49c8-476a-adc2-ba2502811ad4",
        desc:
          "Sample Description below the image for representation purpose only",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/4%20copy.png?alt=media&token=3b5d284b-8e7a-45b9-9bf7-e3e3b7a7b0d7",
        desc:
          "Sample Description below the image for representation purpose only",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/5.png?alt=media&token=faf13992-11d1-4fac-af0f-a488e0974d65",
        desc:
          "Sample Description below the image for representation purpose only",
      },
    ],
  };

  componentDidMount() {
    // uploadChannels();
    // uploadChannelPosts();

    if (!(this.props.channels && this.props.channels.channelsList.length > 0)) {
      // get list of channels
      this.props.getChannels();
    }

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
    this.setState({ search: text });
    // const newData = this.state.users.filter((item) => {
    //   const itemData = `${item.username.toUpperCase()}`;

    //   const textData = text.toUpperCase();
    //   // alert(textData);

    //   return itemData.indexOf(textData) > -1;
    // });

    // this.setState({ query: newData });
    // if (newData.length < 1) {
    //   //search data from api
    //   this.start(text);
    // }
  };
  onChangeHandler = async (message) => {
    this.start(message);
  };

  goToUser = (user) => {
    // this.props.navigation.navigate("Profile");
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
      onPress={() => {
        this.props.navigation.navigate("ChannelPostScreen", {
          selectedIndex: 0,
          route: "Channels",
          channelId: item.id,
          marginTop: Scale.moderateScale(20),
        });
      }}
    >
      <ProgressiveImage
        // thumbnailSource={{
        //   uri: item.preview,
        // }}
        source={{ uri: item.background }}
        style={{ height: Scale.moderateScale(130) }}
        resizeMode="cover"
      />
      <View
        style={{
          position: "absolute",
          height: Scale.moderateScale(130),
          alignItems: "center",
          width: "100%",
          opacity: 0.3,
          // flex: 1,
          backgroundColor: "#000",
        }}
      />
      <View
        style={{
          position: "absolute",
          height: Scale.moderateScale(130),
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
            fontWeight: "bold",
            fontSize: Scale.moderateScale(20),
            letterSpacing: Scale.moderateScale(6),
            margin: Scale.moderateScale(16),
          }}
        >
          {item.name}
        </Text>
      </View>
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
      <View style={{ marginBottom: Scale.moderateScale(12) }}>
        <FlatListSlider
          data={this.state.data}
          height={Scale.moderateScale(200)}
          timer={5000}
          onPress={(item) => alert(JSON.stringify(item))}
          indicatorContainerStyle={{ position: "absolute", bottom: 20 }}
          indicatorActiveColor={"#8e44ad"}
          indicatorInActiveColor={"#ffffff"}
          indicatorActiveWidth={30}
          animation
        />

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
            // onSubmitEditing={this.searchUser}
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

        <Text
          style={{
            fontSize: Scale.moderateScale(28),
            marginHorizontal: Scale.moderateScale(10),
            marginVertical: Scale.moderateScale(32),
            fontWeight: "400",
            letterSpacing: 2,
            display: "none",
            lineHeight: Scale.moderateScale(45),
          }}
        >
          {"Welcome to Super's Channels"}
        </Text>
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

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: Scale.moderateScale(10),
          width: "100%",
          // backgroundColor: "#000",
        }}
      />
    );
  };

  render() {
    return (
      // <ScrollView>
      <SafeAreaView style={styles.container}>
        {this.props.channels.loading
          ? showLoader("Loading, Please wait... ")
          : null}
        <View>
          <FlatList
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={12}
            contentContainerStyle={{
              paddingBottom: 100,
              marginTop: Scale.moderateScale(8),
            }}
            horizontal={false}
            // numColumns={3}
            ListHeaderComponent={this.listHeaderComponent()}
            data={this.props.channels.channelsList}
            keyExtractor={(item) => item.id}
            renderItem={this.renderPostItem}
            onEndReachedThreshold={1}
            ListFooterComponent={this.renderFooter}
            ItemSeparatorComponent={this.FlatListItemSeparator}
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
  return bindActionCreators({ getUser, getMorePosts, getChannels }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    channels: state.channels,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
