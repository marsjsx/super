import React from "react";
import {
  StyleSheet,
  View,
  Slider,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text } from "native-base";

import {
  SoftLightBlend,
  Emboss,
  Grayscale,
  Earlybird,
  Vintage,
  Browni,
  ColorTone,
  DuoTone,
  Warm,
  Night,
  Sepia,
  Cool,
  cool,
  Gingham,
  Clarendon,
  Moon,
  Lark,
  Reyes,
  Slumber,
  Aden,
  Perpetua,
  Mayfair,
  Rise,
  Hudson,
  Valencia,
  Xpro2,
  Willow,
  Lofi,
  Inkwell,
  Technicolor,
  Nashville,
  brightness,
  ColorMatrix,
  Contrast,
  hueRotate,
  Sharpen,
  Kodachrome,
  LuminanceToAlpha,
  Polaroid,
  RGBA,
  Saturate,
  Invert,
  RadialGradient,
  Brightness,
  Nightvision,
  HueRotate,
  Lsd,
  Temperature,
} from "react-native-image-filter-kit";

const getFilters = (
  index,
  name,
  url,
  style,
  resizeMode,
  extractImageEnabled,
  onExtractImage
) => {
  if (index === 0) {
    return (
      <Image
        style={[style]}
        // source={{ uri: this.props.post.photo.uri }}
        source={{ uri: url }}
        resizeMode={resizeMode}
      />
    );
  }
  // if (index === 1) {
  //   return (
  //     <Browni style={[style]} source={{ uri: url }} resizeMode={resizeMode} />
  //   );
  // }
  if (index === 1) {
    return (
      <Nightvision
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }

  if (index === 2) {
    return (
      <Technicolor
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 3) {
    return (
      <Invert
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 4) {
    return (
      <Inkwell
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 5) {
    return (
      <Kodachrome
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 6) {
    return (
      <LuminanceToAlpha
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 7) {
    return (
      <Polaroid
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }

  if (index === 8) {
    return (
      <Grayscale
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 9) {
    return (
      <Lsd
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 10) {
    return (
      <Cool
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }

  // {
  //   /* Clarendon,Moon,Lark,Reyes,Slumber,Aden,Perpetua,Mayfair,Rise,Hudson,Valencia,Xpro2,Willow,Lofi,Inkwell,Nashville, */
  // }

  if (index === 11) {
    return (
      <Vintage
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 12) {
    return (
      <Sepia
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 13) {
    return (
      <Warm
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 14) {
    return (
      <Night
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 15) {
    return (
      <DuoTone
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 16) {
    return (
      <ColorTone
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 17) {
    return (
      <Browni
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }

  if (index === 23) {
    return (
      <Willow
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 24) {
    return (
      <Lofi
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 25) {
    return (
      <Gingham
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image
            style={[style]}
            source={{ uri: url }}
            resizeMode={resizeMode}
          />
        }
      />
    );
  }
  if (index === 26) {
    return (
      <Nashville
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 27) {
    return (
      <Reyes
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 28) {
    return (
      <Moon
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 29) {
    return (
      <Lark
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 30) {
    return (
      <Clarendon
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image
            style={[style]}
            source={{ uri: url }}
            resizeMode={resizeMode}
          />
        }
      />
    );
  }
  if (index === 31) {
    return (
      <Slumber
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }

  if (index === 32) {
    return (
      <Aden
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 33) {
    return (
      <Perpetua
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 34) {
    return (
      <Mayfair
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 35) {
    return (
      <Rise
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 36) {
    return (
      <Hudson
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 37) {
    return (
      <Valencia
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }
  if (index === 38) {
    return (
      <Xpro2
        extractImageEnabled={extractImageEnabled}
        onExtractImage={onExtractImage}
        image={
          <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
        }
      />
    );
  }

  return null;
};

export default ({
  name,
  index,
  minimum,
  maximum,
  selectedIndex,
  resizeMode,
  onChange,
  extractImageEnabled,
  onExtractImage,
  url,
  style,
}) => (
  <TouchableOpacity style={[styles.container]} onPress={onChange}>
    {getFilters(
      index,
      name,
      url,
      style,
      resizeMode,
      extractImageEnabled,
      onExtractImage
    )}

    <Text
      style={[
        styles.text,
        { color: index === selectedIndex ? "dodgerblue" : "black" },
      ]}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  slider: { width: 120, height: 120 },
});
