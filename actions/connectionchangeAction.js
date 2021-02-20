import { INTERNET_CONNECTED, INTERNET_DISCONNECTED } from "./types";

export const internetConnected = () => ({ type: INTERNET_CONNECTED });

export const internetDisconnected = () => ({ type: INTERNET_DISCONNECTED });
