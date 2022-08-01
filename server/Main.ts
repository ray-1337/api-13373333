import Express from "express";
import CORS from "cors";
import {config as dotenvConfig} from "dotenv";
import {contentSecurityPolicy, noSniff, ieNoOpen, xssFilter, frameguard, hidePoweredBy, expectCt, hsts} from "helmet";
import { resolve } from "path";
import Cache from "../bot/Cache";

const path = resolve(__dirname, "../", ".env");
const envConfig = dotenvConfig({path});
const app = Express();

const CORSOptions = CORS({
  "origin": "13373333.one",
  "methods": ["GET", "OPTIONS"],
  "optionsSuccessStatus": 200,
  "credentials": true,

  "allowedHeaders": [
    // "Access-Control-Allow-Headers", 
    // "Access-Control-Allow-Origin",
    // "access-control-allow-credentials",
    "Origin", 
    "X-Requested-With", 
    "Content-Type",
    // "Access-Control-Request-Method",
    // "Access-Control-Request-Headers",
    // "Authorization",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-Type",
    "Date"
  ],
  
  "exposedHeaders": [
    "Content-Range", 
    "X-Content-Range", 
    "Content-Length", 
    "Content-Disposition", 
    "Etag", 
    "Server-Timing", 
    "Vary", 
    "X-Content-Type-Options"
  ]
});

app
.use(contentSecurityPolicy({ useDefaults: true }))
.use(noSniff())
.use(ieNoOpen())
.use(xssFilter())
.use(frameguard({action: "SAMEORIGIN"}))
.use(hidePoweredBy())
.use(expectCt({maxAge: 86400}))
.use(hsts({maxAge: 63072000, preload: true, includeSubDomains: true}))

// app.use(CORSOptions);
// app.options("*", CORSOptions);
app.set("env", "production").disable("etag").set("title", "API for 13373333.one");

app
.get("/discord", (req, res) => {
  const data = Cache.get();
  if (data) {
    return res.set({"content-type": "application/json"}).status(200).send(data);
  } else {
    return res.set({"content-type": "application/json"}).status(200).send("null");
  };
})
.get("/alive", (req, res) => {
  return res.status(200).send("Yes, it's alive.");
});

// connect
const PORT = +envConfig.parsed!["PORT"];

export default app.listen(PORT, async function() {
  console.log(`Server: Connected. (${PORT})`);
});