const User = require('../models/user');
const Post = require('../models/post');
const Notification = require('../models/notification');

module.exports.renderNotifications = async (req, res) => {
    const user = await User.findById(req.params.userId).populate({
        path: 'notifications',
        populate: {
            path: 'user'
        }
    });
    const notifications = user.notifications.sort(notfiCompare);
    user.unreadNotf = 0;
    await user.save();
    res.render('notifications/notification', { notifications });
};

module.exports.addNotification = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    const postAuthor = await User.findById(post.author);
    const notification = new Notification({
        user: req.user._id,
        date: Date.now(),
        body: `Commented on your '${post.header}' post`,
        link: `/post/${post._id}`
    });
    postAuthor.notifications.push(notification);
    await notification.save();
    await postAuthor.save();
    next();
}

// sorting notifications by date
function notfiCompare( a, b ) {
    if (a.date < b.date)
        return 1;
    return -1;
}