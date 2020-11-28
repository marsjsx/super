// import React, { Component } from "react";
// import NetInfo from "@react-native-community/netinfo";
// import { showMessage, hideMessage } from "react-native-flash-message";

// export default CheckConnectivity = async () => {
//   alert("Reached");
//   NetInfo.fetch().then((state) => {
//     // console.log("Connection type", state.type);
//     // console.log("Is connected?", state.isConnected);
//     if (state.isConnected) {
//       showMessage({
//         message: "CONNECTED",
//         description: `You are Online`,
//         type: "success",
//         duration: 2000,
//       });
//       return true;
//     } else {
//       showMessage({
//         message: "CONNECTION ERROR",
//         description: `Internet connection not found`,
//         type: "danger",
//         duration: 2000,
//       });
//       return false;
//     }
//   });
// };
