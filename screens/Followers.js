import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons } from "@expo/vector-icons";
import { orderBy } from "lodash";
import ProgressiveImage from "../component/ProgressiveImage";
import EmptyView from "../component/emptyview";

import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getUser } from "../actions/user";

import moment from "moment";
import { groupBy, values } from "lodash";
import { Badge, Content } from "native-base";

class Followers extends React.Component {
  componentDidMount = () => {
    // this.props.getMessages();
  };

  goToUser = (user) => {
    // this.props.navigation.navigate("Profile");
    this.props.navigation.push("Profile", { uid: user.uid });
  };
  renderFooter = () => {
    // Check If Loading
    if (this.props.loadingUsers) {
      return <ActivityIndicator />;
    } else {
      return null;
    }
  };

  // Retrieve More
  retrieveMore = async () => {
    this.props.onLoadMore();
  };
  render() {
    // alert(JSON.stringify(this.props.data));
    return (
      <View style={[styles.container, { marginTop: 20 }]}>
        <FlatList
          initialNumToRender="10"
          maxToRenderPerBatch="10"
          windowSize={10}
          data={this.props.data}
          // onEndReached={this.props.onLoadMore()}
          onEndReached={this.retrieveMore}
          onEndReachedThreshold={1}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={<EmptyView desc="No Data Found" />}
          keyExtractor={(item) => JSON.stringify(item.uid)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.goToUser(item)}
              style={[styles.row, styles.space]}
            >
              <ProgressiveImage
                thumbnailSource={{
                  uri: item.preview,
                }}
                transparentBackground="transparent"
                source={{ uri: item.photo }}
                style={styles.roundImage}
              />
              {/* <Image style={styles.roundImage} source={{ uri: item.photo }} /> */}

              <View style={[styles.container, styles.left]}>
                <Text style={styles.bold}>{item.username}</Text>
                <Text style={styles.gray}>{item.bio}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
