// import React from "react";
// import styles from "../styles";
// import ENV from "../env";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";
// import * as ImagePicker from "expo-image-picker";
// import { NavigationEvents } from "react-navigation";
// import { ProcessingManager } from "react-native-video-processing";
// import Loader from "../component/Loader";

// import _ from "lodash";

// import {
//   updateDescription,
//   updateLocation,
//   uploadPost,
//   updatePhoto,
//   createAndUpdatePreview,
//   updatePhotoPreview,
// } from "../actions/post";
// import {
//   FlatList,
//   Modal,
//   SafeAreaView,
//   Text,
//   View,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Alert,
//   Dimensions,
//   ImageBackground,
// } from "react-native";
// const GOOGLE_API =
//   "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
// import { uploadPhoto } from "../actions/index";

// import { Item, Input, Label, Picker, Icon } from "native-base";
// import Constants from "expo-constants";

// import { Dropdown } from "react-native-material-dropdown";
// import { Trimmer, VideoPlayer } from "react-native-video-processing";
// // import { Audio, Video } from "expo-av";
// import Video from "react-native-video";

// import {
//   Ionicons,
//   MaterialIcons,
//   Foundation,
//   MaterialCommunityIcons,
//   Octicons,
// } from "@expo/vector-icons";

// class Post extends React.Component {
//   state = {
//     showModal: false,
//     locations: [],
//     showLoading: false,
//     selectedSource: "",
//     selectedSource: "",
//     language: "",
//     startTime: 0,
//     endTime: 59,
//     selectedLocation: "",
//     currentTime: 0,
//   };

//   componentDidMount() {
//     this.getLocations();
//   }

//   post = async () => {
//     if (this.props.post.photo == null || this.props.post.photo == undefined) {
//       showMessage({
//         message: "STOP",
//         description: "Please select an image/video",
//         type: "danger",
//         duration: 3000,
//       });

//       return;
//     }

//     if (this.props.post.photo.type === "image") {
//       this.props.uploadPost();
//       this.props.navigation.navigate("Home");
//     } else {
//       // trim video first
//       this.trimVideo();
//     }
//   };

//   onWillFocus = () => {
//     if (!this.props.post.photo) {
//       this.openLibrary();
//     }
//   };

//   renderTopBar = () => (
//     <View
//       style={{
//         backgroundColor: "transparent",
//         alignSelf: "flex-end",
//         position: "absolute",
//         paddingTop: Constants.statusBarHeight,
//       }}
//     >
//       <TouchableOpacity
//         style={styles.toggleButton}
//         onPress={() => this.openLibrary()}
//       >
//         <Foundation name="thumbnails" size={40} color="white" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.toggleButton}
//         onPress={() => this.props.navigation.navigate("Camera")}
//       >
//         <Ionicons name="ios-reverse-camera" size={40} color="white" />
//       </TouchableOpacity>
//     </View>
//   );

//   openLibrary = async () => {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//     if (status === "granted") {
//       const selectedFile = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         duration: 15000,
//       });
//       if (!selectedFile.cancelled) {
//         //  alert(JSON.stringify(selectedFile));
//         // const uri = image.uri;
//         // this.setState({ selectedSource: uri });

//         // const maximumSize = { width: 100, height: 200 };
//         // ProcessingManager.getPreviewForSecond(
//         //   image.uri,
//         //   1,
//         //   maximumSize,
//         //   "base64"
//         // ).then((data) => alert(data));
//         this.props.updatePhoto(selectedFile);
//         if (selectedFile.type === "image") {
//           this.props.createAndUpdatePreview(selectedFile.uri);
//         } else if (selectedFile.type === "video") {
//           this.setState({
//             startTime: 0,
//             endTime: 59,
//           });

//           if (selectedFile.duration < 60000) {
//             this.setState({
//               endTime: Math.round(selectedFile.duration / 1000),
//             });
//           }
//           const maximumSize = { width: 50, height: 500 };
//           ProcessingManager.getPreviewForSecond(
//             selectedFile.uri,
//             1,
//             maximumSize,
//             "base64"
//           ).then((data) => {
//             var imageData = "data:image/jpeg;base64," + data;
//             this.props.updatePhotoPreview(imageData);
//           });
//         }
//       }
//     }
//   };
//   getLocations = async () => {
//     const permission = await Permissions.askAsync(Permissions.LOCATION);
//     if (permission.status === "granted") {
//       const location = await Location.getCurrentPositionAsync();
//       const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&rankby=distance&key=${ENV.googleApiKey}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       this.setState({ locations: data.results });
//     }
//   };

