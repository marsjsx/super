// import React, {useCallback} from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from "react-native";
// import constants from "../constants";
// import Scale from "../helpers/Scale";

// const Header = props => {
//   const onBackPress = useCallback(() => {
//     Navigation.pop(props.componentId);
//   }, [props.componentId]);

//   return (
//     <View style={styles.container}>
//       <View style={{width: Dimensions.get("window").width * 0.2}}>
//         <TouchableOpacity
//           style={{
//             padding: Scale.moderateScale(12),
//             marginLeft: Scale.moderateScale(10),
//           }}
//           onPress={onBackPress}>
//           <Image source={constants.images.header.backIcon} />
//         </TouchableOpacity>
//       </View>

//       <View
//         style={{
//           width: Dimensions.get("window").width * 0.6,
//           alignItems: "center",
//         }}>
//         <Text style={styles.title}>{props.title}</Text>
//       </View>

//       <View style={{width: Dimensions.get("window").width * 0.2}} />
//     </View>
//   );
// };

// export default AuthHeader;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     // paddingHorizontal: Scale.moderateScale(10),
//     top: Scale.moderateScale(10),
//     // left: Scale.moderateScale(10),
//   },
//   title: {
//     flex: 1,
//     fontSize: Scale.moderateScale(18),
//     // fontWeight: 'bold',
//     textAlign: "center",
//     padding: Scale.moderateScale(5),
//     color: constants.colors.white,
//     ...constants.fonts.PoppinsRegular,
//   },
// });
