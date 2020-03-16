import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { uploadPhoto } from "../actions/index";
import { updatePhoto } from "../actions/post";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

class CameraUpload extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    showLoading: false
  };

  async componentDidMount() {
    // this.cameraPermission();

    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  }

  // asking camera permission
  cameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  };
  snapPhoto = async () => {
    if (this.camera) {
      //  this.setState({ showLoading: true });
      // //   this.setState(loading => ({ showLoading: false }));

      // setTimeout(() => this.setState({ isTakingImage: true }), 1);
      this.camera.takePictureAsync().then(image => {
        this.props.dispatch(updatePhoto(image.uri));
        this.props.navigation.goBack();

        this.props.navigation.navigate("Post");
      });
    }
  };

  // Changing camera type
  changeCameraType = async () => {
    if (this.state.cameraType == Camera.Constants.Type.back) {
      this.setState(type => ({ cameraType: Camera.Constants.Type.front }));
    } else {
      this.setState(type => ({ cameraType: Camera.Constants.Type.back }));
    }
  };

  render() {
    const { hasPermission } = this.state;

    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
      //  return this.props.navigation.goBack();
    } else {
      return (
        <View style={styles.container}>
          {this.state.showLoading === true ? (
            <ActivityIndicator
              style={[
                {
                  flex: 1,
                  justifyContent: "center"
                  // backgroundColor: "#bfbfbf"
                }
              ]}
              size="large"
              color="#ccf"
            />
          ) : (
            <Camera
              style={{ flex: 1 }}
              ref={ref => {
                this.camera = ref;
              }}
              type={this.state.cameraType}
            >
              <SafeAreaView
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  paddingEnd: 30,
                  paddingStart: 30
                }}
              >
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => this.snapPhoto()}
                />

                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    alignItems: "center",
                    margin: 20,
                    backgroundColor: "transparent"
                  }}
                  onPress={() => this.changeCameraType()}
                >
                  <MaterialCommunityIcons
                    name="camera-switch"
                    style={{ color: "#fff", fontSize: 40 }}
                  />
                </TouchableOpacity>
              </SafeAreaView>
            </Camera>
          )}
        </View>
      );
    }
    // }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ uploadPhoto, updatePhoto }, dispatch);
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(CameraUpload);
