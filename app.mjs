import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/WikiDb");
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);
//////////////////////////////////////////// Requesting all articles /////////////////////////////////////////////////
app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const Item = new Article({ title: title, content: content });
    Article.findOne({ title: title })
      .then((data) => {
        if (!data) {
          // if data is not presend then save
          Item.save();
          res.send("Successfully added new article...");
        } else {
          res.send("Article already added");
        }
      })
      .catch((err) => {
        console.log("Thier is some error in Adding Article");
      });
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then((data) => {
        res.send("Successfully deleted all the articles..");
      })
      .catch((err) => {
        res.send("Their is some problem in deleting the Articles");
      });
  });
//////////////////////////////////////////// Requesting specific articles /////////////////////////////////////////////////
app
  .route("/articles/:ArticleName")
  .get((req, res) => {
    const item = req.params.ArticleName;
    Article.findOne({ title: item })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .put((req, res) => {
    const item = req.params.ArticleName;
    const title = req.body.title;
    const content = req.body.content;
    Article.updateOne({ title: item }, { content: content })
      .then((data) => {
        res.send("Successfullly updates...");
      })
      .catch((err) => {
        res.send("Their is some error");
      });
  })
  .delete((req, res) => {
    const item = req.params.ArticleName;
    Article.findOneAndDelete({ title: item })
      .then((data) => {
        res.send("Successfully deleted...");
      })
      .catch((err) => {
        res.send("Their is some error...");
      });
  });
app.listen(3000, () => {
  console.log("Server started...");
});
