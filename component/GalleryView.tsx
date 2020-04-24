import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
// @ts-ignore
import CameraRollPicker from "./cameraRollPicker//index";
// @ts-ignore
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { updatePhoto } from "../actions/post";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Video from "react-native-video";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ProgressiveImage from "../component/ProgressiveImage";


class GalleryView extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      paused: false,
      rate: 1,
      volume: 1,
      muted: false,
      ignoreSilentSwitch: null,
      selectedFile: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isPaused !== prevProps.isPaused) {
      this.setState({ paused: this.props.isPaused });
    }
  }

  getSelectedImages(image: any, current: any) {
    // alert(JSON.stringify(current));
    var selectedFile = { ...current };
    if (selectedFile.type === "video") {
      selectedFile.duration = Math.round(current.playableDuration * 1000);
      var ext = selectedFile.filename.split(".").pop();
      const appleId = selectedFile.uri.substring(5, 41);
      const uri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

      selectedFile.uri = uri;
    }
    // alert(JSON.stringify(selectedFile));

    this.props.updatePhoto(selectedFile);
    this.setState({ selectedFile: selectedFile });
    this.setState({ paused: false });
  }

  getSelectedFilePreview() {
    const { selectedFile, photos } = this.state;

    if (selectedFile.type === "image") {
      // this.setState({ paused: true });

      return (
        // <Image source={{ uri: selectedFile.uri }} style={{ height: 400 }} />
        <ProgressiveImage
        style={{ height: 400, width: Dimensions.get("screen").width }}
        resizeMode="cover"
        transparentBackground="transparent"
        source={{ uri: selectedFile.uri }}
      />
      );
    } else if (selectedFile.type === "video") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Video
            ref={(ref) => {
              this.video = ref;
            }}
            style={{ height: 400, width: Dimensions.get("screen").width }}
            source={{ uri: selectedFile.uri }}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            ignoreSilentSwitch={this.state.ignoreSilentSwitch}
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

  render() {
    // @ts-ignore
    const { selectedFile, photos } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ParallaxScrollView
          style={{ flex: 1, backgroundColor: "hotpink", overflow: "hidden" }}
          renderBackground={() => (
            <View style={styles.galleryView}>
              <View style={styles.imagePreview}>
                {selectedFile && this.getSelectedFilePreview()}
              </View>
            </View>
          )}
          renderFixedHeader={() => (
            <Text
              style={{
                textAlign: "center",
                color: "white",
                padding: 15,
                fontSize: 20,
              }}
            ></Text>
          )}
          parallaxHeaderHeight={350}
          stickyHeaderHeight={55}
        >
          <View
            style={{
              alignItems: "center",
              width: Dimensions.get("window").width,
            }}
          >
            <CameraRollPicker
              scrollRenderAheadDistance={100}
              initialListSize={1}
              pageSize={3}
              removeClippedSubviews={true}
              groupTypes="All"
              maximum={1}
              assetType="All"
              imagesPerRow={3}
              imageMargin={1}
              callback={this.getSelectedImages.bind(this)}
            />
          </View>
        </ParallaxScrollView>
      </View>
    );
  }
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
