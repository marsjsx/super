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
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { addComment, getComments, likePost, unlikePost } from "../actions/post";
import moment from "moment";
import EmptyView from "../component/emptyview";
import FastImage from "react-native-fast-image";
import { showMessage, hideMessage } from "react-native-flash-message";
import { getUser } from "../actions/user";
import Scale from "../helpers/Scale";
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
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params.username,
    };
  };

  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.state = {
      comment: "",
      post: null,
    };
  }

  componentDidMount = () => {
    const { params } = this.props.navigation.state;

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

    const { params } = this.props.navigation.state;
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
    const { params } = this.props.navigation.state;

    const liked = item.likes && item.likes.includes(this.props.user.uid);
    // alert(JSON.stringify(item.views));
    return (
      <View
        style={{
          borderBottomColor: "grey",
          borderBottomWidth: 0.5,
          marginBottom: Scale.moderateScale(20),
        }}
      >
        <View
          style={{
            margin: Scale.moderateScale(20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                flex: 1,
              }}
              onPress={() => this.likePost(item)}
            >
              <Ionicons
                style={{
                  margin: 0,
                }}
                color={"#db565b"}
                name={liked ? "ios-heart" : "ios-heart-empty"}
                size={40}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: "center",
                flex: 1,
              }}
              onPress={() => this.props.navigation.navigate("Comment", item)}
            >
              <Icon name="message-circle" size={40} color="#7fff00" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    textAlign: "center",
                  },
                ]}
              >
                Views
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: Scale.moderateScale(10),
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("LikersAndViewers", {
                  data: item.likes,
                  title: "Likes",
                })
              }
              style={{
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    textAlign: "center",
                  },
                ]}
              >
                {item.likes && item.likes.length > 0 ? item.likes.length : "-"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    textAlign: "center",
                  },
                ]}
              >
                {params.comments && params.comments.length > 0
                  ? params.comments.length
                  : "-"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    textAlign: "center",
                  },
                ]}
              >
                {item.viewers.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { params } = this.props.navigation.state;
    // alert(JSON.stringify(this.state.post));

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={[styles.container, { marginTop: 90 }]}
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
          {this.state.post && this.renderTopBar(this.state.post)}
          {/* {this.renderTopBar(params)} */}

          {/* <KeyboardAvoidingView
            enabled
            behavior="padding"
            style={[styles.container]}
          > */}
          <FlatList
            keyExtractor={(item) => JSON.stringify(item.date)}
            data={this.props.post.comments}
            renderItem={({ item }) => (
              <View style={[styles.row, styles.space]}>
                <TouchableOpacity
                  onPress={() => this.goToUser(item.commenterId)}
                >
                  <FastImage
                    style={styles.roundImage60s}
                    source={{ uri: item.commenterPhoto }}
                  />
                </TouchableOpacity>
                <View style={[styles.container, styles.left]}>
                  <Text style={styles.bold}>{item.commenterName}</Text>
                  <Text style={styles.grey}>{item.comment}</Text>
                  <Text style={[styles.grey, styles.medium]}>
                    {moment(item.date).format("ll")}
                  </Text>
                </View>
              </View>
            )}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TextInput
              style={[styles.input, {}]}
              onChangeText={(comment) => this.setState({ comment })}
              value={this.state.comment}
              returnKeyType="done"
              multiline
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

          {/* </KeyboardAvoidingView> */}
        </View>
      </KeyboardAvoidingView>
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
