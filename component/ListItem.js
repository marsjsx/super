// import { Linking } from "expo";
// import PropTypes from "prop-types";
// import React from "react";
// import {
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   ViewPropTypes
// } from "react-native";


// export default class ListItem extends React.Component {
 

//   render() {
//     const { currentMessage, containerStyle, mapViewStyle } = this.props;
//     if (currentMessage.location) {
//       return (
//         <TouchableOpacity
//           style={[styles.container, containerStyle]}
//           onPress={this.openMapAsync}
//         >
//           <MapView
//             style={[styles.mapView, mapViewStyle]}
//             region={{
//               latitude: currentMessage.location.latitude,
//               longitude: currentMessage.location.longitude,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421
//             }}
//             scrollEnabled={false}
//             zoomEnabled={false}
//           >
//             <MapView.Marker
//               coordinate={{
//                 latitude: currentMessage.location.latitude,
//                 longitude: currentMessage.location.longitude
//               }}
//             />
//           </MapView>
//         </TouchableOpacity>
//       );
//     }
//     return null;
//   }
// }

// const styles = StyleSheet.create({
//   container: {},
//   mapView: {
//     width: 150,
//     height: 100,
//     borderRadius: 13,
//     margin: 3
//   }
// });
