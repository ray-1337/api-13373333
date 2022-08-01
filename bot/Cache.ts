import Cache from "node-cache";
import ms from "ms";
import { type Presence } from "eris";

const cache = new Cache();
const expire = ms("12h") / 1000; 

type Key = "user" | "presence";

function set<R>(key: Key, data: R) {
  return cache.set(key, data, expire);
};

function reset(key: Key) {
  cache.del(key);
  return cache.set(key, null);
};

function get(key: Key) {
  return cache.get<Presence | null>(key);
};

export default {
  get, set, reset, cache
};