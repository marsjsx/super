import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Scale, { scale } from "../helpers/Scale";
import constants from "../constants";
import ProgressiveImage from "../component/ProgressiveImage";
import {
  InstagramProvider,
  ElementContainer,
} from "instagram-zoom-react-native";
import styles from "../styles";

import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Octicons,
} from "@expo/vector-icons";
import moment from "moment";
import Icon from "react-native-vector-icons/Feather";
import AvView from "../component/AvView";
import ParsedText from "react-native-parsed-text";

import GestureRecognizer, { swipeDirections } from "../component/swipeguesture";

const RenderFullScreenPostItem = (props) => {
  return (
    <GestureRecognizer
      // onSwipe={(direction, state) => this.onSwipe(direction, state)}
      // onSwipeUp={(state) => this.onSwipeUp(state)}
      // onSwipeDown={(state) => this.onSwipeDown(state)}
      // onSwipeLeft={(state) => this.onSwipeLeft(state, item)}
      // onSwipeRight={(state) => this.onSwipeRight(state)}
      // config={config}
      style={{
        flex: 1,
        // backgroundColor: this.state.backgroundColor,
      }}
    >
      <InstagramProvider>
        <ElementContainer>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.postPhoto}
            id={props.id}
            onPress={() => props.onPostPress()}
          >
            <AvView
              ref={(ref) => {
                props.onPostRef(ref);
              }}
              type={props.type ? props.type : "image"}
              source={props.postPhoto}
              navigation={props.navigation}
              style={[styles.postPhoto]}
              onDoubleTap={() => props.onDoubleTap()}
              preview={props.preview}
            />

            <View
              style={[
                styles.bottom,
                styles.absolute,
                {
                  marginHorizontal: 10,
                  paddingBottom: Scale.moderateScale(80),
                },
              ]}
            >
              {props.type === "vr" && (
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    tintColor: "#fff",
                    marginHorizontal: -10,
                  }}
                  source={constants.images.icon360}
                />
              )}
              {props.type == "video" && (
                <TouchableOpacity
                  style={{
                    width: Scale.moderateScale(45),
                    height: Scale.moderateScale(45),
                  }}
                  onPress={() => props.onPressFullScreen()}
                >
                  <MaterialCommunityIcons
                    name="fullscreen"
                    size={Scale.moderateScale(45)}
                    color="white"
                    style={{
                      // backgroundColor: "transparent",
                      margin: -10,
                      // padding: -20,
                      // shadowOpacity: 1,
                    }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flex: 1,
                  display: props.isChannel ? "none" : "flex",
                }}
                onPress={() => props.onUserPress()}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: Scale.moderateScale(23),
                    color: "rgb(255,255,255)",
                    // ...constants.fonts.FreightSansLight,
                  }}
                >
                  {props.username}
                </Text>
              </TouchableOpacity>

              {props.viewers && props.viewers.length > 0 ? (
                <TouchableOpacity
                  //  onPress={() => props.onViewsPress()}
                  onPress={() => props.onCommentPress()}
                >
                  <Text
                    style={{
                      // fontFamily: "open-sans-bold",
                      color: constants.colors.feedsStatsColor,
                      marginVertical: Scale.moderateScale(8),
                      fontWeight: "500",
                      // letterSpacing: 1,
                      fontSize: Scale.moderateScale(17),
                    }}
                  >
                    {props.viewers.length} views
                  </Text>
                </TouchableOpacity>
              ) : null}
              {/* 
              {props.likes && props.likes.length > -1 ? (
                <TouchableOpacity
                  onPress={() => props.onLikePress()}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: Scale.moderateScale(10),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.feedsStatsColor,
                      marginHorizontal: 10,
                      marginVertical: 2,
                    }}
                  >
                    {props.likes.length} likes
                  </Text>
                </TouchableOpacity>
              ) : null} */}

              {/* {props.comments && props.comments.length > -1 ? (
                <TouchableOpacity
                  onPress={() => props.onCommentPress()}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.feedsStatsColor,
                      marginHorizontal: 10,
                      marginVertical: 2,
                    }}
                  >
                    {props.comments.length} comments
                  </Text>
                </TouchableOpacity>
              ) : null} */}
            </View>

            {/* <View
              style={[
                styles.bottom,
                styles.absolute,
                { display: props.isChannel ? "none" : "flex" },
              ]}
            >
              <View style={[styles.row, {}]}>
                <View
                  style={{
                    marginHorizontal: 10,
                    // width: "74%",
                    // justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",

                      // borderBottomWidth: 0.5,
                      // borderBottomColor: "rgb(255,255,255)",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                        flex: 1,
                      }}
                      onPress={() => props.onUserPress()}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: Scale.moderateScale(16),
                          color: "rgb(255,255,255)",
                          // ...constants.fonts.FreightSansLight,
                        }}
                      >
                        {props.username}
                      </Text>
                    </TouchableOpacity>

                    {props.user.uid != props.uid &&
                      props.user.following &&
                      props.user.following.indexOf(props.uid) < 0 && (
                        <TouchableOpacity
                          onPress={() => props.onFollowPress()}
                          style={{
                            marginLeft: Scale.moderateScale(8),
                            padding: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "#00ff00",
                              fontWeight: "bold",
                              padding: Scale.moderateScale(5),
                              fontSize: Scale.moderateScale(14),
                            }}
                          >
                            +follow
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>

                  <View style={{}}>
                    <ParsedText
                      parse={[
                        {
                          type: "url",
                          style: styles.url,
                          onPress: props.onUrlPress,
                        },
                        { pattern: /42/, style: styles.magicNumber },
                        { pattern: /#(\w+)/, style: styles.hashTag },
                        {
                          pattern: / @(\w+)/,
                          style: styles.username,
                          onPress: props.onMentionNamePress,
                        },
                      ]}
                      style={[
                        styles.textD,
                        // styles.bold,
                        { fontSize: Scale.moderateScale(12) },
                      ]}
                    >
                      {props.postDescription}
                    </ParsedText>
                  </View>
                </View>
              </View>
              {props.type == "video" && (
                <TouchableOpacity
                  style={{
                    width: Scale.moderateScale(45),
                    height: Scale.moderateScale(45),
                  }}
                  onPress={() => props.onPressFullScreen()}
                >
                  <MaterialCommunityIcons
                    name="fullscreen"
                    size={Scale.moderateScale(45)}
                    color="white"
                    style={{
                      backgroundColor: "transparent",
                      alignSelf: "center",
                      // shadowOpacity: 1,
                    }}
                  />
                </TouchableOpacity>
              )}
              {props.type === "vr" && (
                <Image
                  style={{ width: 80, height: 80, tintColor: "#fff" }}
                  source={constants.images.icon360}
                />
              )}
              {props.likes && props.likes.length > -1 ? (
                <TouchableOpacity
                  onPress={() => props.onLikePress()}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: Scale.moderateScale(10),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.feedsStatsColor,
                      marginHorizontal: 10,
                      marginVertical: 2,
                    }}
                  >
                    {props.likes.length} likes
                  </Text>
                </TouchableOpacity>
              ) : null}

              {props.comments && props.comments.length > -1 ? (
                <TouchableOpacity
                  onPress={() => props.onCommentPress()}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.feedsStatsColor,
                      marginHorizontal: 10,
                      marginVertical: 2,
                    }}
                  >
                    {props.comments.length} comments
                  </Text>
                </TouchableOpacity>
              ) : null}

              {props.viewers && props.viewers.length > 0 ? (
                <TouchableOpacity onPress={() => props.onViewsPress()}>
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.feedsStatsColor,
                      marginHorizontal: 10,
                      marginVertical: 2,
                    }}
                  >
                    {props.viewers.length} views
                  </Text>
                </TouchableOpacity>
              ) : null}

              <Text
                style={[
                  styles.white,
                  styles.medium,
                  styles.bold,
                  { margin: 10 },
                ]}
              >
                {moment(props.date).format("ll")}
              </Text>
            </View> */}

            <View
              style={[
                {
                  position: "absolute",
                  top: Scale.moderateScale(44),
                  right: Scale.moderateScale(16),
                  display: props.isChannel ? "none" : "flex",
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  marginLeft: Scale.moderateScale(6),
                  padding: 4,
                }}
                onPress={() => props.showActionSheet()}
              >
                <Ionicons
                  style={{
                    margin: 0,
                    color: "rgb(255,255,255)",
                  }}
                  name="ios-more"
                  size={32}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                {
                  position: "absolute",
                  top: Scale.moderateScale(60),
                  right: Scale.moderateScale(16),
                  left: Scale.moderateScale(16),
                  display: props.isChannel ? "flex" : "none",
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                }}
                onPress={() => {}}
              >
                {/* <ProgressiveImage
                  thumbnailSource={{
                    uri: props.preview,
                  }}
                  transparentBackground="transparent"
                  source={{ uri: props.photo }}
                  style={{
                    height: Scale.moderateScale(150),
                    width: Scale.moderateScale(300),
                    // marginLeft: Scale.moderateScale(50),
                    tintColor: "#fff",
                  }}
                  resizeMode="contain"
                  placeHolder="none"
                  // style={styles.roundImage50}
                /> */}
                <Image
                  style={{
                    height: Scale.moderateScale(130),
                    width: Scale.moderateScale(260),
                    // marginLeft: Scale.moderateScale(50),
                  }}
                  source={require("../assets/vans.png")}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ElementContainer>
      </InstagramProvider>
    </GestureRecognizer>
  );
};

export default RenderFullScreenPostItem;
