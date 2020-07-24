import React, { Component } from "react";
import { Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";

class ImageItem extends React.Component {
  constructor(props: any) {
    super(props);
  }

  componentWillMount() {
    var { width } = Dimensions.get("window");
    // @ts-ignore
    var { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth != "undefined") {
      width = containerWidth;
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
    // this._imageSize = 95;
  }

  render() {
    // @ts-ignore
    var { item, selected, selectedMarker, imageMargin } = this.props;

    var marker = selectedMarker ? (
      selectedMarker
    ) : (
      <Image
        style={[styles.marker, { width: 25, height: 25 }]}
        source={require("./circle-check.png")}
      />
    );

    var image = item.node.image;
    image.type = item.node.type;

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this._handleClick(image)}
      >
        <Image
          source={{ uri: image.uri }}
          style={{ height: this._imageSize, width: this._imageSize }}
        />

        {selected ? marker : null}

        {image.type === "video" ? (
          <Ionicons
            name="ios-play"
            size={40}
            color="white"
            style={{
              backgroundColor: "transparent",
              left: 10,
              top: 10,
              position: "absolute",
            }}
          />
        ) : null}
      </TouchableOpacity>
    );
  }

  _handleClick(item: any) {
    this.props.onClick(item);
  }
}

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "transparent",
  },
});

ImageItem.defaultProps = {
  item: {},
  selected: false,
};

ImageItem.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  selectedMarker: PropTypes.element,
  imageMargin: PropTypes.number,
  imagesPerRow: PropTypes.number,
  onClick: PropTypes.func,
};

export default ImageItem;
