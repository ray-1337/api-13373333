import Cache from "node-cache";
import ms from "ms";
import { type Presence } from "eris";

const cache = new Cache();
const key = "data";
const expire = ms("12h") / 1000; 

function set<R>(data: R) {
  return cache.set(key, data, expire);
};

function reset() {
  cache.del(key);
  return cache.set(key, null);
};

function get() {
  return cache.get<Presence | null>(key);
};

export default {
  get, set, reset, cache
};