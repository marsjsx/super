import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStoreLoading: true,
    };
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    if (this.state.isStoreLoading) {
      return <View />;
    } else {
      return (
        // <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        //   <Provider store={this.state.store}>
        //     <AppNavigator />
        //     {/* <SwitchNavigator /> */}
        //     <FlashMessage position="top" />
        //   </Provider>
        // </SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}
