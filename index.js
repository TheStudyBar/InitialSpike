const koa = require("koa");
const path = require("path");
const render = require("koa-ejs");
const static = require("koa-static");
const koaRouter = require("koa-router");
const mime = require('mime-types');
const axios = require("axios");

const app = new koa();
const router = new koaRouter();

render(app, {
    root: path.join(__dirname, "views"),
    layout: "index",
    viewExt: "html",
});

router.get("welcome", "/", (ctx) => {
     return ctx.body = "visit /json to get a json response!";
});

router.get("json", "/json", (ctx) => {
    let jsonType = mime.lookup('json');
    console.log("server address: " + ctx.protocol + "://" + ctx.hostname);
    ctx.response.set("content-type", jsonType);
    let json = {text: "Hello, world!", image:"/public/images/pic.jpg"};
    ctx.body = JSON.stringify(json);
});

app.use(static("public"));
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));