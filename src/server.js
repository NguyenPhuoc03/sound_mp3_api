const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./config/db/connectDatabase");
const port = 3000;

const route = require("./routes/index");
const {
  errorHandlingMiddleware,
} = require("./middlewares/errorHandlingMiddleware");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Connect DB
db.connect();

// Route Init
route(app);

// middleware xu li loi
app.use(errorHandlingMiddleware);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
