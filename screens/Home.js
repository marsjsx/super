import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from "react-native";
import {
  getPosts,
  likePost,
  unlikePost,
  reportPost,
  getFilterPosts
} from "../actions/post";
import { getUser } from "../actions/user";
import moment from "moment";
import * as Font from "expo-font";
import DoubleTap from "../component/DoubleTap";
import ProgressiveImage from "../component/ProgressiveImage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { showLoader } from "../util/Loader";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      showLoading: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      "open-sans-bold": require("../assets/fonts/OpenSans-Bold.ttf")
    });
    this.setState({ fontLoaded: true });
    this.setState({ showLoading: true });
    await this.props.getPosts();
    this.setState({ showLoading: false });
  }

  likePost = post => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
  };

  onDoubleTap = post => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      // this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
  };

  navigateMap = item => {
    this.props.navigation.navigate("Map", {
      location: item.postLocation
    });
  };

  goToUser = user => {
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile");
  };

  render() {
    let userFollowingList = [this.props.user.following];
    if (this.props.post === null) return null;
    return (
      <View style={[styles.container, styles.center]}>
        <FlatList
          initialNumToRender="3"
          maxToRenderPerBatch="4"
          windowSize={8}
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          data={this.props.post.feed}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const liked = item.likes.includes(this.props.user.uid);
            return (
              <View id={item.id} style={{ padding: 0, marginBottom: 2 }}>
                <ProgressiveImage
                  thumbnailSource={{
                    uri: item.preview
                  }}
                  source={{ uri: item.postPhoto }}
                  style={styles.postPhoto}
                  resizeMode="cover"
                />

                <DoubleTap onDoubleTap={() => this.onDoubleTap(item)}>
                  <ImageBackground
                    style={[styles.postPhoto, { position: "absolute" }]}
                  >
                    <View style={[styles.bottom]}>
                      <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                        <Ionicons
                          style={{
                            margin: 5,
                            color: "rgb(255,255,255)"
                          }}
                          onPress={() =>
                            this.props.navigation.navigate("Comment", item)
                          }
                          name="ios-flag"
                          size={40}
                        />

                        <TouchableOpacity onPress={() => this.likePost(item)}>
                          <Ionicons
                            style={{ margin: 5 }}
                            color={liked ? "#db565b" : "#fff"}
                            name={liked ? "ios-heart" : "ios-heart-empty"}
                            size={40}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate("Comment", item)
                          }
                        >
                          <Ionicons
                            style={{ margin: 5, color: "rgb(255,255,255)" }}
                            name="ios-chatbubbles"
                            size={40}
                          />
                        </TouchableOpacity>
                        <Entypo
                          style={{ margin: 5, color: "rgb(255,255,255)" }}
                          name="forward"
                          size={40}
                        />
                      </View>

                      <View style={[styles.row]}>
                        <TouchableOpacity onPress={() => this.goToUser(item)}>
                          <ProgressiveImage
                            thumbnailSource={{
                              uri: item.preview
                            }}
                            transparentBackground="transparent"
                            source={{ uri: item.photo }}
                            style={styles.roundImage60}
                          />

                          {/* <Image
                            style={styles.roundImage60}
                            source={{ uri: item.photo }}
                          /> */}
                        </TouchableOpacity>
                        <View>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "flex-start"
                            }}
                          >
                            {this.state.fontLoaded ? (
                              <Text
                                style={{
                                  fontFamily: "open-sans-bold",
                                  fontSize: 18,
                                  color: "rgb(255,255,255)"
                                }}
                              >
                                {item.username}
                              </Text>
                            ) : null}
                          </View>

                          <Text style={[styles.white, styles.small]}>
                            {moment(item.date).format("ll")}
                          </Text>
                          {/* <TouchableOpacity
                            onPress={() => this.navigateMap(item)}
                          > */}
                          <TouchableOpacity>
                            <Text
                              style={styles.textD}
                              ellipsizeMode="tail"
                              numberOfLines={2}
                            >
                              {item.postLocation
                                ? item.postLocation.name
                                : null}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={{ margin: 5 }}>
                        <Text style={styles.textD}>{item.postDescription}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </DoubleTap>
              </View>
            );
          }}
        />
        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getPosts, likePost, unlikePost, getUser, reportPost, getFilterPosts },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    post: state.post,
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
