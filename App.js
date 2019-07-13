import './src/fixtimerbug';
import React from 'react';
import SwitchNavigator from './navigation/SwitchNavigator';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
//import logger from 'redux-logger';
import firebase from './config/firebase';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware } from 'redux';
const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SwitchNavigator/>
      </Provider>
    );
  }
}
