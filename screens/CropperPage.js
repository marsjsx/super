import React, { Component } from "react";
import Scale from "../helpers/Scale";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  Button,
} from "react-native";
import ImageEditor from "@react-native-community/image-editor";
// const { height, width } = Dimensions.get("window");
import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePhoto,
  createAndUpdatePreview,
  updatePhotoPreview,
} from "../actions/post";
const { height, width } = Dimensions.get("window");
import ImageCropper from "react-native-simple-image-cropper";
import ImageRotate from "react-native-image-rotate";
import { MaterialIcons } from "@expo/vector-icons";

// class CropperPage extends Component {
//   onDone = (croppedImageUri) => {
//     console.log("croppedImageUri = ", croppedImageUri);
//     // send image to server for example
//   };

//   onError = (err) => {
//     console.log(err);
//   };

//   onCancel = () => {
//     console.log("Cancel button was pressed");
//     // navigate back
//   };

//   render() {
//     const { photo, ...props } = this.props;
//     const { width, height, uri, type } = photo;
//     // alert(JSON.stringify(this.props.post.photo));
//     return (
//       <ImageEdit
//         width={Dimensions.get("window").width * 2} //Crop area width
//         editing={true}
//         // scaled={true}
//         height={Dimensions.get("window").height} //Crop area height
//         image={{
//           uri: uri,
//           width: width,
//           height: height,
//           // x: -200, //initial x
//           // y: 0, //initial y
//           // width: type === "vr" ? (width < 7000 ? width : 7000) : width,
//           // height: type === "vr" ? (height < 4000 ? height : 4000) : height,
//         }}
//         saveButtonText="Choose"
//         onSave={(info) => {
//           this.props.onSave(info);
//           //   alert(JSON.stringify(info.image));
//           // console.log(info);
//         }}
//         onCancel={(info) => {
//           this.props.onCancel();
//         }}
//       />
//     );
//   }
// }

// // export default connect(mapStateToProps, mapDispatchToProps)(CropperPage);
// export default CropperPage;

const window = Dimensions.get("window");
const w = window.width;
const h = window.height;

const IMAGE = "https://picsum.photos/id/48/900/500";

const CROP_AREA_WIDTH = w;
const CROP_AREA_HEIGHT = h;

class CropperPage extends React.Component {
  state = {
    cropperParams: {},
    croppedImage: "",
    uri: "",
    editing: true,
    currentAngle: 0,
  };
  defaultColor = "#C1272D";

