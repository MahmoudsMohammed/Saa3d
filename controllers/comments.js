const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.addComment = async (req, res) => {
    const post = await Post.findById(req.params.postId);
    const comment = new Comment({
        author: req.user._id,
        body: req.body.comment
    });
    post.comments.push(comment);
    await comment.save();
    await post.save();
    const postAuth = await User.findById(post.author);
    postAuth.unreadNotf++;
    await postAuth.save();
    req.flash('success', 'Successfuly added a new comment');
    res.redirect(`/post/${req.params.postId}`);
};

module.exports.deleteComment = async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.postId, { $pull: { comments: req.params.commentId } });
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success', 'Successfuly removed the comment');
    res.redirect(`/post/${req.params.postId}`);
};

// user = await User.findById(id);
//     console.log(user.unreadNotf);
//     user.unreadNotf++;
//     console.log(user.unreadNotf);
//     await user.save();