//   locationItems = () =>
//     this.state.locations.map((s, i) => {
//       return (
//         <Picker.Item
//           label={s.name + "\n" + s.vicinity}
//           value={s}
//           onPress={() => this.setLocation(item)}
//         />
//       );
//     });

//   setLocation(location) {
//     const place = {
//       name: location.name + "\n" + location.vicinity,
//       coords: {
//         lat: location.geometry.location.lat,
//         lng: location.geometry.location.lng,
//       },
//     };
//     this.props.updateLocation(place);
//     this.setState({ selectedLocation: location });
//   }

//   trimVideo() {
//     // alert(this.state.startTime + " " + this.state.endTime);
//     this.setState({ showLoading: true });

//     const options = {
//       startTime: this.state.startTime,
//       endTime: this.state.endTime,
//       quality: '1280x720', // iOS only
//       saveToCameraRoll: true, // default is false // iOS only
//       saveWithCurrentDate: true, // default is false // iOS only
//     };

//     // const selectedFile = this.props.post.photo;

//     // this.props.updatePhoto(selectedFile);

//     ProcessingManager.trim(this.props.post.photo.uri, options) // like VideoPlayer trim options
//       .then((newSource) => {
//         const duration = this.state.endTime - this.state.startTime;

//         this.props.updatePhoto({
//           ...this.props.post.photo,
//           duration: duration,
//           uri: newSource,
//         });
//         this.setState({ showLoading: false });

//         this.props.uploadPost();
//         this.props.navigation.navigate("Home");
//       });

//     // this.videoPlayerRef
//     //   .trim(options)
//     //   .then((newSource) => {
//     //     // alert(JSON.stringify(newSource));

//     //     const duration = this.state.endTime - this.state.startTime;

//     //     this.props.updatePhoto({
//     //       ...this.props.post.photo,
//     //       duration: duration,
//     //       uri: newSource,
//     //     });

//     //     this.props.uploadPost();
//     //     this.props.navigation.navigate("Home");
//     //   })
//     //   .catch(console.warn);
//   }
//   onEnd = () => {
//     this.videoPlayerRef.seek(this.state.startTime);
//   };
//   getSelectedComponent() {
//     const selectedFile = this.props.post.photo;
//     if (selectedFile) {
//       if (selectedFile.type === "image") {
//         return (
//           <Image
//             style={styles.postPhotoPreview}
//             source={{ uri: this.props.post.photo.uri }}
//           />
//         );
//       } else if (selectedFile.type === "video") {
//         return (
//           <View style={styles.postPhotoPreview}>
//             {/* <Video
//               ref={(ref) => (this.videoPlayerRef = ref)}
//               play={true} // default false
//               replay={true} // should player play video again if it's ended
//               rotate={false} // use this prop to rotate video if it captured in landscape mode iOS only
//               source={{ uri: this.props.post.photo.uri }}
//               playerWidth={Dimensions.get("screen").width} // iOS only
//               playerHeight={300} // iOS only
//               resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
//               style={{ backgroundColor: "black" }}
//               onProgress={this.onProgress}
//               startTime={10} // seconds
//               endTime={14} // seconds
//               onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
//             /> */}

//             <Video
//               source={{ uri: this.props.post.photo.uri }} // Can be a URL or a local file.
//               ref={(ref) => {
//                 this.videoPlayerRef = ref;
//               }} // Store reference
//               onEnd={this.onEnd}
//               style={styles.backgroundVideo}
//               onProgress={this.onProgress}
//               resizeMode="cover"
//             />
//             <View style={{ position: "absolute", bottom: 0 }}>
//               <Trimmer
//                 source={this.props.post.photo.uri}
//                 height={50}
//                 width={Dimensions.get("screen").width}
//                 onTrackerMove={(e) => alert(e.currentTime)} // iOS only
//                 currentTime={this.state.currentTime} // use this prop to set tracker position iOS only
//                 themeColor={"blue"} // iOS only
//                 thumbWidth={30} // iOS only
//                 trackerColor={"green"} // iOS only
//                 minLength={3}
//                 maxLength={60}
//                 // showTrackerHandle={true}
//                 resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
//                 onChange={(e) => {
//                   this.setState({
//                     startTime: Math.round(e.startTime),
//                     endTime: Math.round(e.endTime),
//                   });
//                   this.videoPlayerRef.seek(this.state.startTime);
//                   // this.videoPlayerRef.seek(this.state.startTime);
//                   // this.onEnd;
//                 }}
//               />
//               <Text
//                 style={{
//                   padding: 10,
//                   backgroundColor: "black",
//                   color: "white",
//                 }}
//               >
//                 {`${this.state.endTime - this.state.startTime} second selected`}
//               </Text>
//             </View>
//           </View>
//         );
//       }
//     } else {
//       return <View style={styles.postPhotoPreview} />;
//     }
//   }

