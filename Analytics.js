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
}
