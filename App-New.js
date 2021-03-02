// import "./src/fixtimerbug";
// import React from "react";
// // import SwitchNavigator from "./navigation/SwitchNavigator";
// import reducer from "./reducers";
// import thunkMiddleware from "redux-thunk";
// import thunk from "redux-thunk";
// import db from "./config/firebase";
// //import logger from 'redux-logger';
// import firebase from "./config/firebase";
// import { Provider } from "react-redux";
// import { createStore, applyMiddleware, compose } from "redux";
// import { preloadImages } from "./actions/post";
// const middleware = applyMiddleware(thunkMiddleware);
// import { View, Text, Platform } from "react-native";
// import { isUserBlocked } from "./util/Helper";
// import {
//   SafeAreaProvider,
//   initialWindowMetrics,
//   SafeAreaView,
// } from "react-native-safe-area-context";
// import AppNavigator from "./src/navigator";

// // import { SafeAreaView } from "react-native-safe-area-context";
// // import {
// //   SafeAreaProvider,
// //   initialWindowMetrics,
// // } from "react-native-safe-area-context";
// import FlashMessage from "react-native-flash-message";
// import SplashScreen from "react-native-splash-screen";
// import { loadFromlocalStorage, loadState, saveState } from "./helpers/cache";
// const persistedState = loadState();
// import throttle from "lodash.throttle";

// const middlewares = [thunk];

// // compose(applyMiddleware(thunk))(createStore)(reducer)
// // const store = createStore(reducer, middleware);

// const store = createStore(
//   reducer,
//   undefined,
//   compose(applyMiddleware(...middlewares))
// );

// let newstore;

// export const observeStore = () => {
//   store.subscribe(
//     throttle(() => {
//       var posts = store.getState().post;
//       posts.lastVisible = null;
//       saveState({
//         post: posts,
//       });
//       // if (store.getState().post && store.getState().post.feed) {
//       //   let feedsize = store.getState().post.feed[0];
//       //   alert(JSON.stringify(feedsize));
//       // }
//     }, 1000)
//   );
// };

// export default class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isStoreLoading: true,
//       store: store,
//     };
//   }
//   async componentDidMount() {
//     // SplashScreen.hide();
//     var initialState = this.state.store.getState();
//     this.setState({ isStoreLoading: true });

//     try {
//       let cachedState = await loadState();

//       this.setState({
//         store: createStore(
//           reducer,
//           cachedState,
//           compose(applyMiddleware(...middlewares))
//         ),
//       });

//       var posts = await db
//         .collection("posts")
//         .orderBy("date", "desc")
//         .limit(18)
//         .get();
//       var images = [];
//       let array = [];
//       var lastVisible = null;
//       // Get the last visible document
//       if (posts && posts.size > 0) {
//         lastVisible = posts.docs[posts.docs.length - 1];
//       }
//       posts.forEach((post) => {
//         var item = post.data();
//         array.push(post.data());
//         if (item.photo && item.photo.length > 15) {
//           const normalisedSource =
//             item.photo &&
//             typeof item.photo === "string" &&
//             !item.photo.split("https://")[1]
//               ? null
//               : item.photo;
//           if (normalisedSource) {
//             images.push({
//               uri: item.photo,
//             });
//           }
//         }
//         if (item.type == "image") {
//           if (item.postPhoto && item.postPhoto.length > 15) {
//             images.push({
//               uri: item.postPhoto,
//             });
//           }
//         }
//       });
//       if (images.length > 0) {
//         preloadImages(images);
//       }
//       if (array.length > 0) {
//         initialState.post = { feed: array, lastVisible: lastVisible };
//         this.setState({
//           store: createStore(
//             reducer,
//             initialState,
//             compose(applyMiddleware(...middlewares))
//           ),
//         });
//       }
//       this.setState({ isStoreLoading: false });
//       SplashScreen.hide();
//     } catch (e) {
//       // console.log(e);
//       this.setState({ isStoreLoading: false });
//       SplashScreen.hide();
//     }
//     observeStore();
//   }

//   render() {
//     if (this.state.isStoreLoading) {
//       return <View />;
//     } else {
//       return (
//         <SafeAreaProvider initialMetrics={initialWindowMetrics}>
//           <Provider store={this.state.store}>
//             <AppNavigator />
//             {/* <SwitchNavigator /> */}
//             <FlashMessage position="top" />
//           </Provider>
//         </SafeAreaProvider>
//       );
//     }
//   }
// }
