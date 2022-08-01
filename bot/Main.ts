import {Client, type Member, type Guild} from "eris";
import {config as dotenvConfig} from "dotenv";
import Cache from "./Cache";
import { resolve } from "path";

const path = resolve(__dirname, "../", ".env");
const envConfig = dotenvConfig({path});
const ownerID = "331265944363991042";

if (!envConfig?.parsed || envConfig.error) {
  console.log(envConfig.error);
  throw "Unable to open .env file";
};

const token = envConfig.parsed["TOKEN"];

const bot = new Client(`Bot ${token}`, {
  intents: ["guilds", "guildPresences", "guildMembers"],
  getAllUsers: true,
  restMode: true
});

bot.on("ready", async () => {
  console.log("Bot: Connected.");

  try {
    let ownerContent = await bot.getRESTUser(ownerID);
    if (ownerContent) {
      Cache.set("user", ownerContent.toJSON());
    } else {
      Cache.set("user", null);
    };
  } catch (error) {
    console.error(error);
    return;
  };
});

bot.on("guildCreate", (guild: Guild) => {
  if (guild.id !== "861938470841745459") return;

  let personnel = guild.members.get(ownerID);
  if (personnel && personnel.activities?.length) {
    return Cache.set("presence", personnel.activities);
  } else {
    return;
  };
})

bot.on("presenceUpdate", (member: Member, _) => {
  // not creator itself, or any bot
  if (member.bot || member.id !== ownerID) return;

  // no activities
  if (!member?.activities?.length) {
    return Cache.reset("presence", );
  };

  return Cache.set("presence", member.activities);
});

bot
.on("error", console.error)
.on("warn", console.warn);

export default bot.connect();