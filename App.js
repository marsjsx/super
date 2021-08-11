import React, { useEffect, useState } from "react";
import { View, Text, BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import HomeScreen from "./screens/Home";
import HomeScreen from "./screens/Home";

import FlashMessage from "react-native-flash-message";
import SplashScreen from "react-native-splash-screen";
import { loadFromlocalStorage, loadState, saveState } from "./helpers/cache";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import db from "./config/firebase";
import { preloadImages } from "./actions/post";
import AppNavigator from "./src/navigator";

const persistedState = loadState();
import throttle from "lodash.throttle";
import reducer from "./reducers";
import thunkMiddleware from "redux-thunk";
import thunk from "redux-thunk";
const middlewares = [thunk];
import { MixpanelManager } from "./Analytics";
import VersionCheck from "react-native-version-check";
import AppVersionModal from "./src/appupdates/AppVersionModal";
// compose(applyMiddleware(thunk))(createStore)(reducer)
// const store = createStore(reducer, middleware);

const initialStore = createStore(
  reducer,
  undefined,
  compose(applyMiddleware(...middlewares))
);

const Stack = createStackNavigator();

export const observeStore = () => {
  store.subscribe(
    throttle(() => {
      var posts = initialStore.getState().post;

      posts.lastVisible = null;

      saveState({
        post: posts,
      });
      // if (store.getState().post && store.getState().post.feed) {
      //   let feedsize = store.getState().post.feed[0];
      //   alert(JSON.stringify(feedsize));
      // }
    }, 1000)
  );
};

function App() {
  const [store, setStore] = useState(initialStore);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [showAppUpdateModal, setShowAppUpdateModal] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");

  useEffect(async () => {
    checkUpdateNeeded();

    var initialState = store.getState();
    setIsStoreLoading(true);

    try {
      let cachedState = await loadState();

      setStore(
        createStore(
          reducer,
          cachedState,
          compose(applyMiddleware(...middlewares))
        )
      );

      // var posts = await db
      //   .collection("posts")
      //   .orderBy("date", "desc")
      //   .limit(18)
      //   .get();
      // var images = [];
      // let array = [];
      // var lastVisible = null;
      // // Get the last visible document
      // if (posts && posts.size > 0) {
      //   lastVisible = posts.docs[posts.docs.length - 1];
      // }
      // posts.forEach((post) => {
      //   var item = post.data();
      //   array.push(post.data());
      //   if (item.photo && item.photo.length > 15) {
      //     const normalisedSource =
      //       item.photo &&
      //       typeof item.photo === "string" &&
      //       !item.photo.split("https://")[1]
      //         ? null
      //         : item.photo;
      //     if (normalisedSource) {
      //       images.push({
      //         uri: item.photo,
      //       });
      //     }
      //   }
      //   if (item.type == "image") {
      //     if (item.postPhoto && item.postPhoto.length > 15) {
      //       images.push({
      //         uri: item.postPhoto,
      //       });
      //     }
      //   }
      // });
      // if (images.length > 0) {
      //   preloadImages(images);
      // }
      // if (array.length > 0) {
      //   initialState.post = { feed: array, lastVisible: lastVisible };

      //   setStore(
      //     createStore(
      //       reducer,
      //       initialState,
      //       compose(applyMiddleware(...middlewares))
      //     )
      //   );
      // }
      setIsStoreLoading(false);
      SplashScreen.hide();
    } catch (e) {
      // console.log(e);
      setIsStoreLoading(false);
      SplashScreen.hide();
    }
    // observeStore();
  }, []);
  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate();
    if (updateNeeded && updateNeeded.isNeeded) {
      //Alert the user and direct to the app url
      setStoreUrl(updateNeeded.storeUrl);
      setShowAppUpdateModal(true);
    }
    // setStoreUrl(updateNeeded.storeUrl);
    // setShowAppUpdateModal(true);
  };

  if (isStoreLoading) return <View />;
  return (
    <Provider store={store}>
      <AppNavigator />
      <FlashMessage position="top" />

      {showAppUpdateModal && <AppVersionModal storeUrl={storeUrl} />}
      {/* <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer> */}
    </Provider>
  );
}

export default App;
// export default class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isStoreLoading: true,
//     };
//   }

//   componentDidMount() {
//     SplashScreen.hide();
//   }

//   render() {
//     if (this.state.isStoreLoading) {
//       return <View />;
//     } else {
//       return (
//         // <SafeAreaProvider initialMetrics={initialWindowMetrics}>
//         //   <Provider store={this.state.store}>
//         //     <AppNavigator />
//         //     {/* <SwitchNavigator /> */}
//         //     <FlashMessage position="top" />
//         //   </Provider>
//         // </SafeAreaProvider>
//         <NavigationContainer>
//           <Stack.Navigator>
//             <Stack.Screen name="Home" component={HomeScreen} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       );
//     }
//   }
// }
