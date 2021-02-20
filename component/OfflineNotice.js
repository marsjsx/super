import React, { PureComponent } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get("window");
import {
  internetConnected,
  internetDisconnected,
} from "../actions/connectionchangeAction";
import { connect } from "react-redux";

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}
var unsubscribe;
class OfflineNotice extends PureComponent {
  _isMounted = false;
  state = {
    isConnected: true,
  };

  componentDidMount() {
    this._isMounted = true;

    NetInfo.fetch().then((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      // alert(JSON.stringify(state));
      if (this._isMounted) {
        this.setState({ isConnected });
      }
      if (state.isConnected) {
        this.props.internetConnected();
      } else {
        this.props.internetDisconnected();
      }
    });

    unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      this.handleConnectivityChange(state.isConnected);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (unsubscribe) {
      // Unsubscribe
      unsubscribe();
    }
  }

  handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      if (this._isMounted) {
        this.setState({ isConnected });
      }
      this.props.internetConnected();
    } else {
      if (this._isMounted) {
        this.setState({ isConnected });
      }
      this.props.internetDisconnected();
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: "#b52424",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width,
  },
  offlineText: { color: "#fff" },
});

const mapStateToProps = (state) => {
  return {
    // loginResult:state

    checkConnection: state.checkconnection,
    // registerResult:state.register
  };
};

// export default OfflineNotice;

export const monitorconnection = connect(mapStateToProps, {
  internetConnected,
  internetDisconnected,
})(OfflineNotice);
export default monitorconnection;
