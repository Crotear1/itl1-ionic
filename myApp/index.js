const express = require("express");
const cors = require("cors");
const loginRouter = require("./routes/login");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/login", loginRouter);

app.listen(8100, () => {
  console.log("server started");
});
