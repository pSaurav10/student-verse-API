const Post = require('../model/post');
const User = require('../model/user');
const asyncHandler = require("../auth/async");
const ErrorResponse = require("../auth/ErrorResponse");
const { body, validationResult } = require('express-validator');
const profanity = require('../auth/profanity');
// -----------------FIND all Post-------------------
exports.loadPosts = asyncHandler(async (req, res, next) => {
    const post = await Post.find().sort({ 'createdAt': -1 });
    res.status(201).json({
        success: true,
        count: post.length,
        data: post
    })
});

// -----------------FIND Post BY ID-------------------
exports.loadPostsById = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);


    if (!post) {
        return res.status(404).json({ success: false, message: "No Post Found" });
    }
    else if (post) {
        post.views = post.views + 1;
        await post.save();
        res.status(200).json({
            success: true,
            data: post
        });
    }
});

// -----------------Create Question-------------------
exports.addPost = asyncHandler(async (req, res, next) => {
    const result = validationResult(req);
    var censored = false;
    var cleartags = [];
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(203).json({ success: false , error: errors })
    }
    else {
        const { title, tags, body } = req.body;
        if(profanity.exists(title) || profanity.exists(body)){
            censored = true
        }
        for(i in tags){
            const checktags = profanity.censor(tags[i])
            cleartags.push(checktags);
        }
        const cleartitle = profanity.censor(title);
        const clearbody = profanity.censor(body);
        const author = req.user.id;
        const post = await Post.create({
            title: cleartitle,
            tags: cleartags,
            author,
            body: clearbody,
            censored
        });
        res.status(201).json({ success: true, message: "Post added Successfully", data: post });
    }
});


exports.loadUserPost = asyncHandler(async (req, res, next) => {
    const post = await Post.find({ author: req.user._id });
    if (post.length === 0) {
        return res.status(404).json({ success: false, message: "User has not posted any queries" });
    }
    else {

        res.status(200).json({
            success: true,
            count: post.length,
            data: post
        });
    }
});

exports.loadOtherPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.find({ author: id });
    if (post.length === 0) {
        return res.status(404).json({ success: false, message: "User has not posted any queries" });
    }
    else {

        res.status(200).json({
            success: true,
            count: post.length,
            data: post
        });
    }
});


exports.updatePost = asyncHandler(async (req, res, next) => {
    const { id, title, body, tags } = req.body;
    Post.updateOne({ _id: id }, {
        title: title, body: body, tags: tags
    })
        .then(function (result) {
            res.status(200).json({ success: true, message: "Post Updated" })
        })
        .catch(function (err) {
            res.status(500).json({ success: false, message: "Update failure" })
        })
});



// -----------------Delete Question-------------------
exports.removePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ success: false, message: "No post found" })
    }

    await post.remove();
    res.status(200).json({ success: true, message: "Post deleted Successfully" });
});

