const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello World..!");
});

app.listen(PORT, () => {
  console.log(`server is up on port ${PORT}`);
});
