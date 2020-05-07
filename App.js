import "./src/fixtimerbug";
import React from "react";
import SwitchNavigator from "./navigation/SwitchNavigator";
import reducer from "./reducers";
import thunkMiddleware from "redux-thunk";
import thunk from "redux-thunk";
//import logger from 'redux-logger';
import firebase from "./config/firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
const middleware = applyMiddleware(thunkMiddleware);
import { createStackNavigator } from "react-navigation-stack";
import { View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Subtitle,
  Footer,
} from "native-base";

import FlashMessage from "react-native-flash-message";

const middlewares = [thunk];

// compose(applyMiddleware(thunk))(createStore)(reducer)
// const store = createStore(reducer, middleware);

const store = createStore(
  reducer,
  undefined,
  compose(applyMiddleware(...middlewares))
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SwitchNavigator />
        <FlashMessage position="top" />
      </Provider>
    );
  }
}

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>Home Screen</Text>
//         <Title style={{ color: "black" }}>Sign up for </Title>
//         <Subtitle style={{ textAlign: "center", margin: 10 }}>
//           Create a profile, follow other accounts, make your own videos, and
//           more{" "}
//         </Subtitle>
//       </View>
//     );
//   }
// }

// const AppNavigator = createStackNavigator({
//   Home: {
//     screen: HomeScreen,
//   },
// });

// export default createAppContainer(AppNavigator);
