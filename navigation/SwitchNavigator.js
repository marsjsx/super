import React from 'react';
import TabNavigator from './TabNavigator.js'
import ClearTabs from './ClearTabs.js'
import AuthNavigator from './AuthNavigator.js'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

const SwitchNavigator = createSwitchNavigator(
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {
        headerTransparent: true,
      }
    },
    Auth: {
      screen: AuthNavigator
    }

  },
  {
    initialRouteName: 'Auth',
  },
  
);

export default createAppContainer(SwitchNavigator);