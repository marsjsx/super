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
  FlatList,
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
import ImageFilters from "../component/ImageFilters";
import constants from "../constants";

import {
  AdenCompat,
  _1977Compat,
  BrannanCompat,
  BrooklynCompat,
  ClarendonCompat,
  EarlybirdCompat,
  GinghamCompat,
  HudsonCompat,
  InkwellCompat,
  KelvinCompat,
  LarkCompat,
  LofiCompat,
  MavenCompat,
  MayfairCompat,
  MoonCompat,
  NashvilleCompat,
  PerpetuaCompat,
  ReyesCompat,
  RiseCompat,
  SlumberCompat,
  StinsonCompat,
  ToasterCompat,
  ValenciaCompat,
  WaldenCompat,
  WillowCompat,
  Xpro2Compat,
} from "react-native-image-filter-kit";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
const window = Dimensions.get("window");
const w = window.width;
const h = window.height;

const IMAGE = "https://picsum.photos/id/48/900/500";

const CROP_AREA_WIDTH = w;
const CROP_AREA_HEIGHT = h;
const filters = [
  "normal",
  "nightvision",
  "technicolor",
  "invert",
  "inkwell",
  "kodachrome",
  "luminance",
  "polaroid",
  "rgba",
  "greyscale",
  "lsd",
  "vintage",
  "sepia",
  "warm",
  "night",
  "duotone",
  "colortone",
  "browni",
];

