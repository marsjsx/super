import React from 'react';
import SwitchNavigator from './navigation/SwitchNavigator';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware } from 'redux';
const middleware = applyMiddleware(thunkMiddleware, logger);
const store = createStore(reducer, middleware);
// console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SwitchNavigator/>
      </Provider>
    );
  }
}
