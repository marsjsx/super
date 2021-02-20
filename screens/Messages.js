import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons } from "@expo/vector-icons";
import { orderBy } from "lodash";
import ProgressiveImage from "../component/ProgressiveImage";
import EmptyView from "../component/emptyview";
import Swipeout from "react-native-swipeout";
import Snackbar from "react-native-snackbar";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getMessages, deleteUserMessages } from "../actions/message";
import moment from "moment";
import { groupBy, values } from "lodash";
import {
  Container,
  Badge,
  Header,
  Content,
  List,
  ListItem,
  Title,
  Subtitle,
  Left,
  Body,
  Right,
  Icon,
  Thumbnail,
} from "native-base";
import { Ionicons } from "react-native-vector-icons";
import Scale from "../helpers/Scale";

class Messages extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   //Show Header by returning header
  //   return {
  //     headerRight: (
  //       <TouchableOpacity
  //         style={{ marginRight: 24 }}
  //         onPress={navigation.getParam("newMessage")}
  //       >
  //         <Ionicons
  //           style={{
  //             color: "#000",
  //           }}
  //           name="md-add"
  //           size={32}
  //         />
  //       </TouchableOpacity>
  //     ),
  //   };
  // };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount = () => {
    if (!this.props.messages) {
      this.props.getMessages();
    }
    // this.props.navigation.setParams({
    //   newMessage: this.goToNewMessage,
    // });

    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 24 }}
          onPress={() => this.goToNewMessage()}
        >
          <Ionicons
            style={{
              color: "#000",
            }}
            name="md-add"
            size={32}
          />
        </TouchableOpacity>
      ),
    });
  };

  goToNewMessage = () => {
    this.props.navigation.navigate("NewMessage");
  };

  goToChat = (members, username) => {
    const uid = members.filter((id) => id !== this.props.user.uid);

    this.props.navigation.navigate("Chat", {
      uid: uid[0],
      title: username,
    });
  };

  getLastMessage(message) {
    var lastMessage = message.chats[0];
    if (lastMessage.text) {
      return <LastMessage lastMessage={lastMessage.text} />;
    } else if (lastMessage.image) {
      return <LastMessage name="photo" lastMessage="Photo" />;
    } else if (lastMessage.location) {
      return <LastMessage name="my-location" lastMessage="Location" />;
    }
  }

  getUnSeenMessageCount(item) {
    let unseenMessageCount = 0;
    if (item.chats.length) {
      item.chats.forEach((element) => {
        if (!element.seenBy[this.props.user.uid]) {
          unseenMessageCount++;
        }
      });
    }

    return unseenMessageCount;
  }

  deleteMessages(item) {
    // alert(JSON.stringify(item.members));
    if (item && item.members) {
      if (Array.isArray(item.members)) {
        const uid = item.members.filter((id) => id !== this.props.user.uid);
        this.props.deleteUserMessages(uid);
      } else if (item.members.members) {
        if (Array.isArray(item.members.members)) {
          const uid = item.members.members.filter(
            (id) => id !== this.props.user.uid
          );
          this.props.deleteUserMessages(uid);
        }
      }
    } else {
      Snackbar.show({
        text: "Something went wrong",
        backgroundColor: constants.colors.info,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }

  onEndReached = async ({ distanceFromEnd }) => {
    if (!this.onEndReachedCalledDuringMomentum) {
      // alert("Called");

      if (!this.state.refreshing) {
        this.setState({
          refreshing: true,
        });
        try {
          await this.props.getMessages();
          this.setState({
            refreshing: false,
          });
        } catch (error) {
          console.log(error);
          this.setState({
            refreshing: false,
          });
        }
      }
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

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
    if (!this.props.user.uid || !this.props.messages.length) {
      return (
        <EmptyView
          desc="All user messages will appear here"
          button="Signup"
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={
            <Ionicons style={{ margin: 5 }} name="ios-chatbubbles" size={64} />
          }
        />
      );
    }
    // else if (!this.props.messages)
    //   return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container, { marginTop: 10 }]}>
        {/* {alert(JSON.stringify(this.props.messages.length))} */}
        <FlatList
          // keyExtractor={item => new Date().getTime()}
          keyExtractor={(item) => item.id}
          data={orderBy(this.props.messages, "updatedAt", "desc")}
          refreshing={this.state.refreshing}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item, index }) => {
            let swipeBtns = [
              {
                text: "Delete",
                backgroundColor: "red",
                underlayColor: "rgba(0, 0, 0, 1, 0.6)",
                onPress: () => {
                  this.deleteMessages(item);
                },
              },
            ];
            return (
              <Swipeout
                right={swipeBtns}
                autoClose="true"
                backgroundColor="transparent"
              >
                <TouchableHighlight>
                  <ListItem
                    avatar
                    onPress={() =>
                      this.goToChat(item.members, item.user.username)
                    }
                  >
                    <Left>
                      <ProgressiveImage
                        thumbnailSource={{
                          uri:
                            item.user.preview && item.user.preview.length > 10
                              ? item.user.preview
                              : item.user.photo,
                        }}
                        transparentBackground="transparent"
                        source={{ uri: item.user.photo }}
                        style={styles.roundImage60s}
                      />
                    </Left>
                    <Body>
                      <View
                        style={[styles.container, styles.center, styles.left]}
                      >
                        {/* <Text style={styles.bold}>{item.user.username}</Text> */}
                        <Title>{item.user.username}</Title>
                        {this.getLastMessage(item)}
                        {/* <Text style={styles.gray}>{this.getLastMessage(item)}</Text> */}
                        {/* <Text style={[styles.gray, styles.small]}>
                    {moment(item.updatedAt).format("ll")}
                  </Text> */}
                      </View>
                    </Body>
                    <Right>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={[styles.gray, { marginRight: 10 }]}>
                          {moment(item.updatedAt).format("ll")}
                        </Text>
                        <Icon name="arrow-forward" />
                      </View>

                      {this.getUnSeenMessageCount(item) ? (
                        <Badge
                          style={{
                            marginRight: 10,
                            marginTop: 5,
                            backgroundColor: "#00C853",
                          }}
                        >
                          <Text style={{ color: "white" }}>
                            {this.getUnSeenMessageCount(item)}
                          </Text>
                        </Badge>
                      ) : null}
                    </Right>
                  </ListItem>
                </TouchableHighlight>
              </Swipeout>
            );
          }}
        />
      </View>
    );
  }
}
const LastMessage = ({
  size = 18,
  lastMessage = "",
  color = "rgba(0,0,0,0.5)",
  ...props
}) => (
  <View>
    {props.name ? <MaterialIcons size={size} color={color} {...props} /> : null}

    <Text
      style={[
        styles.gray,
        { fontSize: 16, marginLeft: Scale.moderateScale(5) },
      ]}
    >
      {lastMessage}
    </Text>
  </View>
);
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getMessages, deleteUserMessages }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.messages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