  rotate = this.rotate.bind(this);
  rotate(angle) {
    const nextAngle = this.state.currentAngle + angle;
    ImageRotate.rotateImage(
      this.state.uri,
      nextAngle,
      (uri) => {
        this.setState({
          uri: uri,
          currentAngle: nextAngle,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  componentWillMount() {
    const { photo, ...props } = this.props;

    const { width, height, uri, type } = photo;

    this.setState({ uri: uri });
  }
  setCropperParams = (cropperParams) => {
    this.setState((prevState) => ({
      ...prevState,
      cropperParams,
    }));
  };

  handlePress = async () => {
    const { photo, ...props } = this.props;
    // const { width, height, uri, type } = photo;
    const { cropperParams } = this.state;

    const cropSize = {
      width: CROP_AREA_WIDTH * 1.5,
      height: CROP_AREA_HEIGHT * 1.5,
    };

    const cropAreaSize = {
      width: CROP_AREA_WIDTH,
      height: CROP_AREA_HEIGHT,
    };

    try {
      const result = await ImageCropper.crop({
        ...cropperParams,
        imageUri: this.state.uri,
        cropSize,
        cropAreaSize,
      });

      this.setState((prevState) => ({
        ...prevState,
        croppedImage: result,
      }));
      this.props.onSave(result);
    } catch (error) {
      console.log(error);
    }
  };

  renderGrids() {
    // if (!this.props.showGrids) return;
    return [
      <View
        key="gl1"
        style={[
          styles.gridLine,
          styles.gl1,
          {
            position: !this.state.editing ? "relative" : "absolute",
            display: !this.state.editing ? "none" : "flex",
          },
          {
            borderColor: this.props.gridColor
              ? this.props.gridColor
              : this.defaultColor,
          },
          this.props.gridStyle,
        ]}
      />,
      <View
        key="gl2"
        style={[
          styles.gridLine,
          styles.gl2,
          {
            position: !this.state.editing ? "relative" : "absolute",
            display: !this.state.editing ? "none" : "flex",
          },
          {
            borderColor: this.props.gridColor
              ? this.props.gridColor
              : this.defaultColor,
          },
          this.props.gridStyle,
        ]}
      />,
      <View
        key="gl3"
        style={[
          styles.gridLine,
          styles.gl3,
          {
            position: !this.state.editing ? "relative" : "absolute",
            display: !this.state.editing ? "none" : "flex",
          },
          {
            borderColor: this.props.gridColor
              ? this.props.gridColor
              : this.defaultColor,
          },
          this.props.gridStyle,
        ]}
      />,
      <View
        key="gl4"
        style={[
          styles.gridLine,
          styles.gl4,
          {
            position: !this.state.editing ? "relative" : "absolute",
            display: !this.state.editing ? "none" : "flex",
          },
          {
            borderColor: this.props.gridColor
              ? this.props.gridColor
              : this.defaultColor,
          },
          this.props.gridStyle,
        ]}
      />,
    ];
  }

  onSave() {}

  onCancel() {
    this.props.onCancel();
  }

  renderButtons() {
    let buttons = [];
    if (this.state.editing) {
      buttons.push(
        <View key="buttonbtns" style={styles.buttonsWrap}>
          <TouchableOpacity
            style={[styles.cancelButton]}
            onPress={this.onCancel.bind(this)}
          >
            <Text style={styles.buttonText}>{"Cancel"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              borderRadius: Scale.moderateScale(5),
              padding: Scale.moderateScale(5),
            }}
            onPress={() => this.rotate(90)}
          >
            <MaterialIcons
              style={{
                margin: 0,
                color: "rgb(255,255,255)",
              }}
              name="rotate-right"
              size={24}
            />
            {/* <Text style={styles.buttonText}>{"Rotate"}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: this.props.buttonsColor
                  ? this.props.buttonsColor
                  : this.defaultColor,
              },
            ]}
            onPress={this.handlePress}
          >
            <Text style={styles.buttonText}>{"Save"}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return buttons;
  }

  render() {
    const { croppedImage } = this.state;
    const src = { uri: croppedImage };
    const { photo, ...props } = this.props;
    // const { width, height, uri, type } = photo;
    return (
      <View style={{ height: "100%" }}>
        <ImageCropper
          imageUri={this.state.uri}
          cropAreaWidth={CROP_AREA_WIDTH}
          cropAreaHeight={CROP_AREA_HEIGHT}
          containerColor="black"
          areaColor="black"
          setCropperParams={this.setCropperParams}
        />
        {/* <Button onPress={this.handlePress} title="Crop Image" color="blue" /> */}
        {croppedImage ? <Image source={src} /> : null}

        {/* {this.renderGrids()} */}
        {this.renderButtons()}
      </View>
    );
  }
}
export default CropperPage;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  cropArea: {
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  gridLine: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
    borderStyle: "solid",
    position: "absolute",
    width: "100%",
    height: 0.5,
    zIndex: 100,
  },
  gl1: {
    top: "25%",
  },
  gl2: {
    top: "75%",
  },
  gl3: {
    left: "25%",
    width: 0.5,
    height: "100%",
  },
  gl4: {
    left: "75%",
    width: 0.5,
    height: "100%",
  },
  buttonsWrap: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "transparent",
    position: "absolute",
    bottom: Scale.moderateScale(60),
    justifyContent: "space-between",
  },
  editButton: {
    position: "absolute",
    zIndex: 50,
    right: 10,
  },
  saveButton: {
    backgroundColor: "rgba(0,0,0,1)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
