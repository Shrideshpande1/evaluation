const express = require("express");
const jwt = require("jsonwebtoken");
const { PostModel } = require("../models/post.model");

const postRoutes = express.Router();

postRoutes.get("/", async (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, "private", async (err, decode) => {
    if (err) {
      res.send("Please login first");
    } else if (decode) {
      const postID = decode.userID;
      let posts = await PostModel.find({ postID: postID });
      res.send({ data: posts });
    }
  });
});

postRoutes.post("/addpost", async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  jwt.verify(token, "private", async (err, decode) => {
    if (err) {
      res.send("Please login again");
    } else if (decode) {
      const payload = req.body;
      const new_post = new PostModel(payload);
      await new_post.save();
      res.send({ msg: "Post created successfully" });
    }
  });
});

postRoutes.patch("/updatepost/:id", async (req, res, next) => {
  const payload = req.body;
  const ID = req.params.id;
  const token = req.headers.authorization;
  console.log(token);
  jwt.verify(token, "private", async (err, decode) => {
    if (err) {
      res.send("Please login again");
    } else if (decode) {
      const postID = decode.postID;
      const post = await PostModel.findOne({ _id: ID });
      if (postID !== post.postID) {
        res.send("No authorization");
      } else {
        await PostModel.findByIdAndUpdate({ _id: ID }, payload);
        res.send({ msg: "post is updated sucessfully" });
      }
    }
  });
});

postRoutes.delete("/deletepost/:id", async (req, res, next) => {
  const ID = req.params.id;
  const post = await PostModel.findOne({ _id: ID });
  const token = req.headers.authorization;
  console.log(token);
  jwt.verify(token, "private", async (err, decode) => {
    if (err) {
      res.send("Please login again");
    } else if (decode) {
      const postID = decode.postID;

      if (postID !== post.postID) {
        res.send("No authorization");
      } else {
        await PostModel.findByIdAndDelete({ _id: ID });
        res.send({ msg: "post is deleted sucessfully" });
      }
    }
  });
});

module.exports = { postRoutes };
