import db from "../config/firebase";
import { orderBy } from "lodash";
import { uploadPhoto } from "../actions/index";
import _ from "lodash";
import Snackbar from "react-native-snackbar";
import constants from "../constants";
import { allowNotifications, sendNotification } from "./";

export const saveMessage = (message, chatID, members, updatedAt) => {
  // db.collection("messages")
  //   .doc()
  //   .set(message);

  db.collection("messages").doc(chatID).set(
    {
      members: members.members,
      updatedAt: updatedAt.updatedAt,
      latestMessage: message,
    },
    { merge: true }
  );

  db.collection("messages").doc(chatID).collection("chats").add(message);
};

export const chattingID = (chatterID, chateeID) => {
  const chatIDpre = [];
  chatIDpre.push(chatterID);
  chatIDpre.push(chateeID);
  chatIDpre.sort();
  return chatIDpre.join("_");
};

export const addMessage = (id, messages) => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    const chatId = chattingID(uid, id);
    const updatedAt = { updatedAt: new Date().getTime() };

    const members = {
      members: [id, uid].sort(),
    };

    const seenBy = { [uid]: true, [id]: false };
    var message = {
      ...messages,
      seenBy,
    };
    message._id = updatedAt.updatedAt;
    var chatMessage = message;
    let listmessages = getState().messages;

    var itemindex;
    if (listmessages.length) {
      itemindex = listmessages.findIndex((value) => value.user.uid === id);
    } else {
      listmessages = [];
    }

    var newlist = [];

    if (itemindex >= 0) {
      var updatedItem = {
        ...listmessages[itemindex],
        chats: listmessages[itemindex].chats
          ? listmessages[itemindex].chats.concat(chatMessage)
          : [],
        updatedAt,
      };

      // listmessages[itemindex] = updatedItem;
      //  newlist = [...listmessages];
      listmessages = listmessages.map((item, index) => {
        // Replace the item at index 2
        if (index === itemindex) {
          return updatedItem;
        }
        // Leave every other item unchanged
        return item;
      });
    } else {
      var chats = [];
      const userQuery = await db.collection("users").doc(id).get();
      const { uid, photo, username } = userQuery.data();
      let user = { uid, photo, username };
      chats.push(chatMessage);
      listmessages.push({
        members: members,
        user: user,
        chats: chats,
        updatedAt,
      });
      listmessages = [...listmessages];
      // newlist = listmessages;
    }

    // dispatch({
    //   type: "GET_MESSAGES",
    //   payload: orderBy(newlist, "createdAt", "desc")
    // });

    dispatch({
      type: "GET_MESSAGES",
      payload: listmessages,
    });

    try {
      const timeStamp = chatMessage.createdAt.getTime();
      chatMessage.createdAt = timeStamp;
      message = {
        ...chatMessage,
        pending: false,
        sent: true,
        received: false,
      };
      if (message.image) {
        //  alert(chatMessage.image);
        dispatch(uploadPhoto(message.image)).then((imageUrl) => {
          message.image = imageUrl;
          saveMessage(message, chatId, members, updatedAt);
        });
      } else {
        saveMessage(message, chatId, members, updatedAt);
      }

      var body = `${message.user.name} sent new message`;
      dispatch(sendNotification(id, "New Message", body, "MESSAGE"));
    } catch (e) {
      alert(e);
      // console.error(e);
    }
  };
};

export const updateSeenBy = (id) => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    const chatId = chattingID(uid, id);

    let listmessages = getState().messages;
    var updateSeenBy = false;

    var itemindex;
    if (listmessages.length) {
      itemindex = listmessages.findIndex((value) => value.user.uid === id);
    } else {
      listmessages = [];
    }

    if (itemindex >= 0) {
      listmessages = listmessages.map((item, index) => {
        // Replace the item at index 2
        if (index === itemindex) {
          item.chats.forEach((element) => {
            if (!element.seenBy[uid]) {
              updateSeenBy = true;
              element.seenBy[uid] = true;
            }
          });
          // return updatedItem;
        }
        // Leave every other item unchanged
        return item;
      });
    }

    if (updateSeenBy) {
      dispatch({
        type: "GET_MESSAGES",
        payload: listmessages,
      });

      // Set the value of 'NYC'
      var messagesRef = db
        .collection("messages")
        .doc(chatId)
        .collection("chats")
        .where(`seenBy.${uid}`, "==", false)
        .get()
        .then(function (querySnapshot) {
          // Once we get the results, begin a batch
          var batch = db.batch();

          querySnapshot.forEach(function (doc) {
            // For each doc, add a delete operation to the batch
            batch.update(doc.ref, { [`seenBy.${uid}`]: true });
          });

          // Commit the batch
          return batch.commit();
        });

      // batch.update(messagesRef, { [`seenBy.${uid}`]: true });

      // // Commit the batch
      // batch.commit().then(function() {
      //   // ...
      // });
    }
  };
};

