import db from "../config/firebase";
import { orderBy } from "lodash";
import { uploadPhoto } from "../actions/index";

export const saveMessage = (message, chatID, members, updatedAt) => {
  // db.collection("messages")
  //   .doc()
  //   .set(message);

  db.collection("messages")
    .doc(chatID)
    .set({ members: members.members, updatedAt: updatedAt.updatedAt });

  db.collection("messages")
    .doc(chatID)
    .collection("chats")
    .add(message);
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
      members: [id, uid].sort()
    };
    var message = {
      ...messages
    };
    message._id = updatedAt;
    var chatMessage = message;
    let listmessages = getState().messages;

    var itemindex;
    if (listmessages.length) {
      itemindex = listmessages.findIndex(value => value.user.uid === id);
    } else {
      listmessages = [];
    }

    var newlist = [];

    if (itemindex >= 0) {
      var updatedItem = {
        ...listmessages[itemindex],
        chats: listmessages[itemindex].chats.concat(chatMessage),
        updatedAt
      };

      // listmessages[itemindex] = updatedItem;
      //  newlist = [...listmessages];
      newlist = listmessages.map((item, index) => {
        // Replace the item at index 2
        if (index === itemindex) {
          return updatedItem;
        }
        // Leave every other item unchanged
        return item;
      });
    } else {
      var chats = [];
      const userQuery = await db
        .collection("users")
        .doc(id)
        .get();
      const { uid, photo, username } = userQuery.data();
      let user = { uid, photo, username };
      chats.push(chatMessage);
      listmessages.push({
        members: members,
        user: user,
        chats: chats,
        updatedAt
      });
      newlist = [...listmessages];
      // newlist = listmessages;
    }

    // dispatch({
    //   type: "GET_MESSAGES",
    //   payload: orderBy(newlist, "createdAt", "desc")
    // });

    dispatch({
      type: "GET_MESSAGES",
      payload: newlist
    });

    try {
      const timeStamp = chatMessage.createdAt.getTime();
      chatMessage.createdAt = timeStamp;
      message = {
        ...chatMessage,
        pending: false,
        sent: true,
        received: false
      };
      if (message.image) {
        //  alert(chatMessage.image);
        dispatch(uploadPhoto(message.image)).then(imageUrl => {
          message.image = imageUrl;
          saveMessage(message, chatId, members, updatedAt);
        });
      } else {
        saveMessage(message, chatId, members, updatedAt);
      }
    } catch (e) {
      alert(e);
      // console.error(e);
    }
  };
};

export const getMessages = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    // let listmessages = getState().messages;
    // alert(uid);
    let messages = [];
    try {
      const query = await db
        .collection("messages")
        .where("members", "array-contains", uid);

      query.onSnapshot(querySnapshot => {
        querySnapshot.forEach(async response => {
          const chatQuery = await db
            .collection("messages")
            .doc(response.id)
            .collection("chats")
            .orderBy("createdAt", "desc")
            .get();

          let chat = [];
          chatQuery.forEach(message => {
            chat.push(message.data());
            // alert(JSON.stringify(message));
          });

          let members = response.data().members;
          let updatedAt = response.data().updatedAt;

          let listmessages = getState().messages;
          const id = members.filter(id => id !== uid)[0];

          var itemindex;
          if (listmessages.length) {
            itemindex = listmessages.findIndex(
              value => value.user && value.user.uid === id
            );
          } else {
            listmessages = [];
          }
          var newlist = [];

          if (itemindex >= 0) {
            var updatedItem = {
              ...listmessages[itemindex],
              chats: chat,
              updatedAt: updatedAt
            };

            // listmessages[itemindex] = updatedItem;
            //  newlist = [...listmessages];
            newlist = listmessages.map((item, index) => {
              // Replace the item at index 2
              if (index === itemindex) {
                return updatedItem;
              }
              // Leave every other item unchanged
              return item;
            });
          } else {
            const userQuery = await db
              .collection("users")
              .doc(id)
              .get();
            const { uid, photo, username } = userQuery.data();
            let user = { uid, photo, username };
            listmessages.push({
              members: members,
              user: user,
              chats: chat,
              updatedAt: updatedAt
            });
            newlist = [...listmessages];
            // newlist = listmessages;
          }

          //  alert(JSON.stringify(newlist));
          dispatch({
            type: "GET_MESSAGES",
            payload: newlist
          });
        });
      });
    } catch (e) {
      alert(e);
      /* console.error(e) */
    }
  };
};
