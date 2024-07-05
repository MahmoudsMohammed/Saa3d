if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require("mongoose");

const Post = require('../models/post');
const User = require('../models/user');
const Service = require('../models/service');

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch((err) => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

let users = ['Dr.mostafa','Kareem', 'Talat', 'Shenawi', 'Mokn3', 'Fatma',
             'Olivia','Nancy', 'Sofiya'];

let kemo;
const addUsers = async() =>{
    await User.deleteMany({});
    for (let i = 0; i < users.length; i++) {
        // let points = Math.floor(Math.random() * 100);
        const user = new User({ 
            email:users[i]+'@gmail.com',
            username:users[i],
            city:'Asyut',
            gender: (i < 5 ? 'male' : 'female'),
            point: 100,
            joinedAt: Date.now(),
            image:{
                url: `https://res.cloudinary.com/dokcpejo1/image/upload/v1648513749/Saa3d/${(i < 5 ? 'maleNoProfile': 'femaleNoProfile')}`,
                filename: (i < 5 ? 'maleNoProfile' : 'femaleNoProfile')
            },
            notifications : [],
            chats:[],
            services: []
        });
        await User.register(user, '123');
    }
    console.log("- Users added");
}

const addPosts = async () => {
    await Post.deleteMany({});
    kemo = await User.find({username:'Kareem'});
    kemo = kemo[0];
    for (let i = 0; i < 30; i++) {
        let id = Math.floor(Math.random() * users.length);
        let points = Math.floor(Math.random() * 100);
        let user = users[id];
        const post = new Post({
            author: mongoose.Types.ObjectId(kemo._id),
            header:`This is a good header - ${i}`,
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto quos, cupiditate quod doloremque facere iure, perspiciatis a aspernatur, recusandae laboriosam quis quaerat sit qui vero ut expedita tempore atque asperiores. Some quick example text to build on the card title and make up the bulk of the card's content." ,
            city:'Asyut',
            point: points,
            createdAt: Date.now(),
            updatedAt: null,
            comments:[],
            isFinished:0
        })
        await post.save();
    }
    console.log("- Posts added");
}

const addServives = async () => {
    await Service.deleteMany({});
    let talat = await User.find({username:'Talat'});
    let post = await Post.find({});
    talat = talat[0];
    const serv1 = new Service({
        customer:mongoose.Types.ObjectId(kemo._id),
        freelancer:mongoose.Types.ObjectId(talat._id),
        job:mongoose.Types.ObjectId(post[0]._id),
        review:'He is a great person who helped me very well!',
        rate:3,
        isFinished: 1
    })
    const serv2 = new Service({
        customer:mongoose.Types.ObjectId(kemo._id),
        freelancer:mongoose.Types.ObjectId(talat._id),
        job:mongoose.Types.ObjectId(post[0]._id),
        review:'Job still in progress',
        rate:0,
        isFinished: 0
    })
    talat.services.push(serv1);
    talat.services.push(serv2);
    await serv1.save();
    await serv2.save();
    await talat.save();
}

addUsers().then(() => {
    addPosts().then(() => {
        mongoose.connection.close(); 
        console.log("Done");
    });
});