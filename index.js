const Koa = require("koa");
const path = require("path");
const render = require("koa-ejs");
const static = require("koa-static");
const koaRouter = require("koa-router");
const mime = require('mime-types');
const axios = require("axios");
const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");

var app = new Koa();
var router = new koaRouter();

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

router.get("image", "/image/:resource_id", async (ctx) => {
    let resource_id = ctx.params["resource_id"];
    console.log("retrieving image for id " + resource_id);

    const s3GetObjectParams = {
        Bucket: "thestudybar-initialspike", Key: "BoardPictureWithTriciaAndBecky.png", ResponseContentType: "image/png"
    };

    const s3Client = new S3Client({ region: "us-east-2"});
    let data = null;
    try {
        data = await s3Client.send(new GetObjectCommand(s3GetObjectParams));
        console.log("Successfully retrieved bucket object");
    } catch (err) {
        console.log("Error retrieving bucket object: ", err);
        ctx.response.httpStatusCode = 500;
    }

    ctx.response.set("content-type", "image/png");
    ctx.body = data.Body;
    ctx.httpStatusCode = 200;
    console.log("replied!");
});

app.use(static("public"));
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));