export const deleteUserMessages = (id) => {
  return async (dispatch, getState) => {
    Snackbar.show({
      text: "Message Deleted",
      backgroundColor: constants.colors.info,
      duration: Snackbar.LENGTH_LONG,
    });

    const { uid, photo, username } = getState().user;
    const chatId = chattingID(uid, id);

    db.collection("messages")
      .doc(chatId)
      .update({
        [uid]: new Date().getTime(),
      });

    let listmessages = getState().messages;
    var itemindex;
    if (listmessages.length) {
      itemindex = listmessages.findIndex(
        (value) => value.user && value.user.uid === id
      );

      var modifiedArray = listmessages.filter(
        (item) => item.user && item.user.uid != id
      );

      dispatch({
        type: "GET_MESSAGES",
        payload: modifiedArray,
      });
      // if (itemindex > -1) {
      //   var modifiedArray = listmessages.splice(itemindex, 1);

      //   dispatch({
      //     type: "GET_MESSAGES",
      //     payload: modifiedArray,
      //   });
      // }
    }
  };
};

export const deleteMessage = (id, messageId) => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    const chatId = chattingID(uid, id);

    var query = db
      .collection("messages")
      .doc(chatId)
      .collection("chats")
      .where("_id", "==", messageId);
    query
      .get()
      .then(function (querySnapshot) {
        // alert(querySnapshot.length);
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
          Snackbar.show({
            text: "Message Deleted",
            backgroundColor: constants.colors.info,
            duration: Snackbar.LENGTH_LONG,
          });
          let listmessages = getState().messages;
          var itemindex;
          if (listmessages.length) {
            itemindex = listmessages.findIndex(
              (value) => value.user && value.user.uid === id
            );
            if (itemindex > -1) {
              var message = listmessages[itemindex];
              if (!message.chats) {
                message.chats = [];
              }
              var modifiedChatArray = message.chats.filter(
                (item) => item._id != messageId
              );
              // var modifiedChatArray = message.chats.splice(messageindex, 1);
              // alert(modifiedChatArray.length);
              message.chats = modifiedChatArray;
              dispatch({
                type: "GET_MESSAGES",
                payload: [...listmessages],
              });
            }
          }
        });
      })
      .catch(function (error) {
        alert(error);
        console.error("Error removing document: ", error);
      });
  };
};

