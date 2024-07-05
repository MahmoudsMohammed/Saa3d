const User = require('../models/user');
const Post = require('../models/post');
const Notification = require('../models/notification');
const Comment = require('../models/comment');
const Service = require('../models/service');

module.exports.acceptOffer = async (req, res) => {
    // sending notification
    const {postId, commentId} = req.params;
    const post = await Post.findById(postId);
    const comment = await Comment.findById(commentId);
    const commentAuthor = await User.findById(comment.author);
    const customer = await User.findById(post.author);
    const notification = new Notification({
        user: req.user._id,
        date: Date.now(),
        body: `You have been chosen to complete '${post.header}' job`,
        link: `/post/${post._id}`
    });
    post.isFinished = 1;
    commentAuthor.notifications.push(notification);
    commentAuthor.unreadNotf++;
    await notification.save();
    // create service
    let service = new Service({
        customer:post.author,
        freelancer:comment.author,
        job:post._id,
        review:'Job still in progress',
        rate: 0,
        isFinished : false
    });
    commentAuthor.services.push(service);
    customer.services.push(service);
    customer.point -= post.point;
    await service.save();
    await customer.save();
    await commentAuthor.save();
    await post.save();
    req.flash('success', `Your job in procces now`);
    res.redirect(`/post/${postId}`);            
};

module.exports.jobFinished = async (req, res) => {
    const {serviceId} = req.params;
    const service = await Service.findById(serviceId);
    const post = await Post.findById(service.job._id);
    service.isFinished = 1;
    const notification = new Notification({
        user: service.freelancer._id,
        date: Date.now(),
        body: `Your '${post.header}' job has been finished, it's your turn to give me a feedback`,
        link: `/profile/${service.freelancer._id}`
    });
    const customer = await User.findById(service.customer._id);
    customer.notifications.push(notification);
    await notification.save();
    await customer.save();
    await service.save();
    req.flash('success', `The notification has been sent to ${customer.username}`);
    res.redirect(req.get('referer'));
};

module.exports.postReview = async (req, res) => {
    const {serviceId} = req.params;
    let {review, rate} = req.body;
    const service = await Service.findById(serviceId);
    const post = await Post.findById(service.job);
    service.review = review;
    if(!rate) rate = 1;
    service.rate = rate;
    const notification = new Notification({
        user: service.customer._id,
        date: Date.now(),
        body: `There is a new feedback on your profile!`,
        link: `/profile/${service.freelancer._id}`
    });
    const freelancer = await User.findById(service.freelancer._id);
    freelancer.notifications.push(notification);
    freelancer.point += post.point;
    service.isFinished = 2;
    await notification.save();
    await freelancer.save();
    await service.save();
    req.flash('success', 'Successfuly added your review!');
    res.redirect(req.get('referer'));
};