//   getMaxDuration = (duration) => (_.isEmpty(duration) ? 15 : duration);

//   getMinDuration = (duration) => (_.isEmpty(duration) ? 3 : duration);

//   onProgress = ({ currentTime, playableDuration, seekableDuration }) => {
//     this.setState({ currentTime: currentTime });
//     if (currentTime >= this.state.endTime) {
//       this.videoPlayerRef.seek(this.state.startTime);
//     }
//   };

//   render() {
//     let data = [
//       {
//         value: "Brian Helm",
//       },
//       {
//         value: "Pat Hustad",
//       },
//     ];
//     let dataLoc = [
//       {
//         value: "Pacific City",
//       },
//       {
//         value: "RC Cafe",
//       },
//       {
//         value: "Pub House",
//       },
//       {
//         value: "Left Coast Brewing",
//       },
//     ];
//     return (
//       <View style={{ flex: 1, width: "100%", height: "100%" }}>
//         <KeyboardAvoidingView
//           style={{ flex: 1, width: "100%" }}
//           behavior={"padding"}
//         >
//           <ScrollView
//             style={[{ width: "100%" }]}
//             contentContainerStyle={{ alignItems: "center" }}
//           >
//             <NavigationEvents onWillFocus={this.onWillFocus} />
//             {this.getSelectedComponent()}
//             {/* <Image
//               style={styles.postPhotoPreview}
//               source={{ uri: this.props.post.photo.uri }}
//             /> */}
//             {this.renderTopBar()}

//             <View style={{ marginTop: 20 }}>
//               <Item floatingLabel>
//                 <Label>Write a caption..</Label>
//                 <Input
//                   value={this.props.post.description}
//                   onChangeText={(text) => this.props.updateDescription(text)}
//                 />
//               </Item>
//               {this.state.locations.length > 0 ? (
//                 <Item underline>
//                   <Picker
//                     iosIcon={<Icon name="arrow-down" />}
//                     mode="dropdown"
//                     style={{ width: Dimensions.get("screen").width - 30 }}
//                     placeholder="Add a Location"
//                     placeholderStyle={{ color: "#bfc6ea" }}
//                     placeholderIconColor="#007aff"
//                     selectedValue={this.state.selectedLocation}
//                     onValueChange={this.setLocation.bind(this)}
//                   >
//                     {this.locationItems()}
//                   </Picker>
//                 </Item>
//               ) : null}
//               <TouchableOpacity style={[styles.buttonPost]} onPress={this.post}>
//                 <Text>Post</Text>
//               </TouchableOpacity>
//             </View>
//             {/* <Dropdown label='Tag People' data={data} containerStyle={styles.dropDown}/>
//       <Dropdown label='Add Location' data={dataLoc} containerStyle={styles.dropDown} />
//       <View style={[styles.postShare, styles.row, styles.space,]}>
//         <Text style={[styles.left,{ color: 'rgba(150,150,150,0.9)' }]}>Facebook</Text>
//         <TouchableOpacity style={[styles.buttonShare, styles.right]}>
//           <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={[styles.postShare, styles.row, styles.space,]}>
//         <Text style={[styles.left, { color: 'rgba(150,150,150,0.9)' }]}>Twitter</Text>
//         <TouchableOpacity style={[styles.buttonShare, styles.right]}>
//           <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
//         </TouchableOpacity>
//       </View> */}
//           </ScrollView>
//         </KeyboardAvoidingView>
//         {this.state.showLoading ? (
//           <Loader message="Posting, Please wait... " bgColor="white" />
//         ) : null}
//       </View>
//     );
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators(
//     {
//       updateDescription,
//       uploadPost,
//       updateLocation,
//       uploadPhoto,
//       updatePhoto,
//       createAndUpdatePreview,
//       updatePhotoPreview,
//     },
//     dispatch
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     post: state.post,
//     user: state.user,
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Post);
