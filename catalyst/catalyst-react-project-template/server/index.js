"use strict";
const express = require("express");
const path = require("path");
const app = express();
app.use(express());
const appDir = path.join(__dirname, "../client");
app.use(express.static(appDir));
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT;

app.get("/", function (req, res) {
  res.sendFile(path.join(appDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});