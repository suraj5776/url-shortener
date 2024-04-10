const express = require("express");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const { connectToMongoDb } = require("./connect");

const app = express();
const PORT = 8000;

connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Connected to mongoDb");
});

app.use(express.json());

app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
            timestamps : Date.now()
        }
      },
    }
  );res.redirect(entry.redirectURL);

});

app.listen(PORT, () => {
  console.log(`Server is started on : ${PORT}`);
});
