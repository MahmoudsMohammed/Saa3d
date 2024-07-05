const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAchatMember = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const url = req.originalUrl.slice(6);
    for(let chat of user.chats){
        if(chat.equals(url)){
            return next();
        }
    }
    res.redirect('/error');
}