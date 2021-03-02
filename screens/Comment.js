import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from "react-native";
const { height, width } = Dimensions.get("window");

import { addComment, getComments, likePost, unlikePost } from "../actions/post";
import moment from "moment";
import EmptyView from "../component/emptyview";
import FastImage from "react-native-fast-image";
import { showMessage, hideMessage } from "react-native-flash-message";
import { getUser } from "../actions/user";
import Scale from "../helpers/Scale";
import ProgressiveImage from "../component/ProgressiveImage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Octicons,
} from "@expo/vector-icons";

import Icon from "react-native-vector-icons/Feather";

class Comment extends React.Component {


  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.state = {
      comment: "",
      post: null,
    };
  }

  componentDidMount = () => {
    // const { params } = this.props.navigation.state;
    const { params } = this.props.route;

    this.setState({ post: params });
    // alert(JSON.stringify(this.state.post));

    // alert(JSON.stringify(params.username));
    this.props.getComments(params);
  };

  postComment = () => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }
    if (this.state.comment.length < 2) {
      showMessage({
        message: "STOP",
        description: "Can't post empty comment",
        type: "danger",
        duration: 3000,
      });

      return;
    }

    // const { params } = this.props.navigation.state;
    const { params } = this.props.route;
    this.props.addComment(this.state.comment, params);
    this.setState({ comment: "" });
  };

  goToUser = async (uid) => {
    // await this.props.getUser(uid);
    // this.props.navigation.navigate("Profile");
    this.props.navigation.navigate("Profile", { uid: uid });
  };
  likePost = (post) => {
    // this.props.filterBlockedPosts();

    var post = { ...this.state.post };
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);

      var index = post.likes.indexOf(this.props.user.uid);
      post.likes.splice(index, 1);
      // post.likes.remove(this.props.user.uid);
    } else {
      this.props.likePost(post);
      if (!post.likes) {
        post.likes = [];
      }
      post.likes.push(this.props.user.uid);
    }
    this.setState({ post: post });
  };

  renderTopBar(item) {
    // const { params } = this.props.navigation.state;
    const { params } = this.props.route;
    const liked = item.likes && item.likes.includes(this.props.user.uid);
    // alert(JSON.stringify(item.views));
    return (
      <View
        style={{
          // borderBottomColor: "grey",
          // borderBottomWidth: 0.5,
          backgroundColor: "#f0f8ff",
          marginBottom: Scale.moderateScale(10),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <ProgressiveImage
            thumbnailSource={{
              uri: item.preview,
            }}
            source={{ uri: item.postPhoto }}
            style={{
              width: width * 0.55,
              height: width * 0.85,
              margin: 1,
              backgroundColor: "#d3d3d3",
            }}
            type={item.type}
            resizeMode="cover"
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                marginVertical: Scale.moderateScale(10),
              }}
              onPress={() =>
                this.props.navigation.navigate("LikersAndViewers", {
                  data: item.likes,
                  title: "Likes",
                })
              }
            >
              <Text
                style={[
                  {
                    fontSize: Scale.moderateScale(20),
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                ]}
              >
                {item.likes && item.likes.length > 0 ? item.likes.length : "-"}
              </Text>
              <Text
                style={[
                  {
                    fontSize: Scale.moderateScale(14),
                    textAlign: "center",
                    fontWeight: "500",
                    marginTop: Scale.moderateScale(8),
                  },
                ]}
              >
                {"likes"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                marginVertical: Scale.moderateScale(10),
              }}
              onPress={() =>
                this.props.navigation.navigate("LikersAndViewers", {
                  views: item.viewers,
                  data: item.likes,
                  flow: "Views",
                  title: "Views and likes",
                })
              }
            >
              <Text
                style={[
                  {
                    fontSize: Scale.moderateScale(20),
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                ]}
              >
                {item.viewers.length}
              </Text>
              <Text
                style={[
                  {
                    fontSize: Scale.moderateScale(14),
                    textAlign: "center",
                    fontWeight: "500",
                    marginTop: Scale.moderateScale(8),
                  },
                ]}
              >
                {"views"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                marginVertical: Scale.moderateScale(10),
              }}
            >
              <Text
                style={[
                  {
                    fontSize: Scale.moderateScale(20),
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                ]}
              >
                {params.comments && params.comments.length > 0
                  ? params.comments.length
                  : "-"}
              </Text>
              <Text
                style={[
                  {
                    fontSize: Scale.moderateScale(14),
                    textAlign: "center",
                    fontWeight: "500",
                    marginTop: Scale.moderateScale(8),
                  },
                ]}
              >
                {"comments"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    // const { params } = this.props.navigation.state;
    const { params } = this.props.route;
    // alert(JSON.stringify(this.state.post));

    return (
      // <KeyboardAvoidingView
      //   behavior={Platform.OS == "ios" ? "padding" : "height"}
      //   style={[styles.container, { marginTop: 90 }]}
      // >
      // <View style={[styles.container]}>
      <KeyboardAwareScrollView
        style={{}}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
      >
        <View style={{ height: 0 }}>
          <EmptyView
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            navigation={this.props.navigation}
          />
        </View>
        <View style={[styles.container, { top: 0 }]}>
          {/* {this.state.post && this.renderTopBar(this.state.post)} */}
          {this.renderTopBar(params)}

          {/* <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={[styles.container]}
          > */}
          {params &&
            params.postDescription &&
            params.postDescription.length > 2 && (
              <View
                style={[
                  styles.row,
                  styles.space,
                  {
                    borderBottomColor: "grey",
                    borderBottomWidth: 0.3,
                    marginHorizontal: 8,
                    marginBottom: 10,
                  },
                ]}
              >
                <TouchableOpacity>
                  <FastImage
                    style={styles.roundImage}
                    source={{ uri: params.photo }}
                  />
                </TouchableOpacity>
                <View style={[styles.container, styles.left]}>
                  <Text style={styles.bold}>
                    {params.username}{" "}
                    <Text style={[styles.black, { fontWeight: "400" }]}>
                      {params.postDescription}
                    </Text>
                  </Text>

                  <Text style={[styles.black, styles.bold, styles.medium]}>
                    {moment(params.date).format("ll")}
                  </Text>
                </View>
              </View>
            )}

          <FlatList
            keyExtractor={(item) => JSON.stringify(item.date)}
            data={this.props.post.comments}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.row,
                  styles.space,
                  {
                    // borderBottomColor: "grey",
                    // borderBottomWidth: 0.4,
                    marginHorizontal: 8,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.goToUser(item.commenterId)}
                >
                  <FastImage
                    style={styles.roundImage}
                    source={{ uri: item.commenterPhoto }}
                  />
                </TouchableOpacity>
                <View style={[styles.container, styles.left]}>
                  <Text style={styles.bold}>
                    {item.commenterName}{" "}
                    <Text style={[styles.black, { fontWeight: "400" }]}>
                      {item.comment}
                    </Text>
                  </Text>

                  <Text style={[styles.black, styles.bold, styles.medium]}>
                    {moment(item.date).format("ll")}
                  </Text>
                </View>
              </View>
            )}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <TextInput
              style={[styles.input, {}]}
              onChangeText={(comment) => this.setState({ comment })}
              value={this.state.comment}
              returnKeyType="done"
              // multiline
              scrollEnabled={false}
              maxLength={255}
              placeholder="Add Comment"
              onSubmitEditing={this.postComment}
            />
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={this.postComment}
            >
              <Text style={{ color: "blue" }}>Send</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{ height: 60 }} /> */}
          {/* </KeyboardAvoidingView> */}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addComment,
      getComments,
      getUser,
      likePost,

      unlikePost,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
