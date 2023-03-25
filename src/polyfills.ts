import { Buffer } from "buffer";

(window as any).process = {
    env:  require("process"),
  };
(window as any).global = window;
global.Buffer = Buffer;
global.process = {
  env: { DEBUG: undefined },
  version: "",
  nextTick: require("next-tick"),
} as any;

