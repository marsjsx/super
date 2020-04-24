// export const convertDate = millisec => {
//   // alert(millisec)
// //   return new Date(millisec);
//   //   return new Date(millisec).format("MM/DD/YYYY");
//   //   var length = millisec.length - 7;
//   //   var date = parseInt(millisec.substring(6, length));
//   //   return new Date(date).toUTCString();
// };

export const convertDate = date => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
