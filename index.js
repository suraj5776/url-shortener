const express = require("express");
const path = require("path");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const { connectToMongoDb } = require("./connect");

const app = express();
const PORT = 8000;

//----------------------------------------------------------------------------------- MongoDb connection
connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Connected to mongoDb");
});

//-------------------------------------------------------------------------------- set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// -----------------------------------------------------------------------------middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/", staticRoute);

app.use("/url", urlRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

// -------------------------------------------------------------------------------------------- server listen
app.listen(PORT, () => {
  console.log(`Server is started on : ${PORT}`);
});
