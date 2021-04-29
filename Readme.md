# Cloudflare Worker Rest Api

This library helps build serverless rest api with cloudflare workers

## Description

The idea behind this package was to create a library that would be as close to express framework as possible, and that would make creating Rest Apis with Workers quick and easy.

### Installing

Begin by installing the package with npm.

```
npm install cloudflare-worker-rest-api --save
```

### Example App

For a fully working example check out this [project](https://github.com/rajtatata/cloudflare-worker-example-rest-api)

## How to use

Import the package and initialize your app.

```js
const restCfWorker = require("cloudflare-worker-rest-api");
const app = new restCfWorker();

// ....

addEventListener("fetch", (event) => {
  event.respondWith(app.handleRequest(event.request));
});
```

In order for cloudflare to use your app, we need to call `app.handleRequest` on the fetch event listener.

### Rest API

The supported methods are POST, GET, DELETE, PATCH, PUT and ANY.

```js
// supports middlewares
app.use((req, res) => {
  // do some authenticate process
  req.isAuthenticated = true;
});

app.get("/path-here", (req, res) => {
  // access query
  const { filter, page } = req.query();

  return res.send({ status: 1, message: "Hello stranger!" });
});

// Three parameters for req.send method
// First one is Response Data
// Second one is Headers, by default it is set to {'content-type': 'application/json'}
// Third one is Status Code, by default it is set to 200
app.get("/path-here", async (req, res) => {
  // access header
  const contentType = await req.header("content-type");
  if (contentType === "application/json") {
    return res.send({ status: 1, message: "File Created!" }, 201);
  }

  return res.send(
    "This is a string response",
    { "content-type": "text/plain" },
    200
  );
});

app.get("/path-here", async (req, res) => {
  // access header
  const contentType = await req.header("content-type");
  if (contentType === "application/json") {
    return res.send({ status: 1, message: "This is a JSON response!" });
  }

  return res.send("This is a string response", {
    "content-type": "text/plain",
  });
});

app.post("/path-here", async (req, res) => {
  // access body
  const { username } = await req.body();

  if (!req.isAuthenticated) {
    // supports status code
    return res.send(
      // undefined to send default headers
      { status: 1, message: "Bro, you not supposed to be here!" },
      undefined,
      401
    );
  }
  return res.send({
    status: 1,
    message: "Hello stranger, why are you still here!",
  });
});

// supports path params
app.delete("/item/:itemId", (req, res) => {
  const { itemId } = req.params;

  return res.send({ status: 1, message: `Oh no, you deleted item ${itemId}` });
});
```

### Routing

The package also supports routers, if you want to divide your code in multiple files.

```js
// ./routers/auth.js
const restCfWorker = require("cloudflare-worker-rest-api");

const router = new restCfWorker();

router.post("/login", (req, res) => {
  return res.send({ status: 1, message: "Successfully logged in!" });
});

// export the router
module.exports = router;
```

Then you can call your router file in your index file

```js
const restCfWorker = require("cloudflare-worker-rest-api");
const authRouter = require("./routers/auth.js");

const app = new restCfWorker();

// use router
app.use("/auth", authRouter);

addEventListener("fetch", (event) => {
  event.respondWith(app.handleRequest(event.request));
});
```

The login route now would be `POST /auth/login`
