import React from "react";
import PropTypes from "prop-types";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Thumbnail } from "native-base";

import Avatar from "../Avatar";
// Styles
import styles from "./MentionListItemStyles";

export class MentionListItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    onSuggestionTap: PropTypes.func,
    editorStyles: PropTypes.object,
    sourceEmpty: PropTypes.any,
  };

  onSuggestionTap = (user, hidePanel) => {
    this.props.onSuggestionTap(user);
  };

  render() {
    const { item: user, index, editorStyles, sourceEmpty } = this.props;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.suggestionItem, editorStyles.mentionListItemWrapper]}
          onPress={() => this.onSuggestionTap(user)}
        >
          <Avatar
            user={user}
            wrapperStyles={styles.thumbnailWrapper}
            charStyles={styles.thumbnailChar}
          />
          <Thumbnail
            style={{ position: "absolute", left: 19 }}
            small
            source={{ uri: user.photo }}
          />
          {/* <Image
            source={user && user.picture ? { uri: user.picture } : sourceEmpty}
            style={[styles.image, editorStyles.mentionListItemImage]}
            resizeMode={'contain'}
          /> */}

          <View style={[styles.text, editorStyles.mentionListItemTextWrapper]}>
            <Text
              style={[styles.username, editorStyles.mentionListItemUsername]}
            >
              @{user.username}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MentionListItem;