const FILTERS1 = [
  {
    title: "Normal",
    filterComponent: AdenCompat,
  },
  // {
  //   title: "Maven",
  //   filterComponent: MavenCompat,
  // },
  // {
  //   title: "Mayfair",
  //   filterComponent: MayfairCompat,
  // },
  // {
  //   title: "Moon",
  //   filterComponent: MoonCompat,
  // },
  // {
  //   title: "Nashville",
  //   filterComponent: NashvilleCompat,
  // },
  // {
  //   title: "Perpetua",
  //   filterComponent: PerpetuaCompat,
  // },
  // {
  //   title: "Reyes",
  //   filterComponent: ReyesCompat,
  // },
  // {
  //   title: "Rise",
  //   filterComponent: RiseCompat,
  // },
  // {
  //   title: "Slumber",
  //   filterComponent: SlumberCompat,
  // },
  // {
  //   title: "Stinson",
  //   filterComponent: StinsonCompat,
  // },
  // {
  //   title: "Brooklyn",
  //   filterComponent: BrooklynCompat,
  // },
  // {
  //   title: "Earlybird",
  //   filterComponent: EarlybirdCompat,
  // },
  {
    title: "Clarendon",
    filterComponent: ClarendonCompat,
  },
  // {
  //   title: "Gingham",
  //   filterComponent: GinghamCompat,
  // },
  // {
  //   title: "Hudson",
  //   filterComponent: HudsonCompat,
  // },
  {
    title: "Inkwell",
    filterComponent: InkwellCompat,
  },
  {
    title: "Kelvin",
    filterComponent: KelvinCompat,
  },
  // {
  //   title: "Lark",
  //   filterComponent: LarkCompat,
  // },
  {
    title: "Lofi",
    filterComponent: LofiCompat,
  },
  {
    title: "Toaster",
    filterComponent: ToasterCompat,
  },
  // {
  //   title: "Valencia",
  //   filterComponent: ValenciaCompat,
  // },
  // {
  //   title: "Walden",
  //   filterComponent: WaldenCompat,
  // },
  // {
  //   title: "Willow",
  //   filterComponent: WillowCompat,
  // },
  {
    title: "Xpro2",
    filterComponent: Xpro2Compat,
  },
  // {
  //   title: "Aden",
  //   filterComponent: AdenCompat,
  // },
  {
    title: "_1977",
    filterComponent: _1977Compat,
  },
  {
    title: "Brannan",
    filterComponent: BrannanCompat,
  },
];
class CropperPage extends React.Component {
  state = {
    cropperParams: {},
    croppedImage: "",
    uri: "",
    filters: [],
    index: 0,
    editing: true,
    currentAngle: 0,
    filteredImage: "",
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
          // uri: uri,
          filteredImage: uri,
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

    this.setState({ uri: uri, filteredImage: uri });
    // this.setState({ uri: uri });
    this.loadImage(0);
  }
  loadImage(index) {
    if (index < 9) {
      setTimeout(
        () => {
          // this.setState({ loading: false });
          var stateFilters = this.state.filters;
          stateFilters.push(FILTERS1[index]);
          stateFilters.push(FILTERS1[index + 1]);
          stateFilters.push(FILTERS1[index + 2]);
          this.setState({ filters: stateFilters });
          var number = index + 3;
          this.loadImage(number);
          // this.setState({ loading: false });
        },
        index === 0 ? 0 : 1000
      );
    }
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
    // alert(JSON.stringify(cropperParams));
    try {
      const result = await ImageCropper.crop({
        ...cropperParams,
        imageUri: this.state.filteredImage,
        cropSize,
        cropAreaSize,
      });

      // var cropData = {
      //   offset: { x: cropperParams.positionX, y: cropperParams.positionY },
      //   size: { width: 500, height: 400 },
      //   displaySize: { width: 400, height: 800 },
      // };
      // ImageEditor.cropImage(this.state.uri, cropData)
      //   .then((url) => {
      //     // console.log("Cropped image uri", url);
      //     this.setState((prevState) => ({
      //       ...prevState,
      //       croppedImage: url,
      //     }));
      //   })
      //   .catch((error) => {
      //     alert(error);
      //   });
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

  onCancel() {
    this.props.onCancel();
  }

  renderButtons() {
    let buttons = [];
    if (this.state.editing) {
      buttons.push(
        <View key="buttonbtns" style={styles.buttonsWrap}>
          {/* <TouchableOpacity
            style={[styles.cancelButton]}
            onPress={this.onCancel.bind(this)}
          >
            <Text style={styles.buttonText}>{"Cancel"}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={this.onCancel.bind(this)}>
            <Ionicons
              style={[{ shadowOpacity: 0.5 }]}
              name={"ios-arrow-back"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
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
            <Text style={styles.buttonText}>{"Rotate"}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                shadowOpacity: 0.5,
                // backgroundColor: this.props.buttonsColor
                //   ? this.props.buttonsColor
                //   : this.defaultColor,
              },
            ]}
            onPress={this.handlePress}
          >
            <Text style={styles.buttonText}>{"Next"}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return buttons;
  }
  onExtractImage = ({ nativeEvent }) => {
    // extractedUri.current = nativeEvent.uri;
    this.setState({ filteredImage: nativeEvent.uri });
  };
  onSelectFilter = (selectedIndex) => {
    // setIndex(selectedIndex);

    if (selectedIndex === 0) {
      this.setState({ filteredImage: this.state.uri, index: selectedIndex });
    } else {
      this.setState({ index: selectedIndex });
    }
  };
  renderFilterComponent = ({ item, index }) => {
    const FilterComponent = item.filterComponent;
    const image = (
      <Image
        style={{
          width: Scale.moderateScale(85),
          height: Scale.moderateScale(85),
          marginRight: 5,
        }}
        source={{ uri: this.state.uri }}
        resizeMode={"cover"}
      />
    );
    return (
      <TouchableOpacity onPress={() => this.onSelectFilter(index)}>
        <FilterComponent image={image} />
        <Text
          style={[
            {
              color: index === this.state.index ? "dodgerblue" : "black",
              textAlign: "center",
            },
          ]}
        >
          {item.title}
        </Text>

        {/* <Image
          style={{
            width: Scale.moderateScale(85),
            height: Scale.moderateScale(85),
            marginRight: 5,
          }}
          source={{ uri: this.state.uri }}
          resizeMode={"cover"}
        /> */}
      </TouchableOpacity>
    );
  };
  render() {
    // const { croppedImage } = this.state;
    // const src = { uri: croppedImage };
    // const { photo, ...props } = this.props;
    const SelectedFilterComponent = FILTERS1[this.state.index].filterComponent;
    // const { width, height, uri, type } = photo;
    return (
      <View>
        {this.state.index === 0 ? (
          <Image
            style={[
              {
                height: height,
                width: width,
                backgroundColor: "#000000",
              },
            ]}
            source={{ uri: this.state.uri }}
            resizeMode={"cover"}
          />
        ) : (
          <SelectedFilterComponent
            onExtractImage={this.onExtractImage}
            extractImageEnabled={true}
            image={
              <Image
                style={[
                  {
                    height: height,
                    width: width,
                    backgroundColor: "#000000",
                  },
                ]}
                source={{ uri: this.state.uri }}
                resizeMode={"cover"}
              />
            }
          />
        )}
        <View style={{ height: "100%", width: "100%", position: "absolute" }}>
          {/* {!croppedImage && ( */}
          <ImageCropper
            imageUri={this.state.filteredImage}
            cropAreaWidth={width}
            cropAreaHeight={height}
            containerColor="transparent"
            areaColor="transparent"
            setCropperParams={this.setCropperParams}
          />

          {/* {this.renderGrids()} */}
          {this.renderButtons()}

          {/* <FlatList
          style={{ position: "absolute", bottom: 0 }}
          horizontal={true}
          keyExtractor={(item) => JSON.stringify(item.name)}
          data={this.state.filters}
          renderItem={({ index, item }) => (
            <ImageFilters
              key={item}
              name={item}
              index={index}
              extractImageEnabled={false}
              selectedIndex={this.state.index}
              resizeMode={"cover"}
              style={{
                width: Scale.moderateScale(85),
                height: Scale.moderateScale(85),
                marginRight: 5,
              }}
              url={this.state.uri}
              onChange={(value) => {
                // alert(index);
                this.setState({ index: index });

                if (index === 0) {
                  this.setState({ filteredImage: this.state.uri });
                  // this.setState({ filteredImage: "" });
                }
              }}
            />
          )}
        />

        <ImageFilters
          key={""}
          name={""}
          index={this.state.index}
          resizeMode={"cover"}
          onExtractImage={({ nativeEvent }) => {
            this.setState({ filteredImage: nativeEvent.uri });
          }}
          extractImageEnabled={true}
          style={[
            {
              height: height,
              width: width,
              // marginTop: 200,
              // position: "absolute",
              display: "none",
              backgroundColor: "#000000",
            },
          ]}
          // style={[styles.fullWidth, { aspectRatio: 1200 / 1700 }]}
          url={this.state.uri}
          onChange={(index) => {
            // this.setState({ index: index });
          }}
        /> */}

          <FlatList
            style={{ position: "absolute", bottom: 0 }}
            data={this.state.filters}
            keyExtractor={(item) => item.title}
            horizontal={true}
            renderItem={this.renderFilterComponent}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              borderRadius: Scale.moderateScale(5),
              padding: Scale.moderateScale(5),
              position: "absolute",
              top: height / 2 - 20,
              right: 10,
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
          {/* <Image
          style={{ height: 200, width: 200, position: "absolute", top: 100 }}
          source={{ uri: this.state.filteredImage }}
        /> */}
        </View>
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
    top: Scale.moderateScale(30),
    justifyContent: "space-between",
  },
  editButton: {
    position: "absolute",
    zIndex: 50,
    right: 10,
  },
  saveButton: {
    // backgroundColor: "rgba(0,0,0,1)",
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    fontSize: 16,
  },
});
