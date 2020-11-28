import AsyncStorage from "@react-native-community/async-storage";

export const savetolocalStorage = async (serilaizedstate) => {
  try {
    await AsyncStorage.setItem("state", serilaizedstate);
  } catch (error) {
    console.log(e);
    alert(error);
  }
};

export const clearlocalStorage = async () => {
  try {
    await AsyncStorage.removeItem("state");
  } catch (error) {
    console.log(e);
    alert(error);
  }
};

export const loadFromlocalStorage = async () => {
  try {
    let serilaizedstate = await AsyncStorage.getItem("state");

    if (serilaizedstate === null) return undefined;
  } catch (error) {
    console.log(e);
    return undefined;
  }
};
export const loadState = async () => {
  try {
    const serializedState = await AsyncStorage.getItem("state");
    // alert(serializedState);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    // alert(serializedState);
    AsyncStorage.setItem("state", serializedState);
  } catch (error) {
    alert(error);
    // ignore write errors
  }
};
