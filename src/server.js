require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
app.use(cors({
  methods: ['GET', 'POST', 'OPTIONS'], // Chấp nhận các phương thức GET, POST và OPTIONS (preflight)
  allowedHeaders: ['Content-Type'], // Header yêu cầu
}));
const db = require("./config/db/connectDatabase");

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

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});
