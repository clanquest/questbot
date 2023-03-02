import Keyv from "keyv";
import { settingsPath } from "../config.js";

export const keyv = new Keyv(`sqlite://${ settingsPath }`);
