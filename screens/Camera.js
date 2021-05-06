import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { uploadPhoto } from "../actions/index";
import { updatePhoto, createAndUpdatePreview } from "../actions/post";
import * as Permissions from "expo-permissions";
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
    permissionsGranted: false,
    cameraType: Camera.Constants.Type.back,
    showLoading: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === "granted" });
  }
  snapPhoto = async () => {
    if (this.camera) {
      this.camera.takePictureAsync().then(image => {
        this.props.dispatch(updatePhoto(image));
        this.props.dispatch(createAndUpdatePreview(image.uri));

        this.props.navigation.goBack();

        this.props.navigation.navigate("PostDetail");
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

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
      <Text style={{ color: "white" }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>
  );

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={this.snapPhoto}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => this.changeCameraType()}
      >
        <View>
          <Ionicons name="ios-reverse-camera" size={32} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { permissionsGranted } = this.state;
    if (permissionsGranted === false) {
      return this.renderNoPermissions();
    } else {
      return (
        <View style={styles.container}>
          {/* <Camera
            style={{ flex: 1,justifyContent:'flex-end' }}
            ref={ref => {
              this.camera = ref;
            }}
            type={this.state.cameraType}
          >
            {this.renderBottomBar()}
          </Camera> */}
        </View>
      );
    }
    // }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { uploadPhoto, updatePhoto, createAndUpdatePreview },
    dispatch
  );
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(CameraUpload);
