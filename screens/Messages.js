import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { orderBy } from "lodash";
import ProgressiveImage from "../component/ProgressiveImage";
import EmptyView from "../component/emptyview";
import Swipeout from "react-native-swipeout";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { getMessages } from "../actions/message";
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

class Messages extends React.Component {
  componentDidMount = () => {
    this.props.getMessages();
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
    alert("Coming Soon ");
  }

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
                          uri: item.user.preview,
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

    <Text style={styles.gray}>{lastMessage}</Text>
  </View>
);
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getMessages }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.messages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