export const getMessages = () => {
  return async (dispatch, getState) => {
    const { uid, lastVisible } = getState().user;

    // alert("Called");
    // let listmessages = getState().messages;
    // alert(uid);
    let messages = [];
    try {
      if (uid) {
        var query;
        if (lastVisible) {
          // alert("Called");
          query = await db
            .collection("messages")
            .where("members", "array-contains", uid)
            .orderBy("updatedAt", "desc")
            .startAfter(lastVisible)
            .limit(15);
        } else {
          query = await db
            .collection("messages")
            .where("members", "array-contains", uid)
            .orderBy("updatedAt", "desc")
            .limit(15);
        }
        var lastVisibleId = null;

        // alert("Called");
        query.onSnapshot((querySnapshot) => {
          if (querySnapshot && querySnapshot.size > 0) {
            lastVisibleId = querySnapshot.docs[querySnapshot.docs.length - 1];
            dispatch({ type: "LAST_VISIBLE_MESSAGE", payload: lastVisibleId });
            // }

            var chatlength = querySnapshot.size;
            var currentindex = 0;

            let listmessages = getState().messages;

            querySnapshot.forEach(async (response) => {
              currentindex++;

              var deletedMessageTime = response.data()[uid];
              var chatQuery;
              if (deletedMessageTime) {
                chatQuery = await db
                  .collection("messages")
                  .doc(response.id)
                  .collection("chats")
                  .where("createdAt", ">", deletedMessageTime)
                  .orderBy("createdAt", "desc")
                  // .limit(15)
                  .get();
              } else {
                chatQuery = await db
                  .collection("messages")
                  .doc(response.id)
                  .collection("chats")
                  .orderBy("createdAt", "desc")
                  // .limit(15)
                  .get();
              }

              // alert(JSON.stringify(deletedMessageTime));

              let chat = [];
              chatQuery.forEach((message) => {
                chat.push(message.data());
                // alert(JSON.stringify(message));
              });

              let members = response.data().members;
              let latestMessage = response.data().latestMessage;
              let updatedAt = response.data().updatedAt;
              let messageId = response.id;

              const id = members.filter((id) => id !== uid)[0];

              var itemindex;
              if (listmessages.length) {
                itemindex = listmessages.findIndex(
                  (value) => value.user && value.user.uid === id
                );
              } else {
                listmessages = [];
              }
              var newlist = [];

              if (itemindex >= 0) {
                if (chat && chat.length > 0) {
                  if (!listmessages[itemindex].chat) {
                    listmessages[itemindex].chat = [];
                  }

                  var chatList = _.uniqBy(
                    listmessages[itemindex].chat.concat(chat),
                    "_id"
                  );
                  var updatedItem = {
                    ...listmessages[itemindex],
                    chats: chatList,
                    updatedAt: updatedAt,
                    latestMessage: latestMessage,
                  };

                  // listmessages[itemindex] = updatedItem;
                  //  newlist = [...listmessages];
                  listmessages = listmessages.map((item, index) => {
                    // Replace the item at index 2
                    if (index === itemindex) {
                      return updatedItem;
                    }
                    // Leave every other item unchanged
                    return item;
                  });
                }
              } else {
                const userQuery = await db.collection("users").doc(id).get();
                const { uid, photo, username } = userQuery.data();
                let user = { uid, photo, username };
                if (chat && chat.length > 0) {
                  listmessages.push({
                    members: members,
                    user: user,
                    chats: chat,
                    latestMessage: latestMessage,
                    updatedAt: updatedAt,
                    id: messageId,
                    key: messageId,
                  });
                }
                listmessages = [...listmessages];
                // newlist = listmessages;
              }

              if (chatlength == currentindex) {
                dispatch({
                  type: "GET_MESSAGES",
                  payload: listmessages,
                });
              }
            });
          }
        });
      }
    } catch (e) {
      // alert(e);
      console.error(e);
    }
  };
};

export const getMessagesOld = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    // let listmessages = getState().messages;
    // alert(uid);
    let messages = [];
    try {
      if (uid) {
        const query = await db
          .collection("messages")
          .where("members", "array-contains", uid);

        query.onSnapshot((querySnapshot) => {
          var chatlength = querySnapshot.size;
          var currentindex = 0;

          let listmessages = getState().messages;

          querySnapshot.forEach(async (response) => {
            currentindex++;
            const chatQuery = await db
              .collection("messages")
              .doc(response.id)
              .collection("chats")
              .orderBy("createdAt", "desc")
              .get();

            let chat = [];
            chatQuery.forEach((message) => {
              chat.push(message.data());
              // alert(JSON.stringify(message));
            });

            let members = response.data().members;
            let updatedAt = response.data().updatedAt;
            let messageId = response.id;

            const id = members.filter((id) => id !== uid)[0];

            var itemindex;
            if (listmessages.length) {
              itemindex = listmessages.findIndex(
                (value) => value.user && value.user.uid === id
              );
            } else {
              listmessages = [];
            }
            var newlist = [];

            if (itemindex >= 0) {
              var updatedItem = {
                ...listmessages[itemindex],
                chats: chat,
                updatedAt: updatedAt,
              };

              // listmessages[itemindex] = updatedItem;
              //  newlist = [...listmessages];
              listmessages = listmessages.map((item, index) => {
                // Replace the item at index 2
                if (index === itemindex) {
                  return updatedItem;
                }
                // Leave every other item unchanged
                return item;
              });
            } else {
              const userQuery = await db.collection("users").doc(id).get();
              const { uid, photo, username } = userQuery.data();
              let user = { uid, photo, username };
              listmessages.push({
                members: members,
                user: user,
                chats: chat,
                updatedAt: updatedAt,
                id: messageId,
                key: messageId,
              });
              listmessages = [...listmessages];
              // newlist = listmessages;
            }

            if (chatlength == currentindex) {
              dispatch({
                type: "GET_MESSAGES",
                payload: listmessages,
              });
            }
          });
        });
      }
    } catch (e) {
      alert(e);
      // console.error(e);
    }
  };
};
