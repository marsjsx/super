import { Mixpanel } from "mixpanel-react-native";
import { token as MixpanelToken } from "./app.json";

export default class MixpanelManager {
  static sharedInstance =
    MixpanelManager.sharedInstance || new MixpanelManager();

  constructor() {
    this.configMixpanel();
  }

  configMixpanel = async () => {
    // alert(MixpanelToken);
    this.mixpanel = await Mixpanel.init("f4bfa686468ac84721eeaa8d44c76cfe");
  };

  identify = (uid) => {
    MixpanelManager.sharedInstance.mixpanel.identify(uid);
  };

  /**
      registerSuperProperties will store a new superProperty and possibly overwriting any existing superProperty with the same name.
    */
  registerSuperProperties = (propertyObj) => {
    MixpanelManager.sharedInstance.mixpanel.registerSuperProperties(
      propertyObj
    );
  };

  setProfileProperties = (propertyObj) => {
    MixpanelManager.sharedInstance.mixpanel.getPeople().set(propertyObj);
  };

  appendProfileProperties = (propertyObj) => {
    MixpanelManager.sharedInstance.mixpanel.getPeople().append(propertyObj);
  };

  resetMixPanel = () => {
    MixpanelManager.sharedInstance.mixpanel.reset();
  };

  trackEventWithProperties = (eventName, propertiesObj) => {
    try {
      //Track an event with a property
      MixpanelManager.sharedInstance.mixpanel.track(eventName, propertiesObj);
    } catch (error) {
      // alert(error);
      console.error(error);
    }
  };
}
