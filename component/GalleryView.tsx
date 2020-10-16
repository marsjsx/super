import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Animated,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";

import Constants from "expo-constants";

// @ts-ignore
import CameraRollPicker from "./cameraRollPicker//index";
import CameraRoll from "@react-native-community/cameraroll";
import { colors } from "../util/theme";
import { Button } from "native-base";
import * as Permissions from "expo-permissions";
import * as ExpoImagePicker from "expo-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import SlidingPanel from "../component/slidingpanel";

// @ts-ignore
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { updatePhoto } from "../actions/post";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Video from "react-native-video";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ProgressiveImage from "../component/ProgressiveImage";
import { PanoramaView } from "@lightbase/react-native-panorama-view";
import Scale from "../helpers/Scale";

const { height, width } = Dimensions.get("window");

class GalleryView extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      paused: false,
      rate: 1,
      volume: 1,
      sliderHeight: height * 0.6,
      muted: false,
      ignoreSilentSwitch: null,
      selectedFile: {},
    };
  }

  componentDidMount() {
    this.refs.slidingPanel.onRequestStart();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isPaused !== prevProps.isPaused) {
      this.setState({ paused: this.props.isPaused });
    }
  }

  async getSelectedImages(image: any, current: any) {
    var selectedFile = { ...current };
    this.refs.slidingPanel.onRequestStart();

    // alert(JSON.stringify(selectedFile));
    if (selectedFile.type === "video") {
      selectedFile.duration = Math.round(current.playableDuration * 1000);
    }
    if (this.props.type === "vr") {
      selectedFile.type = "vr";
    }

    if (Platform.OS === "ios") {
      var ext = selectedFile.filename.split(".").pop();
      const appleId = selectedFile.uri.substring(5, 41);
      const uri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
      selectedFile.uri = uri;
    } else if (Platform.OS === "android") {
      if (selectedFile.type && selectedFile.type.includes("image")) {
        selectedFile.type = "image";
      }
    }
    //aalert(JSON.stringify(selectedFile));

    this.props.updatePhoto(selectedFile);
    this.setState({ selectedFile: selectedFile });
    this.setState({ paused: false });
  }

  getSelectedFilePreview() {
    const { selectedFile, photos } = this.state;
    // alert("Selected" + JSON.stringify(selectedFile));
    // alert(JSON.stringify(selectedFile));

    if (selectedFile.type === "image") {
      // this.setState({ paused: true });
      //  alert(JSON.stringify(selectedFile.uri));

      return (
        <Image
          source={{ uri: selectedFile.uri }}
          // resizeMode="cover"
          style={{ flex: 1, width: width }}
        />
        //   <ProgressiveImage
        //   style={{ height: 400, width: Dimensions.get("screen").width }}
        //   resizeMode="cover"
        //   transparentBackground="transparent"
        //   source={{ uri: selectedFile.uri }}
        // />
      );
    } else if (selectedFile.type === "vr") {
      // this.setState({ paused: true });
      //  alert(JSON.stringify(selectedFile.uri));

      return (
        <View style={{ flex: 1, width: width }}>
          {/* <PanoramaView
            style={styles.postPhotoPreview}
            dimensions={{
              height: height * 0.7,
              width: width,
            }}
            inputType="mono"
            imageUrl={selectedFile.uri}
          /> */}
          <Image
            source={{ uri: selectedFile.uri }}
            // resizeMode="cover"
            style={{ flex: 1 }}
          />
          <Text
            style={{
              color: "rgb(255,255,255)",
              fontSize: 28,
              position: "absolute",
              fontWeight: "bold",
              top: 100,
              left: 20,
            }}
          >
            360
          </Text>
        </View>
      );
    } else if (selectedFile.type === "video") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            width: width,
          }}
        >
          <Video
            ref={(ref) => {
              this.video = ref;
            }}
            style={{
              // height: height * 0.5,
              flex: 1,
              width: Dimensions.get("screen").width,
            }}
            source={{ uri: selectedFile.uri }}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            ignoreSilentSwitch={"ignore"}
            resizeMode={"cover"}
            repeat={true}
          />
          {this.state.paused ? (
            <View
              style={{
                position: "absolute",
                height: 60,
                width: 60,
                justifyContent: "center",
                borderRadius: 30,
              }}
            >
              <Ionicons
                name="ios-play"
                size={40}
                color="white"
                style={{
                  backgroundColor: "transparent",
                  alignSelf: "center",
                  // lineHeight: 40,
                  // marginLeft: 10,
                }}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      );
    }
    return null;
  }
  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      // const selectedFile = await ExpoImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      //   // allowsEditing: true,
      //   duration: 15000,
      // });
      var selectedFile;

      if (this.props.type === "vr") {
        selectedFile = await ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        });
      } else {
        selectedFile = await ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
          // allowsEditing: true,
          duration: 60000,
        });
      }

      if (!selectedFile.cancelled) {
        // alert(JSON.stringify(selectedFile));
        if (selectedFile.type === "image" && this.props.type === "vr") {
          selectedFile.type = "vr";
        }
        this.props.updatePhoto(selectedFile);
        // this.props.navigation.navigate("PostDetail");

        this.setState({ selectedFile: selectedFile });
        this.setState({ paused: false });
      }
    }
  };

  render() {
    //     // @ts-ignore
    const { selectedFile, photos } = this.state;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: "transparent",
          // marginTop: Constants.statusBarHeight - Scale.moderateScale(20),
          // width: width,
          // height: height,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            // alignItems: "bottom",
            backgroundColor: "black",
          }}
        >
          <View
            style={{
              alignItems: "center",
              width: Dimensions.get("window").width,
              height:
                height -
                (this.state.sliderHeight +
                  this.props.footerHeight +
                  Scale.moderateScale(0)),
            }}
          >
            <CameraRollPicker
              initialListSize={1}
              pageSize={3}
              removeClippedSubviews={true}
              groupTypes="All"
              maximum={1}
              type={this.props.type}
              assetType={this.props.type ? "Photos" : "All"}
              imagesPerRow={4}
              imageMargin={1}
              callback={this.getSelectedImages.bind(this)}
            />
          </View>
        </View>

        <SlidingPanel
          ref="slidingPanel"
          headerLayoutHeight={Scale.moderateScale(0)}
          imageHeaderHeight={Scale.moderateScale(30)}
          onGalleryPress={() => this.openLibrary()}
          sliderHeight={(height) => {
            this.setState({ sliderHeight: height });
            // alert(height);
          }}
          headerLayout={() => (
            <View
              style={{
                width: width,
                height: Scale.moderateScale(0),
                backgroundColor: "orange",
                // opacity: 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          )}
          slidingPanelLayout={() => (
            // <View>
            //   <View style={[styles.galleryView, { height: height * 0.5 }]}>
            //     {/* <View style={styles.imagePreview}> */}
            //     {selectedFile && this.getSelectedFilePreview()}
            //     {/* </View> */}
            //   </View>
            // </View>
            <View style={{ height: height * 0.6 }}>
              <View
                style={{
                  width: width,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#f5f5f5",
                  borderBottomWidth: 0,
                }}
              >
                <View style={{}}>
                  <Button
                    style={{
                      padding: 5,
                      marginLeft: Scale.moderateScale(8),
                    }}
                    transparent
                    onPress={this.props.closeModel}
                  >
                    <Text style={styles.btnActions}>Cancel</Text>
                  </Button>
                </View>
                {/* <View style={{}}>
                  <Button
                    style={{ padding: 5 }}
                    transparent
                    onPress={() => this.openLibrary()}
                  >
                    <Text
                      style={[styles.btnActions, { color: colors.darkRed }]}
                    >
                      Albums
                    </Text>
                  </Button>
                </View> */}

                <View>
                  <Button
                    style={{ padding: 5, marginRight: Scale.moderateScale(8) }}
                    transparent
                    onPress={this.props.onNext}
                  >
                    <Text style={styles.btnActions}>Next</Text>
                  </Button>
                </View>
              </View>

              <View
                style={{
                  width,
                  flex: 1,
                  // height: height * 0.5,
                  backgroundColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedFile && this.getSelectedFilePreview()}

                {/* <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: Scale.moderateScale(8),
                    left: Scale.moderateScale(8),
                  }}
                  onPress={() => this.openLibrary()}
                >
                  <Ionicons name="md-photos" size={40} color="white" />
                </TouchableOpacity> */}
              </View>
            </View>
          )}
          slidingPanelLayoutHeight={height * 0.6}
          panelPosition={"top"}
        />
      </SafeAreaView>
    );
  }

  //   render() {
  //     // @ts-ignore
  //     const { selectedFile, photos } = this.state;
  //     return (
  //       <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
  //         {/* <View style={{ width: "100%", height: 70, backgroundColor: "red" }} /> */}
  //         <ParallaxScrollView
  //           style={{ flex: 1, backgroundColor: "hotpink", overflow: "hidden" }}
  //           renderBackground={() => (
  //             <View>
  //               <View style={[styles.galleryView, { height: height * 0.5 }]}>
  //                 {/* <View style={styles.imagePreview}> */}
  //                 {selectedFile && this.getSelectedFilePreview()}
  //                 {/* </View> */}
  //               </View>
  //             </View>
  //           )}
  //           renderFixedHeader={() => (
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 justifyContent: "space-between",
  //                 backgroundColor: "#f5f5f5",
  //                 borderBottomWidth: 0,
  //               }}
  //             >
  //               <View style={{}}>
  //                 <Button
  //                   style={{
  //                     padding: 5,
  //                     marginLeft: Scale.moderateScale(8),
  //                   }}
  //                   transparent
  //                   onPress={this.props.closeModel}
  //                 >
  //                   <Text style={styles.btnActions}>Cancel</Text>
  //                 </Button>
  //               </View>
  //               <View style={{}}>
  //                 <Button
  //                   style={{ padding: 5 }}
  //                   transparent
  //                   onPress={() => this.openLibrary()}
  //                 >
  //                   <Text style={[styles.btnActions, { color: colors.darkRed }]}>
  //                     Albums
  //                   </Text>
  //                 </Button>
  //               </View>
  //               {/* <Body>
  //                 <Text style={styles.btnActions}>Gallery</Text>
  //               </Body> */}
  //               <View>
  //                 <Button
  //                   style={{ padding: 5, marginRight: Scale.moderateScale(8) }}
  //                   transparent
  //                   onPress={this.props.onNext}
  //                 >
  //                   <Text style={styles.btnActions}>Next</Text>
  //                 </Button>
  //               </View>
  //             </View>
  //           )}
  //           parallaxHeaderHeight={height * 0.5}
  //           stickyHeaderHeight={100}
  //         >
  //           <View
  //             style={{
  //               alignItems: "center",
  //               width: Dimensions.get("window").width,
  //             }}
  //           >
  //             <CameraRollPicker
  //               initialListSize={1}
  //               pageSize={3}
  //               removeClippedSubviews={true}
  //               groupTypes="All"
  //               maximum={1}
  //               type={this.props.type}
  //               assetType={this.props.type ? "Photos" : "All"}
  //               imagesPerRow={4}
  //               imageMargin={1}
  //               callback={this.getSelectedImages.bind(this)}
  //             />
  //           </View>
  //         </ParallaxScrollView>
  //       </SafeAreaView>
  //     );
  //   }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePhoto,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6AE2D",
  },
  btnActions: {
    fontWeight: "bold",
    fontSize: 17,
    color: colors.black,
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 16,
    alignItems: "center",
    color: "#fff",
  },
  bold: {
    fontWeight: "bold",
  },
  info: {
    fontSize: 12,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  galleryView: {},
  imagePreview: {},
});
