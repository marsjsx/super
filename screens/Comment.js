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
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
const { height, width } = Dimensions.get("window");
import EditPostCaptionModal from "../component/EditPostCaptionModal";
import constants from "../constants";

import {
  addComment,
  getComments,
  likePost,
  unlikePost,
  updatePost,
  deletePostComment,
} from "../actions/post";
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
  MaterialIcons,
} from "@expo/vector-icons";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.state = {
      comment: "",
      post: null,
      showEditPostCaptionModal: false,
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

  deleteComment(post, index) {
    Alert.alert("Alert ", "Are you sure you want to delete this comment?", [
      {
        text: "Delete",
        onPress: () => {
          this.props.deletePostComment(post, index);
        },
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      // { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  }

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
          paddingVertical: Scale.moderateScale(10),
          borderColor: "rgba(255, 255, 255, 0.7)",
          // marginTop: Scale.moderateScale(24),
          borderBottomWidth: 0.5,
          borderTopWidth: 0.5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.white,
              { fontSize: Scale.moderateScale(14), fontWeight: "700" },
            ]}
          >
            {moment(item.date).format("ll")}
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons color="white" name="message" size={32} />

            <Text
              style={[
                {
                  fontSize: Scale.moderateScale(14),
                  textAlign: "center",
                  fontWeight: "700",
                  marginHorizontal: 8,
                  color: "#fff",
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              this.props.navigation.navigate("LikersAndViewers", {
                views: item.viewers,
                data: item.viewers,
                flow: "Views",
                title: "Views",
              })
            }
          >
            <Ionicons color="white" name="ios-eye" size={32} />

            <Text
              style={[
                {
                  fontSize: Scale.moderateScale(14),
                  textAlign: "center",
                  fontWeight: "700",
                  marginHorizontal: 8,
                  color: "#fff",
                },
              ]}
            >
              {item.viewers.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

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
                display: "none",
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
                  data: item.viewers,
                  flow: "Views",
                  title: "Views",
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
  FlatListItemSeparator = () => {
    return (
      <View
        style={[
          {
            marginVertical: Scale.moderateScale(5),
            width: "100%",
            backgroundColor: "#dcdcdc",
            height: 0.5,
            // backgroundColor: "#000",
          },
        ]}
      />
    );
  };

  handleOnUpdate = async (postDescription) => {
    const { params } = this.props.route;

    if (!postDescription) {
      showMessage({
        message: "STOP",
        description: "Post Description can not be empty",
        type: "danger",
        duration: 2000,
      });
      return;
    }

    params.postDescription = postDescription;

    this.props.updatePost(params);

    this.setState({ showEditPostCaptionModal: false });
  };

  render() {
    // const { params } = this.props.navigation.state;
    const { params } = this.props.route;
    // alert(JSON.stringify(this.state.post));

    return (
      // <KeyboardAvoidingView
      //   behavior={Platform.OS == "ios" ? "padding" : "height"}
      //   style={[styles.container, { marginTop: 90 }]}
      // >
      <View style={[styles.container]}>
        {/* <ImageBackground
          source={{ uri: params.postPhoto }}
          style={[styles.container]}
        /> */}
        <FastImage
          source={
            params.type == "video"
              ? constants.images.backgroundImagePlaceholder
              : { uri: params.postPhoto }
          }
          style={[styles.container]}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            alignItems: "center",
            width: "100%",
            opacity: 0.2,
            // flex: 1,
            backgroundColor: "#000",
          }}
        />
        <KeyboardAwareScrollView
          style={{
            position: "absolute",
            top: Scale.moderateScale(85),
            right: 0,
            bottom: 0,
            left: 0,
            borderTopColor: "rgba(255, 255, 255, 0.7)",
            borderTopWidth: 1,
          }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={[styles.container, {}]}
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

            {/* {params &&
              params.postDescription &&
              params.postDescription.length > 2 && ( */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.white,
                  {
                    fontSize: 18,
                    marginVertical: 24,
                    marginHorizontal: 16,
                    fontWeight: "700",
                    lineHeight: 25,
                    letterSpacing: 0.2,
                    flex: 1,
                  },
                ]}
              >
                {params.postDescription && params.postDescription.length > 2
                  ? params.postDescription
                  : "-"}
              </Text>

              {this.props.user && this.props.user.uid == params.uid && (
                <MaterialCommunityIcons
                  style={{
                    marginHorizontal: 8,
                  }}
                  name="lead-pencil"
                  size={24}
                  color={"#fff"}
                  onPress={() => {
                    this.setState({
                      showEditPostCaptionModal: true,
                    });
                  }}
                />
              )}
            </View>
            {/* )} */}
            {/* <Text
              style={[
                styles.white,
                {
                  fontSize: 18,
                  marginVertical: 24,
                  marginHorizontal: 16,
                  fontWeight: "700",
                  lineHeight: 25,
                  letterSpacing: 0.2,
                },
              ]}
            >
              {"This is demo post description to check screen designing "}
            </Text> */}
            {this.renderTopBar(params)}

            {/* <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={[styles.container]}
          > */}
            {/* {params &&
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
                    display: "none",
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
            )} */}

            <FlatList
              keyExtractor={(item) => JSON.stringify(item.date)}
              data={this.props.post.comments}
              contentContainerStyle={{ marginTop: Scale.moderateScale(10) }}
              ListEmptyComponent={
                <EmptyView
                  title="No Comments Yet"
                  desc="Be the first to comment"
                  titleStyle={{ color: "#fff" }}
                  descStyle={{ color: "#fff" }}
                />
              }
              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    {
                      // borderBottomColor: "grey",
                      // borderBottomWidth: 0.4,
                      flex: 1,
                      marginHorizontal: 8,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.goToUser(item.commenterId)}
                    >
                      <FastImage
                        style={styles.roundImage}
                        source={{ uri: item.commenterPhoto }}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            {
                              fontSize: Scale.moderateScale(14),
                              fontWeight: "bold",
                              letterSpacing: 0.2,
                              color: "#fff",
                            },
                          ]}
                        >
                          {item.commenterName}{" "}
                        </Text>
                        <Text
                          style={[
                            {
                              flex: 1,
                              textAlign: "right",
                              marginHorizontal: Scale.moderateScale(10),
                              fontSize: Scale.moderateScale(12),
                              color: "#fff",
                            },
                          ]}
                        >
                          {moment(item.date).format("ll")}
                        </Text>
                      </View>
                      <Text
                        style={[
                          {
                            fontSize: Scale.moderateScale(12),
                            color: "#fff",
                            letterSpacing: 0.2,
                          },
                        ]}
                      >
                        {item.comment}
                      </Text>
                    </View>
                  </View>
                  {this.props.user.uid === item.commenterId && (
                    <TouchableOpacity
                      onPress={() => {
                        this.deleteComment(params, index);
                      }}
                      style={{ alignSelf: "flex-end" }}
                    >
                      <Text
                        style={[
                          {
                            fontSize: Scale.moderateScale(12),
                            fontWeight: "bold",
                            letterSpacing: 0.2,
                            color: "#fff",
                            marginHorizontal: Scale.moderateScale(16),
                          },
                        ]}
                      >
                        {"Delete"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* <View style={[styles.container, styles.left]}>
                  <Text style={styles.bold}>
                    {item.commenterName}{" "}
                    <Text style={[styles.black, { fontWeight: "400" }]}>
                      {item.comment}
                    </Text>
                  </Text>

                  <Text style={[styles.black, styles.bold, styles.medium]}>
                    {moment(item.date).format("ll")}
                  </Text>
                </View> */}
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
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                placeholder="Write a comment"
                onSubmitEditing={this.postComment}
              />
              <TouchableOpacity
                style={{ justifyContent: "center" }}
                onPress={this.postComment}
              >
                <Text style={{ color: "#fff" }}>Send</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{ height: 60 }} /> */}
            {/* </KeyboardAvoidingView> */}
          </View>

          {this.state.showEditPostCaptionModal ? (
            <EditPostCaptionModal
              Show={true}
              postDescription={
                !params.postDescription ? "" : params.postDescription
              }
              Hide={() => {
                this.setState({
                  showEditPostCaptionModal: false,
                });
              }}
              onSave={(postDescription) => {
                this.handleOnUpdate(postDescription);
              }}
            />
          ) : null}
        </KeyboardAwareScrollView>
      </View>
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
      updatePost,
      unlikePost,
      deletePostComment,
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
