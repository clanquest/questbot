import * as Keyv from "keyv";
import { settingsPath } from "../config";

export const keyv = new Keyv(`sqlite://${ settingsPath }`);
