// to access user db from models folder
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const User = require('../models/user');
const Country = require('../models/country');
const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');
const { Image } = require('../models/user');

// rendering registering & login form 
module.exports.renderRegister = async (req, res) => {
    const cities = await Country.find({name : 'Egypt'});
    res.render('users/login&signup', {path: req.path, cities: cities[0].cities});
};

module.exports.renderProfile = async (req, res) => {
    const user = await User.findById(req.params.userId).populate({
        path: 'services',
        populate: {
            path: 'customer'
        }
    }).populate({
        path: 'services',
        populate: {
            path: 'job'
        }
    }).populate({
        path: 'services',
        populate: {
            path: 'freelancer'
        }
    });
    let rate = 0, servicesCnt = 0;
    for(let r of user.services){
        if(r.isFinished == 2 && r.freelancer._id.equals(user._id)){
            rate += r.rate;
            servicesCnt++;
        }
    }
    let btn = req.query.f || 'from-me', posts;
    if(btn == 'posted')
        posts = await Post.find({"author": {"$eq": user._id}, "isFinished" :{"$eq": false}});
    
    if(servicesCnt) 
        rate = Math.floor(rate/servicesCnt);
    else rate = 0;
    res.render('users/profile', {user, rate, btn, servicesCnt, posts});
};

module.exports.renderSettings = async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.render('users/settings', {user});
};

module.exports.renderStanding = async (req, res) => {
    const standing = await User.find({}).sort({'point': -1,'username':1 }).limit(10);
    res.render("users/standing", {standing});
};


// registering new user and logging him in and redirect him to all users page
module.exports.register = async (req, res) => {
    try {
        const { remail, rusername, rpassword,confirmPassword ,city, gender } = req.body;
        let img = {
            url: `${process.env.UPLOAD_URL}${(gender == 'male'? 'maleNoProfile': 'femaleNoProfile')}`,
            filename: (gender == 'male'? 'maleNoProfile' : 'femaleNoProfile')
        };
        const user = new User({ 
            email:remail, 
            username:rusername.split(' ').join('_'), 
            city, 
            gender,
            point: 100,
            isOnline: true,
            joinedAt: Date.now(),
            image: img,
            notifications: [],
            chats:[],
            services: []
        });
        if(rpassword != confirmPassword){
            throw new Error("The two passwords aren't identical");   
        }
        const registeredUser = await User.register(user, rpassword);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome To Saa3d ${rusername}!!!`);
            res.redirect(`/profile/${registeredUser._id}`);
        })
    } catch (e) {
        if(e.message.includes('E11000'))// dublicate email error
           e.message = 'A user with the given email is already registered';
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.updateSettings = async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    if(images[0] && user.image.filename != 'maleNoProfile' && user.image.filename != 'femaleNoProfile'){
        await cloudinary.uploader.destroy(user.image.filename);
    }
    if(images[0]){
        user.image = images[0];
        await user.save();
    }
    const {oldPassword, newPassword, confirmNewPassword} = req.body;
    if(oldPassword != '' && newPassword != '' && confirmNewPassword != ''){
        if(newPassword != confirmNewPassword){
            req.flash('error', "The two passwords aren't identical");
            return res.redirect(`/profile/${req.params.userId}/settings`);
        }
        await user.changePassword(oldPassword, newPassword)
                  .then(e => {
                    req.flash('success', 'Succesfuly updated your info');
                    res.redirect(`/profile/${req.params.userId}`);            
                  })
                  .catch(e => {
                    req.flash('error', 'Check the old password');
                    res.redirect(`/profile/${req.params.userId}/settings`);
                })
    }
    else{
        req.flash('success', 'Succesfuly updated your info');
        res.redirect(`/profile/${req.params.userId}`);
    }
 };

// login user
module.exports.login = async (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!!!`);
    const user = await User.findById(req.user._id);
    user.isOnline = true;
    await user.save();
    // to know if user want to visit page before logging in
    // const redirectUrl = '/home';
    // delete req.session.returnTo;
    res.redirect(`/profile/${req.user._id}`);
};


// logging user out
module.exports.logout = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.isOnline = false;
    await user.save();
    req.flash('success', `Good bye ${req.user.username} let us see you soon`);
    req.logout();
    res.redirect('/login');
};