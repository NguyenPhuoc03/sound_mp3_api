const artistRouter = require("./artist");
const albumRouter = require("./album");
const songRouter = require("./song");
const userRouter = require("./user");
const historyRouter = require("./history");
const authRouter = require("./auth");

const authMiddleware = require("../middlewares/authMiddleware");

function route(app) {
  //không can qua authMiddleware (access_token, refresh)
  app.use("/auth", authRouter);

  app.use(authMiddleware);
  //bt buoc phai qua authMiddleware (access_token, refresh)
  app.use("/artist", artistRouter);
  app.use("/album", albumRouter);
  app.use("/song", songRouter);
  app.use("/user", userRouter);
  app.use("/history", historyRouter);

  app.get("/", (req, res) => {
    res.send("hello world");
  });
}

module.exports = route;
