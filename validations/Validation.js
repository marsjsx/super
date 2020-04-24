// import Toast from "react-native-tiny-toast";
import { showMessage, hideMessage } from "react-native-flash-message";

export const isNotEmpty = (title, value) => {
  if (value) {
    return true;
  }
  showMessage({
    message: "Alert",
    description: "Please enter " + title + ".",
    type: "danger",
    duration: 3000
  });
  return false;
};

const emailPattern = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export const isEmailValid = value => {
  if (value == "") {
    showMessage({
      message: "Alert",
      description: "Please enter email.",
      type: "danger",
      duration: 3000
    });
    //  Toast.show("Please enter email.")
    // alert("Please enter email.");
    return false;
  } else if (!emailPattern.test(value)) {
    showMessage({
      message: "Alert",
      description: "Please enter valid email.",
      type: "danger",
      duration: 3000
    });
    return false;
  } else {
    return true;
  }
};

export const isPassValid = value => {
  if (value) {
    if (value.length < 6) {
      showMessage({
        message: "Alert",
        description: "Password must be of minimum 6 characters.",
        type: "danger",
        duration: 3000
      });

      return false;
    }
    return true;
  }

  showMessage({
    message: "Alert",
    description: "Please enter password.",
    type: "danger",
    duration: 3000
  });

  return false;
};
