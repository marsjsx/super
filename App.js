import './src/fixtimerbug';
import React from 'react';
import SwitchNavigator from './navigation/SwitchNavigator';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import thunk from 'redux-thunk';
//import logger from 'redux-logger';
import firebase from './config/firebase';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware,compose } from 'redux';
const middleware = applyMiddleware(thunkMiddleware);
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
        <SwitchNavigator/>
        <FlashMessage position="top" /> 
      </Provider>
    );
  }
}
